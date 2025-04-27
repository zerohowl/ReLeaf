import { Request, Response } from 'express';
import * as surveyService from '../services/surveyService';

// Type for the extended request that includes userId from auth middleware
interface AuthRequest extends Request {
  userId?: number;
}

// Save or update survey
export async function saveSurvey(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).send('Authentication required');
    }

    const surveyData = req.body;
    if (!surveyData || !surveyData.recyclingExperience || !surveyData.recyclingGoals) {
      return res.status(400).send('Missing required survey data');
    }

    const result = await surveyService.saveSurvey(userId, surveyData);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error saving survey:', error);
    res.status(500).send(`Server error: ${error.message}`);
  }
}

// Get survey data
export async function getSurvey(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).send('Authentication required');
    }

    const survey = await surveyService.getUserSurvey(userId);
    if (!survey) {
      return res.status(404).send('Survey not found');
    }

    res.status(200).json(survey);
  } catch (error: any) {
    console.error('Error fetching survey:', error);
    res.status(500).send(`Server error: ${error.message}`);
  }
}

// Delete survey data
export async function deleteSurvey(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).send('Authentication required');
    }

    await surveyService.deleteSurvey(userId);
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting survey:', error);
    res.status(500).send(`Server error: ${error.message}`);
  }
}

// Get personalized settings based on survey
export async function getUserPersonalization(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).send('Authentication required');
    }

    const personalization = await surveyService.getUserPersonalization(userId);
    res.status(200).json(personalization);
  } catch (error: any) {
    console.error('Error fetching personalization:', error);
    res.status(500).send(`Server error: ${error.message}`);
  }
}
