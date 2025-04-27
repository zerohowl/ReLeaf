import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';

// Extended request type to include file upload properties
interface FileUploadRequest extends Request {
  file?: Express.Multer.File;
  files?: {
    [fieldname: string]: UploadedFile | UploadedFile[];
  };
}
import * as uploadService from '../services/uploadService';

// Handle file upload
export async function uploadFile(req: FileUploadRequest, res: Response) {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).send('Authentication required');
    }

    if (!req.files && !req.file) {
      return res.status(400).send('No file uploaded');
    }

    // Get file from express-fileupload
    if (!req.files || !req.files.file) {
      return res.status(400).send('Invalid file upload');
    }
    
    const file = req.files.file as UploadedFile;
    
    // Validate file type - only accept images and videos
    const isImage = file.mimetype.startsWith('image/');
    const isVideo = file.mimetype.startsWith('video/');
    
    if (!isImage && !isVideo) {
      return res.status(400).json({
        error: 'Invalid file type',
        message: 'Only image and video files are allowed'
      });
    }

    const description = (req.body.description as string) || undefined;
    
    const result = await uploadService.processUpload(userId, file, description);
    
    res.status(201).json(result);
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).send(`Upload failed: ${error.message}`);
  }
}

// Get all uploads for the authenticated user
export async function getUserUploads(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const uploads = await uploadService.getUserUploads(userId);
    res.json(uploads);
  } catch (error: any) {
    console.error('Error fetching uploads:', error);
    res.status(500).send(`Server error: ${error.message}`);
  }
}

// Get a specific upload with its history
export async function getUpload(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const uploadId = parseInt(req.params.id, 10);
    
    if (isNaN(uploadId)) {
      return res.status(400).send('Invalid upload ID');
    }
    
    const upload = await uploadService.getUploadWithHistory(uploadId, userId);
    
    if (!upload) {
      return res.status(404).send('Upload not found');
    }
    
    res.json(upload);
  } catch (error: any) {
    console.error('Error fetching upload:', error);
    res.status(500).send(`Server error: ${error.message}`);
  }
}

// Record an action in the upload history
export async function recordHistory(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const uploadId = parseInt(req.params.id, 10);
    const { action, metadata } = req.body;
    
    if (!action || isNaN(uploadId)) {
      return res.status(400).send('Invalid parameters');
    }
    
    // Verify that the upload belongs to the user
    const upload = await uploadService.getUploadWithHistory(uploadId, userId);
    if (!upload) {
      return res.status(404).send('Upload not found');
    }
    
    const result = await uploadService.recordHistory(uploadId, action, metadata);
    res.status(201).json(result);
  } catch (error: any) {
    console.error('Error recording history:', error);
    res.status(500).send(`Server error: ${error.message}`);
  }
}

// Delete an upload
export async function deleteUpload(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const uploadId = parseInt(req.params.id, 10);
    
    if (isNaN(uploadId)) {
      return res.status(400).send('Invalid upload ID');
    }
    
    await uploadService.deleteUpload(uploadId, userId);
    res.sendStatus(204); // No content
  } catch (error: any) {
    console.error('Error deleting upload:', error);
    res.status(500).send(`Server error: ${error.message}`);
  }
}
