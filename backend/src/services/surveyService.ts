import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define types for our survey data
export interface SurveyData {
  recyclingExperience: string;
  recyclingGoals: string[] | string; // Array from frontend, string (JSON) in database
  homeType?: string;
  homeTemperature?: string;
  stoveType?: string;
  hasVehicle?: boolean;
  vehicleType?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  packageFrequency?: string;
}

/**
 * Save user survey data to the database
 */
export async function saveSurvey(userId: number, data: SurveyData) {
  // Format data for database
  const formattedData = {
    ...data,
    // Convert array to JSON string for storage
    recyclingGoals: Array.isArray(data.recyclingGoals) 
      ? JSON.stringify(data.recyclingGoals) 
      : data.recyclingGoals
  };

  try {
    // Check if the user already has a survey
    const existingSurvey = await prisma.userSurvey.findUnique({
      where: {
        userId
      }
    });

    if (existingSurvey) {
      // Update existing survey
      return prisma.userSurvey.update({
        where: {
          userId
        },
        data: formattedData
      });
    } else {
      // Create new survey
      return prisma.userSurvey.create({
        data: {
          userId,
          ...formattedData
        }
      });
    }
  } catch (error) {
    console.error('Error saving survey:', error);
    throw error;
  }
}

/**
 * Get user survey data from the database
 */
export async function getUserSurvey(userId: number) {
  try {
    const survey = await prisma.userSurvey.findUnique({
      where: {
        userId
      }
    });

    if (!survey) return null;

    // Convert the recyclingGoals JSON string back to an array
    return {
      ...survey,
      recyclingGoals: survey.recyclingGoals ? JSON.parse(survey.recyclingGoals as string) : []
    };
  } catch (error) {
    console.error('Error fetching user survey:', error);
    throw error;
  }
}

/**
 * Delete user survey data
 */
export async function deleteSurvey(userId: number) {
  try {
    await prisma.userSurvey.delete({
      where: {
        userId
      }
    });
    return true;
  } catch (error) {
    console.error('Error deleting survey:', error);
    throw error;
  }
}

/**
 * Get personalized user settings based on survey data
 */
export async function getUserPersonalization(userId: number) {
  try {
    const survey = await getUserSurvey(userId);
    
    if (!survey) {
      return {
        tipCards: getDefaultTipCards(),
        pointsMultiplier: 1.0,
        recyclingLevel: 'beginner'
      };
    }

    // Calculate recycling level
    const level = calculateRecyclingLevel(survey);
    
    // Generate personalized tip cards
    const tipCards = getPersonalizedTipCards(survey);
    
    // Calculate points multiplier based on user's recycling experience
    const pointsMultiplier = calculatePointsMultiplier(survey);

    return {
      tipCards,
      pointsMultiplier,
      recyclingLevel: level,
      preferredTemperature: survey.homeTemperature || '68-72',
      hasVehicle: survey.hasVehicle || false,
      vehicleType: survey.vehicleType || 'none'
    };
  } catch (error) {
    console.error('Error getting user personalization:', error);
    throw error;
  }
}

// Helper functions for personalization

function calculateRecyclingLevel(survey: any) {
  // Calculate recycling level based on experience and other factors
  if (survey.recyclingExperience === 'expert') return 'expert';
  if (survey.recyclingExperience === 'intermediate') return 'intermediate';
  return 'beginner';
}

function calculatePointsMultiplier(survey: any) {
  // Give beginners a small boost to encourage them
  if (survey.recyclingExperience === 'beginner') return 1.2;
  
  // Standard multiplier for intermediate users
  if (survey.recyclingExperience === 'intermediate') return 1.0;
  
  // Experts get a slight handicap to make the challenge interesting
  return 0.9;
}

function getDefaultTipCards() {
  return [
    {
      id: 1,
      title: 'Welcome to Recycling!',
      content: 'Start by separating paper, plastic, glass, and metal into different bins.',
      category: 'general'
    },
    {
      id: 2,
      title: 'Plastic Recycling Tips',
      content: 'Rinse plastic containers before recycling. Remove caps and lids.',
      category: 'plastic'
    },
    {
      id: 3,
      title: 'Paper Recycling',
      content: 'Flatten cardboard boxes to save space in your recycling bin.',
      category: 'paper'
    }
  ];
}

function getPersonalizedTipCards(survey: any) {
  const tipCards = [];
  const goals = Array.isArray(survey.recyclingGoals) ? survey.recyclingGoals : [];
  
  // Add beginner tips
  if (survey.recyclingExperience === 'beginner') {
    tipCards.push({
      id: 1,
      title: 'Recycling Basics',
      content: 'Start with the simplest items: paper, aluminum cans, and plastic bottles (types 1 & 2).',
      category: 'general'
    });
  }
  
  // Add intermediate tips
  if (survey.recyclingExperience === 'intermediate' || survey.recyclingExperience === 'expert') {
    tipCards.push({
      id: 2,
      title: 'Beyond the Basics',
      content: 'Consider composting food waste and recycling more complex materials like electronics.',
      category: 'advanced'
    });
  }
  
  // Tips based on home type
  if (survey.homeType === 'apartment') {
    tipCards.push({
      id: 3,
      title: 'Apartment Recycling',
      content: 'Use collapsible bins to save space. Talk to building management about improving recycling facilities.',
      category: 'living'
    });
  }
  
  // Tips based on goals
  if (goals.includes('reduce_waste')) {
    tipCards.push({
      id: 4,
      title: 'Zero Waste Tips',
      content: 'Try shopping with reusable bags and containers to minimize packaging waste.',
      category: 'lifestyle'
    });
  }
  
  // Add more personalized tips based on user data
  if (survey.hasVehicle && survey.vehicleType === 'gas') {
    tipCards.push({
      id: 5,
      title: 'Transportation Impact',
      content: 'Consider carpooling or combining trips to reduce your carbon footprint.',
      category: 'transportation'
    });
  }
  
  // Always include at least 3 tips
  if (tipCards.length < 3) {
    tipCards.push(...getDefaultTipCards().slice(0, 3 - tipCards.length));
  }
  
  return tipCards;
}
