
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { UserUpload } from '@/services/uploadService';

interface RecentScansCardProps {
  items: UserUpload[];
  isLoading?: boolean;
  showUploadPrompt?: boolean;
}

const RecentScansCard = ({ items, isLoading = false, showUploadPrompt = false }: RecentScansCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Recent Scans</CardTitle>
        <History className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="px-2">
        {isLoading ? (
          <div className="space-y-3 py-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center p-2">
                <Skeleton className="h-10 w-10 rounded-md mr-3" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
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
                      alt={item.name || ''}
                      className="object-cover"
                      onError={(e) => {
                        console.error("Image failed to load:", e);
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                  <AvatarFallback className="rounded-md bg-muted flex items-center justify-center">
                    {(item.name || item.fileName || '?').charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{item.name || item.fileName}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.date ? (
                      typeof item.date === 'string' ? item.date : item.date.toLocaleDateString()
                    ) : (
                      new Date(item.uploadedAt).toLocaleDateString()
                    )}
                  </div>
                </div>
                <Badge variant={item.isRecyclable ? "default" : "destructive"}>
                  {item.isRecyclable ? 'Recyclable' : 'Non-recyclable'}
                </Badge>
              </div>
            ))}
          </div>
        ) : showUploadPrompt ? (
          <div className="py-8 text-center">
            <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No items scanned yet</p>
            <Link to="/upload">
              <Button size="sm">Scan Your First Item</Button>
            </Link>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p>No scans available</p>
            <p className="text-sm mt-1">Check back after scanning items</p>
          </div>
        )}
        
        {items.length > 0 && (
          <div className="mt-4 text-center">
            <Link 
              to="/history"
              className="text-sm text-primary hover:underline"
            >
              View All Scans
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentScansCard;
