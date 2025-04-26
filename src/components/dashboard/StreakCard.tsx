
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  streakDays: number[];
}

const StreakCard = ({ currentStreak, longestStreak, streakDays }: StreakCardProps) => {
  // Generate last 7 days (0 = Sunday, 6 = Saturday)
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date().getDay();
  
  // Reorder days array so that today is last (most right)
  const orderedDays = [...days.slice((today + 1) % 7), ...days.slice(0, (today + 1) % 7)];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Recycling Streak</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-end">
          <div>
            <div className="text-3xl font-bold">{currentStreak}</div>
            <p className="text-xs text-muted-foreground">Current streak</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">{longestStreak}</div>
            <p className="text-xs text-muted-foreground">Longest streak</p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between">
          {orderedDays.map((day, i) => {
            // Consider the day as active if it's in the streakDays
            const isActive = streakDays.includes(i);
            
            return (
              <div key={i} className="flex flex-col items-center">
                <div className="text-xs text-muted-foreground">{day}</div>
                <div
                  className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center ${
                    isActive 
                      ? 'bg-eco-green text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isActive ? '✓' : ''}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCard;
