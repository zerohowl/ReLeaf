// Debug script to check SQLite database records
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs-extra');
const path = require('path');

async function checkDatabase() {
  console.log('\n=== CHECKING DATABASE RECORDS ===\n');
  try {
    // Check users
    const userCount = await prisma.user.count();
    console.log(`Total users in database: ${userCount}`);
    
    // Check uploads
    const uploads = await prisma.upload.findMany({
      include: {
        history: true
      }
    });
    
    console.log(`\nTotal uploads in database: ${uploads.length}`);
    
    if (uploads.length > 0) {
      console.log('\n=== UPLOAD RECORDS ===\n');
      uploads.forEach((upload, index) => {
        console.log(`[${index + 1}] Upload ID: ${upload.id}`);
        console.log(`    User ID: ${upload.userId}`);
        console.log(`    File: ${upload.fileName}`);
        console.log(`    Path: ${upload.filePath}`);
        console.log(`    Type: ${upload.fileType}`);
        console.log(`    Size: ${upload.fileSize} bytes`);
        console.log(`    MIME: ${upload.mimeType}`);
        console.log(`    Uploaded: ${upload.uploadedAt}`);
        console.log(`    Item: ${upload.identifiedItem || 'Not identified'}`);
        console.log(`    Recycling Info: ${upload.recyclingInfo || 'No info'}`);
        console.log(`    History items: ${upload.history.length}`);
        
        // Check if the file exists on disk
        const fullPath = path.join(__dirname, 'uploads', upload.filePath);
        const fileExists = fs.existsSync(fullPath);
        console.log(`    File exists on disk: ${fileExists ? 'YES ✅' : 'NO ❌'}`);
        if (!fileExists) {
          console.log(`    Missing file path: ${fullPath}`);
        }
        console.log('');
      });
    }
  } catch (error) {
    console.error('Database check error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Check upload directories
function checkUploadDirectories() {
  console.log('\n=== CHECKING UPLOAD DIRECTORIES ===\n');
  
  const baseDir = path.join(__dirname, 'uploads');
  const imagesDir = path.join(baseDir, 'images');
  const videosDir = path.join(baseDir, 'videos');
  
  console.log(`Base upload directory: ${baseDir}`);
  console.log(`Exists: ${fs.existsSync(baseDir) ? 'YES ✅' : 'NO ❌'}`);
  
  console.log(`\nImages directory: ${imagesDir}`);
  console.log(`Exists: ${fs.existsSync(imagesDir) ? 'YES ✅' : 'NO ❌'}`);
  
  if (fs.existsSync(imagesDir)) {
    const imageFiles = fs.readdirSync(imagesDir).filter(f => !f.startsWith('.'));
    console.log(`Image files: ${imageFiles.length}`);
    imageFiles.forEach(file => console.log(`  - ${file}`));
  }
  
  console.log(`\nVideos directory: ${videosDir}`);
  console.log(`Exists: ${fs.existsSync(videosDir) ? 'YES ✅' : 'NO ❌'}`);
  
  if (fs.existsSync(videosDir)) {
    const videoFiles = fs.readdirSync(videosDir).filter(f => !f.startsWith('.'));
    console.log(`Video files: ${videoFiles.length}`);
    videoFiles.forEach(file => console.log(`  - ${file}`));
  }
}

async function main() {
  console.log('\n======= UPLOAD DIAGNOSTIC TOOL =======\n');
  await checkDatabase();
  checkUploadDirectories();
  console.log('\n======= DIAGNOSTIC COMPLETE =======\n');
}

main();
