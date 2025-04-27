import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Leaf, Home, Car, Package, Recycle } from "lucide-react";

interface TipCardProps {
  title: string;
  content: string;
  category: string;
}

const TipCard = ({ title, content, category }: TipCardProps) => {
  // Set icon based on category
  const getIconForCategory = () => {
    switch (category) {
      case 'general':
        return <Recycle className="h-5 w-5" />;
      case 'plastic':
      case 'paper':
        return <Recycle className="h-5 w-5" />;
      case 'advanced':
        return <Lightbulb className="h-5 w-5" />;
      case 'living':
        return <Home className="h-5 w-5" />;
      case 'lifestyle':
        return <Leaf className="h-5 w-5" />;
      case 'transportation':
        return <Car className="h-5 w-5" />;
      default:
        return <Lightbulb className="h-5 w-5" />;
    }
  };

  // Set background color based on category
  const getColorForCategory = () => {
    switch (category) {
      case 'general':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'plastic':
      case 'paper':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      case 'advanced':
        return 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800';
      case 'living':
        return 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800';
      case 'lifestyle':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'transportation':
        return 'bg-teal-50 border-teal-200 dark:bg-teal-900/20 dark:border-teal-800';
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-gray-800/30 dark:border-gray-700';
    }
  };

  // Set icon color based on category
  const getIconColorForCategory = () => {
    switch (category) {
      case 'general':
        return 'text-green-500 dark:text-green-400';
      case 'plastic':
      case 'paper':
        return 'text-blue-500 dark:text-blue-400';
      case 'advanced':
        return 'text-purple-500 dark:text-purple-400';
      case 'living':
        return 'text-amber-500 dark:text-amber-400';
      case 'lifestyle':
        return 'text-green-500 dark:text-green-400';
      case 'transportation':
        return 'text-teal-500 dark:text-teal-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  return (
    <Card className={`${getColorForCategory()} border shadow-sm`}>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <div className={`${getIconColorForCategory()} p-1`}>
          {getIconForCategory()}
        </div>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{content}</p>
      </CardContent>
    </Card>
  );
};

export default TipCard;
