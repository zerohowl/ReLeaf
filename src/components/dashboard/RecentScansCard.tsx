
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item) => (
              <div 
                key={item.id}
                className="flex items-center p-2 rounded-md hover:bg-muted/50"
              >
                <Avatar className="h-10 w-10 rounded-md mr-3">
                  {item.imageUrl ? (
                    <AvatarImage 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="object-cover"
                      onError={(e) => {
                        console.error("Image failed to load:", e);
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                  <AvatarFallback className="rounded-md bg-muted flex items-center justify-center">
                    {item.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
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
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p>No scans yet</p>
            <p className="text-sm mt-1">Scan your first item to get started</p>
          </div>
        )}
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
