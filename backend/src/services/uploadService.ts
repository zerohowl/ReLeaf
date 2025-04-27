import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';
import { UploadedFile } from 'express-fileupload';
import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';
import jsQR from 'jsqr';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const prisma = new PrismaClient();

// --- Gemini Integration --- 
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY not found in .env. Image analysis will be disabled.");
}
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const geminiModel = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;

// Base directory for all uploads
const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Ensure upload directories exist
fs.ensureDirSync(path.join(UPLOAD_DIR, 'images'));
fs.ensureDirSync(path.join(UPLOAD_DIR, 'videos'));

interface FileUploadResult {
  id: number;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  mimeType: string;
  analysis?: {
    identifiedItem: string;
    recyclingInfo: string;
  };
}

/**
 * Process an uploaded file, extract QR code if present, and save to disk and database
 */
export async function processUpload(
  userId: number,
  file: UploadedFile, // Standardize on UploadedFile
  description?: string
): Promise<FileUploadResult> {
  try {
    // We'll define variables for processing later in the code

    // Check file size first (limit to 50MB)
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File too large. Maximum size is 50MB. Your file is ${Math.round(file.size / (1024 * 1024))}MB.`);
    }

    // Basic mime type check from the uploaded file object
    const isImage = file.mimetype.startsWith('image/');
    const isVideo = file.mimetype.startsWith('video/');
    
    if (!isImage && !isVideo) {
      // This check might be redundant if controller validation is robust,
      // but good for service layer integrity.
      throw new Error('Unsupported file type. Only images and videos are allowed.');
    }
    
    // Enhanced security: Verify file type by examining file contents
    // file.data contains the buffer for express-fileupload
    const fileBuffer = file.data;
    if (!fileBuffer) {
        throw new Error('File data buffer is missing.');
    }
    
    // Verify the actual file contents match the claimed mime type
    const fileTypeResult = await fileTypeFromBuffer(fileBuffer);
    
    if (!fileTypeResult) {
      throw new Error('Unknown file type. Could not verify file contents.');
    }
    
    const actualMimeType = fileTypeResult.mime;
    const isActualImage = actualMimeType.startsWith('image/');
    const isActualVideo = actualMimeType.startsWith('video/');
    
    if (!isActualImage && !isActualVideo) {
      throw new Error('Detected file type is not an image or video. Upload rejected.');
    }
    
    // Check if claimed mime type matches actual file contents
    if ((isImage && !isActualImage) || (isVideo && !isActualVideo)) {
      throw new Error(`File content (${actualMimeType}) does not match claimed file type (${file.mimetype}). Upload rejected.`);
    }
    
    const fileType = isActualImage ? "IMAGE" : "VIDEO"; // Use actual type
    const subDir = isActualImage ? 'images' : 'videos';
    
    // Define original filename and extension
    const originalFileName = file.name; 
    const originalFileExt = path.extname(originalFileName);

    // --- Image Processing & QR Code Detection Logic ---
    let processedBuffer: Buffer;
    let processedFileName: string;
    let processedMimeType: string;
    let processedFilePath: string;
    let finalFullPath: string | undefined;
    let finalFileSize: number;
    let qrCodeData: string | null = null;
    let analysisResult: { identifiedItem: string; recyclingInfo: string } | null = null;

    if (isActualImage) {
      console.log(`Processing image: ${originalFileName}`);
      
      // --- QR Code Detection --- 
      try {
        // Need raw pixel data for jsqr
        const rawImageData = await sharp(fileBuffer)
          .raw()
          .ensureAlpha() // Ensure RGBA format for jsqr
          .toBuffer({ resolveWithObject: true });

        const code = jsQR(
          Uint8ClampedArray.from(rawImageData.data),
          rawImageData.info.width,
          rawImageData.info.height
        );

        if (code) {
          qrCodeData = code.data;
          console.log("Detected QR Code data:", qrCodeData);
        } else {
          console.log("No QR Code detected.");
        }
      } catch (qrError) {
        console.error("Error during QR Code detection:", qrError);
        // Continue without QR data if detection fails
      }
      // --- End QR Code Detection ---
      
      // Process with sharp: resize, convert to webp
      processedBuffer = await sharp(fileBuffer)
        .resize({ width: 1024, height: 1024, fit: 'inside', withoutEnlargement: true }) // Resize smartly
        .webp({ quality: 80 }) // Convert to WebP with good quality
        .toBuffer();
      
      processedFileName = `${uuidv4()}.webp`; // New name with .webp extension
      processedMimeType = 'image/webp';
      processedFilePath = path.join(subDir, processedFileName); // Path relative to UPLOAD_DIR
      finalFullPath = path.join(UPLOAD_DIR, processedFilePath);
      finalFileSize = processedBuffer.length;

      // Save the processed buffer
      await fs.writeFile(finalFullPath, processedBuffer);
      console.log(`Saved processed image to: ${finalFullPath}`);
      
      // --- Gemini Image Analysis ---
      
      if (geminiModel) {
        try {
          console.log(`Sending image ${processedFileName} to Gemini for analysis...`);
          const imageBase64 = processedBuffer.toString('base64');
          
          // Construct the prompt, including QR data if available
          let prompt = "Identify the main object in this image.";
          if (qrCodeData) {
            prompt += ` The item has a QR code containing this data: ${qrCodeData}. Use this data to improve identification if possible.`;
          }
          prompt += " Provide a concise item name and brief, practical instructions on HOW to recycle it (assume typical US recycling rules, e.g., rinse, flatten). Do NOT specify WHERE to recycle it. Format the response as JSON with keys 'identifiedItem' and 'recyclingInfo'. Example: {\"identifiedItem\": \"Aluminum Soda Can\", \"recyclingInfo\": \"Empty, rinse, and recycle with metals.\"}";
          
          const generationConfig = {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 8192,
          };

          const safetySettings = [
              { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
              { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
              { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
              { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          ];

          const parts = [
            {text: prompt},
            {inlineData: { mimeType: processedMimeType, data: imageBase64}}
          ];

          const result = await geminiModel.generateContent({ contents: [{role: "user", parts}], generationConfig, safetySettings});
          const response = result.response;
          const text = response.text();
          console.log("Gemini raw response:", text);

          // Attempt to parse the JSON response from Gemini
          try {
            // Clean the response: remove markdown code fences if present
            const cleanedText = text.replace(/```json\n?|```/g, '').trim();
            analysisResult = JSON.parse(cleanedText);
            console.log("Parsed Gemini analysis:", analysisResult);
          } catch (parseError) {
            console.error("Failed to parse Gemini JSON response:", parseError);
            console.error("Raw Gemini text was:", text);
            // Store raw text as fallback
            analysisResult = { identifiedItem: "Analysis Error", recyclingInfo: "Could not parse AI response." };
          }

        } catch (geminiError) {
          console.error("Error calling Gemini API:", geminiError);
          analysisResult = { identifiedItem: "Analysis Failed", recyclingInfo: "Error communicating with AI." };
        }
      } else {
        console.warn("Gemini API key not configured. Skipping analysis.");
      }
      // --- End Gemini Analysis ---

    } else {
      // For videos or other types, save original
      console.log(`Saving original file (not an image): ${originalFileName}`);
      processedBuffer = fileBuffer; // Use original buffer
      processedFileName = `${uuidv4()}${originalFileExt}`; // Keep original extension
      processedMimeType = actualMimeType; // Keep original mime type
      processedFilePath = path.join(subDir, processedFileName);
      finalFullPath = path.join(UPLOAD_DIR, processedFilePath);
      finalFileSize = file.size; // Keep original size

      // Save the original buffer (using mv is simpler for express-fileupload)
      await file.mv(finalFullPath); 
      console.log(`Saved original file to: ${finalFullPath}`);
      
      // No analysis for videos
      analysisResult = null;
    }
    

    
    // Save file info to database using processed details
    const upload = await prisma.upload.create({
      data: {
        userId,
        fileType,
        fileName: processedFileName, // Use processed name
        filePath: processedFilePath, // Use processed path
        fileSize: finalFileSize,    // Use processed size
        mimeType: processedMimeType, // Use processed MIME type
        description,
        // Cast to Prisma.InputJsonValue to avoid type errors
        identifiedItem: analysisResult?.identifiedItem as string, // Add analysis results
        recyclingInfo: analysisResult?.recyclingInfo as string,   // Add analysis results
        history: {
          create: {
            action: 'created',
            metadata: JSON.stringify({
              originalName: originalFileName, // Store original name
              timestamp: new Date().toISOString()
            })
          }
        }
      }
    });
    
    return {
      id: upload.id,
      fileName: upload.fileName,
      filePath: upload.filePath,
      fileType: upload.fileType,
      fileSize: upload.fileSize,
      mimeType: upload.mimeType,
      analysis: analysisResult || undefined
    };
  } catch (error) {
    console.error('Error processing file:', error);
    // Don't attempt cleanup here since finalFullPath is only defined in local scope
    // and might not be accessible from this catch block
    throw error;
  }
}

/**
 * Get all uploads for a user
 */
export async function getUserUploads(userId: number) {
  return prisma.upload.findMany({
    where: { userId },
    orderBy: { uploadedAt: 'desc' }
  });
}

/**
 * Get single upload with history
 */
export async function getUploadWithHistory(uploadId: number, userId: number) {
  const upload = await prisma.upload.findFirst({
    where: { 
      id: uploadId,
      userId // Security check: ensure the upload belongs to the user
    },
    include: {
      history: {
        orderBy: { timestamp: 'desc' }
      }
    }
  });
  
  if (upload) {
    // Record a view in the history
    await recordHistory(uploadId, 'viewed');
  }
  
  return upload;
}

/**
 * Record an action in the upload history
 */
export async function recordHistory(
  uploadId: number, 
  action: string,
  metadata?: Record<string, any>
) {
  return prisma.uploadHistory.create({
    data: {
      uploadId,
      action,
      metadata: metadata ? JSON.stringify(metadata) : null
    }
  });
}

/**
 * Delete an upload and its associated file
 */
export async function deleteUpload(uploadId: number, userId: number) {
  // First get the upload to check ownership and get the file path
  const upload = await prisma.upload.findFirst({
    where: { 
      id: uploadId,
      userId // Security check: ensure the upload belongs to the user
    }
  });
  
  if (!upload) {
    throw new Error('Upload not found or access denied');
  }
  
  // Delete the physical file
  const fullPath = path.join(UPLOAD_DIR, upload.filePath);
  if (fs.existsSync(fullPath)) {
    await fs.remove(fullPath);
  }
  
  // Delete from database (cascade will handle history deletion)
  await prisma.upload.delete({
    where: { id: uploadId }
  });
  
  return true;
}
