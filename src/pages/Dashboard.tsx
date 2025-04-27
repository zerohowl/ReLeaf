import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { isAuthenticated as isAuth } from '@/services/authService';
import AppLayout from '@/components/AppLayout';
import StatCard from '@/components/dashboard/StatCard';
import StreakCard from '@/components/dashboard/StreakCard';
import LeaderboardCard from '@/components/dashboard/LeaderboardCard';
import RecentScansCard from '@/components/dashboard/RecentScansCard';
import ScoreBreakdownCard from '@/components/dashboard/ScoreBreakdownCard';
import TipCard from '@/components/dashboard/TipCard';
import { Award, Calendar, Leaf, Recycle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import PageTransition from '@/components/PageTransition';
import BackgroundImage from '@/components/BackgroundImage';
import { getPersonalization, PersonalizationData, TipCard as TipCardType } from '@/services/surveyService';
import { getUserUploads, UserUpload } from '@/services/uploadService';
import { getLeaderboard, getUserPoints, updateUserPoints, LeaderboardUser } from '@/services/leaderboardService';

// We now get leaderboard data from the leaderboardService
// It provides a centralized source of truth for the app

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [personalization, setPersonalization] = useState<PersonalizationData | null>(null);
  const [isLoadingPersonalization, setIsLoadingPersonalization] = useState(true);

  // Initialize stats with zeros - will be calculated from real data
  const [stats, setStats] = useState({
    itemsScanned: 0,
    recyclableItems: 0,
    currentStreak: 0,
    totalPoints: getUserPoints(), // Initialize with persisted user points
  });

  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    streakDays: [] as number[], // Days of the week with streak activity
  });

  // Get leaderboard data from the service
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);

  // Initialize score breakdown with zeros
  const [scoreCategories, setScoreCategories] = useState([
    { name: 'Daily Streaks', points: 0, percentage: 0, color: 'bg-green-400' },
    { name: 'Verified Uploads', points: 0, percentage: 0, color: 'bg-blue-400' },
    { name: 'Hard-to-Recycle Items', points: 0, percentage: 0, color: 'bg-purple-400' },
    { name: 'Community Bonus', points: 0, percentage: 0, color: 'bg-amber-400' },
  ]);
  
  const [tipCards, setTipCards] = useState<TipCardType[]>([]);
  const [userUploads, setUserUploads] = useState<UserUpload[]>([]);
  const [isLoadingUploads, setIsLoadingUploads] = useState(true);

  // Calculate streak data from user uploads
  const calculateStreakData = (uploads: UserUpload[]) => {
    if (!uploads.length) return { currentStreak: 0, longestStreak: 0, streakDays: [] as number[] };
    
    // Sort uploads by date (newest first)
    const sortedUploads = [...uploads].sort((a, b) => {
      return new Date(b.date || b.uploadedAt).getTime() - new Date(a.date || a.uploadedAt).getTime();
    });

    // Get unique dates (by day)
    const uniqueDates = new Set<string>();
    sortedUploads.forEach(upload => {
      const date = new Date(upload.date || upload.uploadedAt);
      uniqueDates.add(date.toISOString().split('T')[0]);
    });

    // Convert to array and sort by date (newest first)
    const dateArray = Array.from(uniqueDates).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    // Calculate current streak
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    // Check if user uploaded today or yesterday to initialize streak
    if (dateArray[0] === today || dateArray[0] === yesterday) {
      currentStreak = 1;
      
      // Check consecutive days before today/yesterday
      for (let i = 1; i < dateArray.length; i++) {
        const currentDate = new Date(dateArray[i]);
        const prevDate = new Date(dateArray[i-1]);
        
        // Check if dates are consecutive
        const diffTime = prevDate.getTime() - currentDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    
    // Calculate longest streak (simplified)
    const longestStreak = Math.max(currentStreak, Math.min(uploads.length, 3));
    
    // Calculate active days
    const activeDays = new Set<number>();
    dateArray.forEach(dateStr => {
      const date = new Date(dateStr);
      activeDays.add(date.getDay());
    });
    
    return {
      currentStreak,
      longestStreak,
      streakDays: Array.from(activeDays)
    };
  };

  // Calculate score breakdown based on user uploads
  const calculateScoreBreakdown = (uploads: UserUpload[], streakInfo: {currentStreak: number}) => {
    // Starting points (ensure user always has some activity shown)
    let streakPoints = 40;
    let uploadPoints = 0;
    let hardToRecyclePoints = 0;
    let communityPoints = 25;
    
    // Calculate points from uploads
    uploads.forEach(upload => {
      if (upload.points) {
        uploadPoints += upload.isRecyclable ? Math.round(upload.points * 0.7) : 0;
        
        // Hard-to-recycle bonus for certain material types
        const materialType = upload.materialType || '';
        if (['glass', 'metal', 'electronic'].includes(materialType)) {
          hardToRecyclePoints += Math.round(upload.points * 0.3);
        }
      }
    });
    
    // Add streak points (10 points per day of streak)
    streakPoints += streakInfo.currentStreak * 10;
    
    // Calculate total and percentages
    const totalPoints = streakPoints + uploadPoints + hardToRecyclePoints + communityPoints;
    
    return {
      totalScore: totalPoints,
      categories: [
      { 
        name: 'Daily Streaks', 
        points: streakPoints, 
        percentage: Math.round((streakPoints / Math.max(totalPoints, 1)) * 100), 
        color: 'bg-green-400' 
      },
      { 
        name: 'Verified Uploads', 
        points: uploadPoints, 
        percentage: Math.round((uploadPoints / Math.max(totalPoints, 1)) * 100), 
        color: 'bg-blue-400' 
      },
      { 
        name: 'Hard-to-Recycle Items', 
        points: hardToRecyclePoints, 
        percentage: Math.round((hardToRecyclePoints / Math.max(totalPoints, 1)) * 100), 
        color: 'bg-purple-400' 
      },
      { 
        name: 'Community Bonus', 
        points: communityPoints, 
        percentage: Math.round((communityPoints / Math.max(totalPoints, 1)) * 100), 
        color: 'bg-amber-400' 
      },
    ]
    };
  };

  // Load leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (isAuthenticated) {
        setIsLoadingLeaderboard(true);
        try {
          const data = await getLeaderboard('all-time');
          setLeaderboardUsers(data);
        } catch (error) {
          console.error('Error fetching leaderboard:', error);
        } finally {
          setIsLoadingLeaderboard(false);
        }
      }
    };
    
    fetchLeaderboard();
  }, [isAuthenticated]);

  // Load user uploads and calculate stats
  useEffect(() => {
    const fetchUserUploads = async () => {
      if (isAuthenticated) {
        setIsLoadingUploads(true);
        try {
          const uploads = await getUserUploads();
          setUserUploads(uploads);
          
          // Calculate stats
          const itemsScanned = uploads.length;
          const recyclableItems = uploads.filter(upload => upload.isRecyclable).length;
          
          // Calculate streak data
          const streakInfo = calculateStreakData(uploads);
          setStreakData(streakInfo);
          
          // Get current user points from localStorage (handled by leaderboardService)
          const storedPoints = getUserPoints();
          
          // Calculate points from uploads
          let calculatedPoints = uploads.reduce((total, upload) => total + (upload.points || 0), 0);
          calculatedPoints += streakInfo.currentStreak * 10; // Add streak bonus
          
          // Update points in localStorage if they've changed
          if (calculatedPoints > storedPoints) {
            console.log(`Updating user points: ${storedPoints} -> ${calculatedPoints}`);
            updateUserPoints(calculatedPoints);
          }
          
          // Set stats with latest points
          setStats({
            itemsScanned,
            recyclableItems,
            currentStreak: streakInfo.currentStreak,
            totalPoints: calculatedPoints
          });
          
          // Calculate score breakdown
          const scoreBreakdown = calculateScoreBreakdown(uploads, streakInfo);
          setScoreCategories(scoreBreakdown.categories);
          
        } catch (error) {
          console.error('Error fetching user uploads:', error);
        } finally {
          setIsLoadingUploads(false);
        }
      }
    };
    
    fetchUserUploads();
  }, [isAuthenticated]);

  useEffect(() => {
    const auth = isAuth();
    setIsAuthenticated(auth);
    if (auth && !localStorage.getItem('onboarding_completed')) {
      setShowOnboarding(true);
    }
    setAuthLoading(false);
  }, []);

  // Load personalization data when authenticated
  useEffect(() => {
    const fetchPersonalization = async () => {
      if (isAuthenticated) {
        try {
          setIsLoadingPersonalization(true);
          const data = await getPersonalization();
          setPersonalization(data);
          
          // Apply personalization to stats
          if (data.pointsMultiplier !== undefined) {
            // Adjust points based on multiplier (even if it's zero)
            const adjustedPoints = Math.round(stats.totalPoints * data.pointsMultiplier);
            setStats(prev => ({ ...prev, totalPoints: adjustedPoints }));
          }
          
          // Set tip cards
          if (data.tipCards && data.tipCards.length > 0) {
            setTipCards(data.tipCards);
          }

          console.log('Personalization loaded:', data);
        } catch (error) {
          console.error('Error loading personalization:', error);
        } finally {
          setIsLoadingPersonalization(false);
        }
      }
    };

    fetchPersonalization();
  }, [isAuthenticated]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setShowOnboarding(false);
    
    // Reload personalization data after onboarding
    window.location.reload();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto mb-4 animate-spin-slow">
            <Recycle className="h-16 w-16 text-eco-green" />
          </div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <PageTransition>
      <BackgroundImage>
        <AppLayout>
          <div className="grid grid-cols-12 gap-4 mb-8">
            <div className="col-span-12 lg:col-span-3">
              <StatCard 
                title="Items Scanned" 
                value={stats.itemsScanned} 
                icon={<Upload className="text-sky-400" />} 
                description="Total items analyzed" 
              />
            </div>
            
            <div className="col-span-12 lg:col-span-3">
              <StatCard 
                title="Recyclable Items" 
                value={stats.recyclableItems} 
                icon={<Recycle className="text-eco-green" />} 
                description="Items properly recycled" 
              />
            </div>
            
            <div className="col-span-12 lg:col-span-3">
              <StatCard 
                title="Current Streak" 
                value={stats.currentStreak} 
                icon={<Calendar className="text-amber-400" />} 
                description="Consecutive days active" 
              />
            </div>
            
            <div className="col-span-12 lg:col-span-3">
              <StatCard 
                title="Total Points" 
                value={stats.totalPoints} 
                icon={<Award className="text-purple-400" />} 
                description="Recycling points earned" 
              />
            </div>
          </div>

          <div className="flex justify-center my-10">
            <Link to="/upload">
              <Button className="glass-panel px-10 py-7 text-lg font-semibold bg-eco-green/20 border-2 border-eco-green/30 shadow-lg shadow-eco-green/20 hover:bg-eco-green/30 hover:border-eco-green/50 hover:shadow-eco-green/30 transition-all hover:scale-105 animate-pulse-slow text-black dark:text-white dark:bg-eco-green/40 dark:border-eco-green/60">
                <Upload className="h-6 w-6 mr-3 text-black dark:text-white" />
                Scan New Item
              </Button>
            </Link>
          </div>

          {/* Personalized Tip Cards */}
          {tipCards.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Tips For You</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tipCards.map(tip => (
                  <TipCard 
                    key={tip.id}
                    title={tip.title}
                    content={tip.content}
                    category={tip.category}
                  />
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <StreakCard 
                currentStreak={streakData.currentStreak}
                longestStreak={streakData.longestStreak}
                streakDays={streakData.streakDays}
              />
            </div>
            
            <div className="lg:col-span-4">
              <LeaderboardCard users={isLoadingLeaderboard ? [] : leaderboardUsers} />
            </div>

            <div className="lg:col-span-4">
              <ScoreBreakdownCard 
                totalScore={stats.totalPoints}
                categories={scoreCategories} 
              />
            </div>
          </div>

          <div className="mt-6">
            <RecentScansCard 
              items={userUploads.slice(0, 3)} 
              isLoading={isLoadingUploads}
              showUploadPrompt={userUploads.length === 0}
            />
          </div>
            
          {showOnboarding && (
            <OnboardingModal 
              isOpen={showOnboarding} 
              onClose={handleOnboardingComplete} 
            />
          )}
        </AppLayout>
      </BackgroundImage>
    </PageTransition>
  );
};

export default Dashboard;
