
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderboardCard from "@/components/dashboard/LeaderboardCard";

const Leaderboard = () => {
  // Sample leaderboard data
  const weeklyUsers = [
    { name: "Alex Thompson", score: 450, rank: 1 },
    { name: "Jamie Rodriguez", score: 410, rank: 2 },
    { name: "Taylor Kim", score: 380, rank: 3 },
    { name: "Jordan Smith", score: 350, rank: 4, isCurrentUser: true },
    { name: "Casey Johnson", score: 320, rank: 5 },
  ];

  const monthlyUsers = [
    { name: "Morgan Williams", score: 1250, rank: 1 },
    { name: "Alex Thompson", score: 1150, rank: 2 },
    { name: "Jordan Smith", score: 980, rank: 3, isCurrentUser: true },
    { name: "Taylor Kim", score: 920, rank: 4 },
    { name: "Casey Johnson", score: 870, rank: 5 },
  ];

  const allTimeUsers = [
    { name: "Morgan Williams", score: 5680, rank: 1 },
    { name: "Riley Chen", score: 4950, rank: 2 },
    { name: "Alex Thompson", score: 4320, rank: 3 },
    { name: "Jordan Smith", score: 3760, rank: 4, isCurrentUser: true },
    { name: "Jamie Rodriguez", score: 3540, rank: 5 },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground">
            See who's leading the way in recycling efforts.
          </p>
        </div>

        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="all-time">All Time</TabsTrigger>
          </TabsList>
          <TabsContent value="weekly">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Leaders</CardTitle>
              </CardHeader>
              <CardContent>
                <LeaderboardCard users={weeklyUsers} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="monthly">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Leaders</CardTitle>
              </CardHeader>
              <CardContent>
                <LeaderboardCard users={monthlyUsers} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="all-time">
            <Card>
              <CardHeader>
                <CardTitle>All-Time Leaders</CardTitle>
              </CardHeader>
              <CardContent>
                <LeaderboardCard users={allTimeUsers} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Leaderboard;
