
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Leaderboard</CardTitle>
        <Award className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-2">
          {users.map((user) => (
            <div 
              key={user.rank}
              className={`flex items-center p-2 rounded-md ${
                user.isCurrentUser 
                  ? 'bg-primary/10 border border-primary/20' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted mr-3">
                {user.rank}
              </div>
              <div className="flex-1">
                <div className="font-medium">
                  {user.name} {user.isCurrentUser && '(You)'}
                </div>
              </div>
              <div className="font-semibold text-right">{user.score} pts</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
