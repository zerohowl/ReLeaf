
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

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for dashboard
  const stats = {
    itemsScanned: 42,
    recyclableItems: 36,
    currentStreak: 5,
    totalPoints: 830,
  };

  // Mock data for streak
  const streakData = {
    currentStreak: 5,
    longestStreak: 12,
    streakDays: [0, 1, 2, 3, 6], // 0 = Sunday, 6 = Saturday
  };

  // Mock data for leaderboard
  const leaderboardUsers = [
    { name: 'Alex Kim', score: 1245, rank: 1 },
    { name: 'Taylor Swift', score: 1120, rank: 2 },
    { name: 'John Doe', score: 950, rank: 3, isCurrentUser: true },
    { name: 'Sarah Johnson', score: 900, rank: 4 },
    { name: 'Mike Peterson', score: 780, rank: 5 },
  ];

  // Mock data for recent scans
  const recentScans = [
    {
      id: '1',
      name: 'Plastic Bottle',
      isRecyclable: true,
      date: '2 hours ago',
      imageUrl: 'https://images.unsplash.com/photo-1581213779916-8de94d7f3d3e?auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
      id: '2',
      name: 'Styrofoam Container',
      isRecyclable: false,
      date: 'Yesterday',
      imageUrl: 'https://images.unsplash.com/photo-1591993676692-175b71bd1ed1?auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
      id: '3',
      name: 'Cardboard Box',
      isRecyclable: true,
      date: '2 days ago',
      imageUrl: 'https://images.unsplash.com/photo-1595864658389-d8e0eea27c5e?auto=format&fit=crop&w=200&h=200&q=80'
    },
  ];

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem('user');
    
    // Simulate loading delay
    setTimeout(() => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    }, 500);
  }, []);

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
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Recyclable Items"
          value={stats.recyclableItems}
          icon={<Recycle className="h-6 w-6 text-eco-green" />}
          description={`${Math.round((stats.recyclableItems / stats.itemsScanned) * 100)}% of total items`}
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
          trend={{ value: 8, isPositive: true }}
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
    </AppLayout>
  );
};

export default Dashboard;
