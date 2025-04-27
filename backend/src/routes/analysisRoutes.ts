// analysisRoutes.ts - Routes for AI analysis features
import express from 'express';
import { analyzeMedia } from '../controllers/analysisController';

const router = express.Router();

// Analysis routes (will be protected by auth middleware in index.ts)
router.post('/analyze', analyzeMedia);

export default router;
