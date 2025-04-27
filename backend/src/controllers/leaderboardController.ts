// leaderboardController.ts - Handle leaderboard data operations
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Get leaderboard data for weekly, monthly, or all-time periods
 * Respects user privacy settings
 */
export const getLeaderboard = async (req: any, res: any) => {
  try {
    const timeFrame = req.query.timeFrame || 'weekly';
    const currentUserId = req.user?.userId;
    
    // Get all uploads
    const uploads = await prisma.upload.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            public_profile: true,
          }
        }
      }
    });
    
    // Calculate score per user
    const userScores: Record<number, {id: number, email: string, score: number, isPublic: boolean}> = {};
    
    // Process uploads and calculate scores
    uploads.forEach(upload => {
      const userId = upload.userId;
      
      if (!userScores[userId]) {
        userScores[userId] = {
          id: userId,
          email: upload.user.email,
          score: 0,
          isPublic: upload.user.public_profile
        };
      }
      
      // Simple scoring: 10 points per upload
      // Could be enhanced with timestamp filtering based on timeFrame
      userScores[userId].score += 10;
    });
    
    // Convert to array and sort by score
    let leaderboard = Object.values(userScores)
      .map(user => ({
        id: user.id,
        name: user.email.split('@')[0], // Use email username as display name
        score: user.score,
        isCurrentUser: user.id === currentUserId,
        // Only include non-private users or the current user
        isHidden: !user.isPublic && user.id !== currentUserId
      }))
      .filter(user => !user.isHidden) // Remove hidden users
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, 10); // Get top 10
    
    // Add rank
    leaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1
    }));
    
    return res.status(200).json(leaderboard);
  } catch (error: any) {
    console.error('Error getting leaderboard data:', error);
    return res.status(500).send('Failed to get leaderboard data');
  }
};
