import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import StatCard from '@/components/dashboard/StatCard';
import StreakCard from '@/components/dashboard/StreakCard';
import LeaderboardCard from '@/components/dashboard/LeaderboardCard';
import RecentScansCard from '@/components/dashboard/RecentScansCard';
import { Award, Calendar, Leaf, Recycle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import OnboardingModal from '@/components/onboarding/OnboardingModal';

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Empty stats for new users
  const stats = {
    itemsScanned: 0,
    recyclableItems: 0,
    currentStreak: 0,
    totalPoints: 0,
  };

  // Empty streak data
  const streakData = {
    currentStreak: 0,
    longestStreak: 0,
    streakDays: [],
  };

  // Keep existing leaderboard data
  const leaderboardUsers = [
    { name: 'Alex Kim', score: 1245, rank: 1 },
    { name: 'Taylor Swift', score: 1120, rank: 2 },
    { name: 'John Doe', score: 950, rank: 3, isCurrentUser: true },
    { name: 'Sarah Johnson', score: 900, rank: 4 },
    { name: 'Mike Peterson', score: 780, rank: 5 },
  ];

  // Empty recent scans
  const recentScans = [];

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem('user');
    
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
    
    // Simulate loading delay
    setTimeout(() => {
      const isAuth = !!user;
      setIsAuthenticated(isAuth);
      
      // Show onboarding if user is authenticated but hasn't completed onboarding
      if (isAuth && !hasCompletedOnboarding) {
        setShowOnboarding(true);
      }
      
      setIsLoading(false);
    }, 500);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  if (isLoading) {
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
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">
          Track your recycling progress and make a positive impact on the environment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Items Scanned"
          value={stats.itemsScanned}
          icon={<Leaf className="h-6 w-6 text-primary" />}
        />
        <StatCard
          title="Recyclable Items"
          value={stats.recyclableItems}
          icon={<Recycle className="h-6 w-6 text-eco-green" />}
          description={stats.itemsScanned > 0 ? `${Math.round((stats.recyclableItems / stats.itemsScanned) * 100)}% of total items` : '0% of total items'}
        />
        <StatCard
          title="Current Streak"
          value={`${stats.currentStreak} days`}
          icon={<Calendar className="h-6 w-6 text-eco-blue" />}
        />
        <StatCard
          title="Total Points"
          value={stats.totalPoints}
          icon={<Award className="h-6 w-6 text-eco-yellow" />}
        />
      </div>

      <div className="flex justify-center my-8">
        <Link to="/upload">
          <Button className="flex items-center gap-2 px-6 py-5 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <Upload className="h-5 w-5" />
            Scan New Item
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StreakCard 
          currentStreak={streakData.currentStreak}
          longestStreak={streakData.longestStreak}
          streakDays={streakData.streakDays}
        />
        <LeaderboardCard users={leaderboardUsers} />
        <RecentScansCard items={recentScans} />
      </div>
      
      {showOnboarding && (
        <OnboardingModal 
          isOpen={showOnboarding} 
          onClose={handleOnboardingComplete} 
        />
      )}
    </AppLayout>
  );
};

export default Dashboard;
