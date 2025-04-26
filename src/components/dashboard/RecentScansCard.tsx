
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface ScanItem {
  id: string;
  name: string;
  isRecyclable: boolean;
  date: string;
  imageUrl?: string;
}

interface RecentScansCardProps {
  items: ScanItem[];
}

const RecentScansCard = ({ items }: RecentScansCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Recent Scans</CardTitle>
        <History className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-2">
          {items.map((item) => (
            <div 
              key={item.id}
              className="flex items-center p-2 rounded-md hover:bg-muted/50"
            >
              {item.imageUrl ? (
                <div className="h-10 w-10 rounded-md overflow-hidden mr-3">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center mr-3">
                  {item.name.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-muted-foreground">{item.date}</div>
              </div>
              <Badge variant={item.isRecyclable ? "default" : "destructive"}>
                {item.isRecyclable ? 'Recyclable' : 'Non-recyclable'}
              </Badge>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link 
            to="/history"
            className="text-sm text-primary hover:underline"
          >
            View All Scans
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentScansCard;
