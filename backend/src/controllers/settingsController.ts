// settingsController.ts - Handle user settings operations

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Update user privacy settings
 */
export const updatePrivacy = async (req: any, res: any) => {
  try {
    const userId = req.userId; // Fixed: access userId directly from req
    const { public_profile } = req.body;
    
    if (public_profile === undefined) {
      return res.status(400).send('Missing required privacy setting');
    }

    // Update the user's privacy setting
    await prisma.user.update({
      where: { id: userId },
      data: { public_profile: Boolean(public_profile) }
    });

    return res.status(200).send({ 
      message: 'Privacy settings updated successfully',
      public_profile: Boolean(public_profile)
    });
  } catch (error: any) {
    console.error('Error updating privacy settings:', error);
    return res.status(500).send('Failed to update privacy settings');
  }
};

/**
 * Get user settings
 */
export const getSettings = async (req: any, res: any) => {
  try {
    const userId = req.userId; // Fixed: access userId directly from req
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        public_profile: true
      }
    });

    if (!user) {
      return res.status(404).send('User not found');
    }

    return res.status(200).send(user);
  } catch (error: any) {
    console.error('Error fetching user settings:', error);
    return res.status(500).send('Failed to fetch user settings');
  }
};

/**
 * Reset user data, keeping account but clearing stats
 */
export const resetUserData = async (req: any, res: any) => {
  try {
    const userId = req.userId; // Fixed: access userId directly from req
    
    // Start a transaction to ensure all operations complete or none do
    await prisma.$transaction([
      // Delete all user uploads (cascade will handle upload history)
      prisma.upload.deleteMany({
        where: { userId }
      }),
      
      // Delete user survey data
      prisma.userSurvey.deleteMany({
        where: { userId }
      })
    ]);

    return res.status(200).send({ 
      message: 'User data has been reset successfully'
    });
  } catch (error: any) {
    console.error('Error resetting user data:', error);
    return res.status(500).send('Failed to reset user data');
  }
};
