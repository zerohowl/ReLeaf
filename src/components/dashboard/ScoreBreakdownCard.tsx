import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ScoreCategory {
  name: string;
  points: number;
  percentage: number;
  color: string; // Tailwind color class
}

interface ScoreBreakdownCardProps {
  totalScore: number;
  categories: ScoreCategory[];
}

const ScoreBreakdownCard = ({ totalScore, categories }: ScoreBreakdownCardProps) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Score Breakdown</span>
          <span className="text-3xl font-bold text-eco-green">{totalScore}</span>
        </CardTitle>
        <CardDescription>How you're earning your recycling points</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="font-medium">{category.name}</div>
                <div className="text-sm text-muted-foreground">
                  {category.points} pts ({category.percentage}%)
                </div>
              </div>
              <Progress
                value={category.percentage}
                className={`h-2 ${category.color}`}
              />
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium mb-2">Boost your score by:</h4>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            <li>• Maintaining your recycling streak</li>
            <li>• Uploading verification videos</li>
            <li>• Recycling challenging materials</li>
            <li>• Inviting friends to join Releaf</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreBreakdownCard;
