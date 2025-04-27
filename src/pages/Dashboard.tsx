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

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [personalization, setPersonalization] = useState<PersonalizationData | null>(null);
  const [isLoadingPersonalization, setIsLoadingPersonalization] = useState(true);

  // Default stats (will be modified by personalization)
  const [stats, setStats] = useState({
    itemsScanned: 54,
    recyclableItems: 42,
    currentStreak: 5,
    totalPoints: 875,
  });

  const [streakData, setStreakData] = useState({
    currentStreak: 5,
    longestStreak: 9,
    streakDays: [0, 1, 2, 3, 4, 5, 6], // Days of the week with streak activity
  });

  const leaderboardUsers = [
    { name: 'Kevin H.', score: 1245, rank: 1 },
    { name: 'Turat Z.', score: 1120, rank: 2 },
    { name: 'Sean E.', score: 980, rank: 3 },
    { name: 'Enzo G.', score: 875, rank: 4 },
    { name: 'Ava W.', score: 840, rank: 5 },
  ];

  // Default score breakdown - will be modified by personalization
  const [scoreCategories, setScoreCategories] = useState([
    { name: 'Daily Streaks', points: 275, percentage: 31, color: 'bg-green-400' },
    { name: 'Verified Uploads', points: 350, percentage: 40, color: 'bg-blue-400' },
    { name: 'Hard-to-Recycle Items', points: 175, percentage: 20, color: 'bg-purple-400' },
    { name: 'Community Bonus', points: 75, percentage: 9, color: 'bg-amber-400' },
  ]);

  const [tipCards, setTipCards] = useState<TipCardType[]>([]);

  const recentScans = [
    { id: '1', name: 'Plastic Bottle', isRecyclable: true, date: '2025-04-25', imageUrl: '/items/plastic-bottle.jpg' },
    { id: '2', name: 'Glass Jar', isRecyclable: true, date: '2025-04-24', imageUrl: '/items/glass-jar.jpg' },
    { id: '3', name: 'Styrofoam Container', isRecyclable: false, date: '2025-04-23', imageUrl: '/items/styrofoam.jpg' },
  ];

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
              <ScoreBreakdownCard 
                totalScore={stats.totalPoints}
                categories={scoreCategories}
              />
            </div>
            
            <div className="lg:col-span-4">
              <LeaderboardCard users={leaderboardUsers} />
            </div>
            
            <div className="lg:col-span-12">
              <RecentScansCard items={recentScans} />
            </div>
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
