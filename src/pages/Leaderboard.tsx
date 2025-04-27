import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderboardCard from "@/components/dashboard/LeaderboardCard";
import PageTransition from "@/components/PageTransition";
import BackgroundImage from "@/components/BackgroundImage";
import { getLeaderboard, LeaderboardUser } from "@/services/leaderboardService";
import { Skeleton } from "@/components/ui/skeleton";

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'all-time'>('weekly');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const data = await getLeaderboard(activeTab);
        setLeaderboardData(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [activeTab]);

  return (
    <PageTransition>
      <BackgroundImage>
        <AppLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
              <p className="text-muted-foreground">
                See who's leading the way in recycling efforts.
              </p>
            </div>

            <Tabs defaultValue="weekly" className="w-full" onValueChange={(value) => setActiveTab(value as 'weekly' | 'monthly' | 'all-time')}>
              <TabsList className="grid w-full grid-cols-3 max-w-md">
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="all-time">All Time</TabsTrigger>
              </TabsList>
              <TabsContent value="weekly" className="space-y-4">
                {isLoading ? (
                  <Card className="p-4">
                    <Skeleton className="h-60 w-full" />
                  </Card>
                ) : leaderboardData.length > 0 ? (
                  <LeaderboardCard users={leaderboardData} />
                ) : (
                  <Card className="p-6 text-center">
                    <p className="text-muted-foreground">No leaderboard data available.</p>
                  </Card>
                )}
              </TabsContent>
              <TabsContent value="monthly" className="space-y-4">
                {isLoading ? (
                  <Card className="p-4">
                    <Skeleton className="h-60 w-full" />
                  </Card>
                ) : leaderboardData.length > 0 ? (
                  <LeaderboardCard users={leaderboardData} />
                ) : (
                  <Card className="p-6 text-center">
                    <p className="text-muted-foreground">No leaderboard data available.</p>
                  </Card>
                )}
              </TabsContent>
              <TabsContent value="all-time" className="space-y-4">
                {isLoading ? (
                  <Card className="p-4">
                    <Skeleton className="h-60 w-full" />
                  </Card>
                ) : leaderboardData.length > 0 ? (
                  <LeaderboardCard users={leaderboardData} />
                ) : (
                  <Card className="p-6 text-center">
                    <p className="text-muted-foreground">No leaderboard data available.</p>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </AppLayout>
      </BackgroundImage>
    </PageTransition>
  );
};

export default Leaderboard;
