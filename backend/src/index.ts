require('dotenv').config();
const express = require('express');
import type { Request, Response, NextFunction } from 'express';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs-extra');
const cors = require('cors');

// Import controllers will be done below

const prisma = new PrismaClient();
const app = express();

// Middleware - Configure CORS for frontend connections
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Enable preflight requests for all routes
app.options('*', cors());

// Parse JSON with higher limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  abortOnLimit: true
}));

// Serve static files from the upload directory
const uploadsDir = path.join(__dirname, '../uploads');
fs.ensureDirSync(uploadsDir);
fs.ensureDirSync(path.join(uploadsDir, 'images'));
fs.ensureDirSync(path.join(uploadsDir, 'videos'));
app.use('/uploads', express.static(uploadsDir));

// Add proper CORS headers for file access
app.use('/uploads', (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Cache-Control', 'public, max-age=3600');
  next();
});

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// Import controllers and routes
const uploadController = require('./controllers/uploadController');
import * as surveyController from './controllers/surveyController';
import * as settingsController from './controllers/settingsController';
import * as leaderboardController from './controllers/leaderboardController';
import analysisRoutes from './routes/analysisRoutes';
const { queryChatAgent } = require('./controllers/chatController');

// ---------- Register ----------
app.post('/api/register', async (req: any, res: any) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return res.status(400).send('Missing fields');

  try {
    const hash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { email, passwordHash: hash } });
    return res.status(201).send({ id: user.id });
  } catch (err: any) {
    if (err.code === 'P2002') return res.status(409).send('User already exists');
    console.error(err);
    return res.status(500).send('Server error');
  }
});

// ---------- Login ----------
app.post('/api/login', async (req: any, res: any) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return res.status(400).send('Missing fields');

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).send('Invalid credentials');

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).send('Invalid credentials');

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  return res.send({ token });
});

// ---------- Auth middleware ----------
function auth(req: any, res: any, next: any) {
  const header = req.headers.authorization;
  const token = header?.split(' ')[1];
  if (!token) return res.status(401).send('No token');
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    (req as any).userId = payload.userId;
    next();
  } catch {
    return res.status(401).send('Invalid token');
  }
}

app.get('/api/profile', auth, async (req: any, res: any) => {
  const userId = (req as any).userId as number;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, createdAt: true } });
  return res.send(user);
});

// ---------- Upload routes ----------
app.post('/api/uploads', auth, uploadController.uploadFile);
app.get('/api/uploads', auth, async (req: any, res: any) => {
  const userId = (req as any).userId as number;
  try {
    const uploads = await prisma.upload.findMany({
      where: { userId },
      orderBy: { uploadedAt: 'desc' }
    });
    res.send(uploads);
  } catch (err) {
    console.error('Error fetching uploads:', err);
    res.status(500).send('Server error');
  }
});

app.get('/api/uploads/:id', auth, async (req: any, res: any) => {
  const userId = (req as any).userId as number;
  const uploadId = parseInt(req.params.id);
  if (isNaN(uploadId)) return res.status(400).send('Invalid ID');
  
  try {
    const upload = await prisma.upload.findFirst({
      where: { id: uploadId, userId },
      include: { history: { orderBy: { timestamp: 'desc' } } }
    });
    if (!upload) return res.status(404).send('Upload not found');
    
    // Record view in history
    await prisma.uploadHistory.create({
      data: {
        uploadId,
        action: 'viewed',
        metadata: JSON.stringify({ timestamp: new Date().toISOString() })
      }
    });
    
    res.send(upload);
  } catch (err) {
    console.error('Error fetching upload:', err);
    res.status(500).send('Server error');
  }
});

app.post('/api/uploads/:id/history', auth, async (req: any, res: any) => {
  const userId = (req as any).userId as number;
  const uploadId = parseInt(req.params.id);
  const { action, metadata } = req.body;
  if (isNaN(uploadId) || !action) return res.status(400).send('Invalid request');
  
  try {
    // Verify ownership
    const upload = await prisma.upload.findFirst({ where: { id: uploadId, userId } });
    if (!upload) return res.status(404).send('Upload not found');
    
    const history = await prisma.uploadHistory.create({
      data: {
        uploadId,
        action,
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    });
    
    res.status(201).send(history);
  } catch (err) {
    console.error('Error recording history:', err);
    res.status(500).send('Server error');
  }
});

app.delete('/api/uploads/:id', auth, async (req: any, res: any) => {
  const userId = (req as any).userId as number;
  const uploadId = parseInt(req.params.id);
  if (isNaN(uploadId)) return res.status(400).send('Invalid ID');
  
  try {
    const upload = await prisma.upload.findFirst({ where: { id: uploadId, userId } });
    if (!upload) return res.status(404).send('Upload not found');
    
    // Delete the file
    const filePath = path.join(__dirname, '../uploads', upload.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Delete the record (cascade will delete history)
    await prisma.upload.delete({ where: { id: uploadId } });
    
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting upload:', err);
    res.status(500).send('Server error');
  }
});

// ---------- Survey routes ----------
app.post('/api/survey', auth, surveyController.saveSurvey);
app.get('/api/survey', auth, surveyController.getSurvey);
app.delete('/api/survey', auth, surveyController.deleteSurvey);
app.get('/api/personalization', auth, surveyController.getUserPersonalization);

// Settings routes
app.get('/api/settings', auth, settingsController.getSettings);
app.put('/api/settings/privacy', auth, settingsController.updatePrivacy);
app.post('/api/settings/reset', auth, settingsController.resetUserData);

// Leaderboard routes
app.get('/api/leaderboard', auth, leaderboardController.getLeaderboard);

// AI Analysis routes
app.use('/api/ai', auth, analysisRoutes);

// Chat Assistant routes
app.post('/api/chat', auth, queryChatAgent);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));
