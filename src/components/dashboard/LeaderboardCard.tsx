
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardUser {
  name: string;
  score: number;
  rank: number;
  avatar?: string;
  isCurrentUser?: boolean;
}

interface LeaderboardCardProps {
  users: LeaderboardUser[];
}

const LeaderboardCard = ({ users }: LeaderboardCardProps) => {
  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Leaderboard</CardTitle>
        <Award className="h-5 w-5 text-success-green" />
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-2">
          {users.map((user) => (
            <div 
              key={user.rank}
              className={cn(
                "flex items-center p-3 rounded-lg transition-colors",
                user.isCurrentUser 
                  ? "bg-success-green/10 border border-success-green/20" 
                  : "hover:bg-glass-bg"
              )}
            >
              <div className={cn(
                "flex items-center justify-center h-6 w-6 rounded-full text-sm font-medium mr-3",
                user.rank <= 3 ? "bg-success-green text-white" : "bg-glass-bg text-muted-foreground"
              )}>
                {user.rank}
              </div>
              <div className="flex-1">
                <div className="font-medium">
                  {user.name} {user.isCurrentUser && '(You)'}
                </div>
              </div>
              <div className="font-semibold text-right">{user.score} pt</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
