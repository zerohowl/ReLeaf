import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StreakCard from "@/components/dashboard/StreakCard";
import PageTransition from "@/components/PageTransition";
import BackgroundImage from "@/components/BackgroundImage";

const Streaks = () => {
  // Sample streak data (0 = Sunday, 6 = Saturday)
  const currentStreak = 4;
  const longestStreak = 14;
  const activeStreakDays = [0, 1, 3, 4]; // Sunday, Monday, Wednesday, Thursday

  return (
    <PageTransition>
      <BackgroundImage>
        <AppLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Recycling Streaks</h1>
              <p className="text-muted-foreground">
                Track your recycling consistency and build better habits.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Current Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <StreakCard 
                    currentStreak={currentStreak} 
                    longestStreak={longestStreak} 
                    streakDays={activeStreakDays}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Streak History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Your streak history chart will appear here.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">7-Day Streak</p>
                        <p className="text-sm text-muted-foreground">Recycle for 7 days in a row</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">4/7</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Perfect Month</p>
                        <p className="text-sm text-muted-foreground">Recycle every day for a month</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">4/30</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </AppLayout>
      </BackgroundImage>
    </PageTransition>
  );
};

export default Streaks;
