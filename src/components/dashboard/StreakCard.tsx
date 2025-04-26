import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  streakDays: number[];
}

const StreakCard = ({ currentStreak, longestStreak, streakDays }: StreakCardProps) => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date().getDay();
  const orderedDays = [...days.slice((today + 1) % 7), ...days.slice(0, (today + 1) % 7)];

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Recycling Streak</CardTitle>
        <Calendar className="h-5 w-5 text-success-green" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-end">
          <div>
            <div className="stat-value">{currentStreak}</div>
            <p className="text-xs text-muted-foreground">Current streak</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">{longestStreak}</div>
            <p className="text-xs text-muted-foreground">Longest streak</p>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between">
          {orderedDays.map((day, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="text-xs text-muted-foreground mb-2">{day}</div>
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center transition-colors",
                  streakDays.includes(i)
                    ? "bg-success-green text-white"
                    : "bg-glass-bg text-muted-foreground"
                )}
              >
                {streakDays.includes(i) ? '✓' : ''}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCard;
