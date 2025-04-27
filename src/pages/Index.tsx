import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated as isAuth } from '@/services/authService';
import AppLayout from '@/components/AppLayout';
import StatCard from '@/components/dashboard/StatCard';
import StreakCard from '@/components/dashboard/StreakCard';
import LeaderboardCard from '@/components/dashboard/LeaderboardCard';
import RecentScansCard from '@/components/dashboard/RecentScansCard';
import ScoreBreakdownCard from '@/components/dashboard/ScoreBreakdownCard';
import { Award, Calendar, Leaf, Recycle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import PageTransition from '@/components/PageTransition';
import BackgroundImage from '@/components/BackgroundImage';

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const stats = {
    itemsScanned: 54,
    recyclableItems: 42,
    currentStreak: 5,
    totalPoints: 875,
  };

  const streakData = {
    currentStreak: 5,
    longestStreak: 9,
    streakDays: [0, 1, 2, 3, 4, 5, 6], // Days of the week with streak activity
  };

  const leaderboardUsers = [
    { name: 'Kevin H.', score: 1245, rank: 1 },
    { name: 'Turat Z.', score: 1120, rank: 2 },
    { name: 'Sean E.', score: 875, rank: 3, isCurrentUser: true },
    { name: 'Enzo P.', score: 800, rank: 4 },
    { name: 'Mike Peterson', score: 780, rank: 5 },
  ];

  // Sample score breakdown categories
  const scoreCategories = [
    { name: 'Daily Streaks', points: 275, percentage: 31, color: 'bg-green-400' },
    { name: 'Verified Uploads', points: 350, percentage: 40, color: 'bg-blue-400' },
    { name: 'Hard-to-Recycle Items', points: 175, percentage: 20, color: 'bg-purple-400' },
    { name: 'Community Bonus', points: 75, percentage: 9, color: 'bg-amber-400' },
  ];

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

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setShowOnboarding(false);
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
          <div className="mb-8 space-y-4 bg-white/70 dark:bg-black/50 backdrop-blur-sm p-4 rounded-lg">
            <h1 className="text-4xl font-bold mb-2 text-gradient dark:text-white">Welcome back!</h1>
            <p className="text-muted-foreground dark:text-gray-200 text-lg">
              Track your recycling progress and make a positive impact on the environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Items Scanned"
              value={stats.itemsScanned}
              icon={<Leaf className="h-6 w-6 text-success-green" />}
            />
            <StatCard
              title="Recyclable Items"
              value={stats.recyclableItems}
              icon={<Recycle className="h-6 w-6 text-success-green" />}
              description={stats.itemsScanned > 0 ? `${Math.round((stats.recyclableItems / stats.itemsScanned) * 100)}% of total items` : '0% of total items'}
            />
            <StatCard
              title="Current Streak"
              value={`${stats.currentStreak} days`}
              icon={<Calendar className="h-6 w-6 text-success-green" />}
            />
            <StatCard
              title="Total Points"
              value={stats.totalPoints}
              icon={<Award className="h-6 w-6 text-success-green" />}
            />
          </div>

      <div className="flex justify-center my-10">
        <Link to="/upload">
          <Button className="glass-panel px-10 py-7 text-lg font-semibold bg-eco-green/20 border-2 border-eco-green/30 shadow-lg shadow-eco-green/20 hover:bg-eco-green/30 hover:border-eco-green/50 hover:shadow-eco-green/30 transition-all hover:scale-105 animate-pulse-slow text-black dark:text-white dark:bg-eco-green/40 dark:border-eco-green/60">
            <Upload className="h-6 w-6 mr-3 text-black dark:text-white" />
            Scan New Item
          </Button>
        </Link>
      </div>

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
