
import { Badge } from '@/components/ui/badge';

interface HistoryItem {
  id: string;
  name: string;
  isRecyclable: boolean;
  date: Date;
  imageUrl?: string;
  points?: number;
  videoUrl?: string;
}

interface HistoryTimelineProps {
  items: HistoryItem[];
}

const HistoryTimeline = ({ items }: HistoryTimelineProps) => {
  // Group items by date
  const groupedByDate = items.reduce((groups, item) => {
    const date = item.date.toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, HistoryItem[]>);

  // Convert to array of [date, items] pairs and sort by date (newest first)
  const sortedDates = Object.entries(groupedByDate).sort((a, b) => {
    return new Date(b[0]).getTime() - new Date(a[0]).getTime();
  });

  return (
    <div className="timeline-container py-6">
      {sortedDates.map(([dateString, dateItems], groupIndex) => (
        <div key={dateString} className="mb-8">
          <div className="flex justify-center mb-4">
            <Badge variant="outline" className="px-3 py-1">
              {new Date(dateString).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Badge>
          </div>

          <div className="space-y-8">
            {dateItems.map((item, itemIndex) => (
              <div 
                key={item.id}
                className="timeline-item relative flex"
                style={{ '--index': itemIndex } as React.CSSProperties}
              >
                <div className="w-1/2 pr-8">
                  {itemIndex % 2 === 0 && (
                    <div className="bg-card rounded-lg shadow p-4 ml-auto max-w-sm">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-lg">{item.name}</h3>
                        <Badge variant={item.isRecyclable ? "default" : "destructive"}>
                          {item.isRecyclable ? 'Recyclable' : 'Non-recyclable'}
                        </Badge>
                      </div>

                      {item.imageUrl && (
                        <div className="mb-3 rounded-md overflow-hidden">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-full h-40 object-cover"
                          />
                        </div>
                      )}

                      {item.videoUrl && (
                        <div className="mt-2 text-sm text-primary">
                          Video uploaded • Earned {item.points} points
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground mt-2">
                        {item.date.toLocaleTimeString()}
                      </div>
                    </div>
                  )}
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-eco-green z-10"></div>
                </div>

                <div className="w-1/2 pl-8">
                  {itemIndex % 2 === 1 && (
                    <div className="bg-card rounded-lg shadow p-4 mr-auto max-w-sm">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-lg">{item.name}</h3>
                        <Badge variant={item.isRecyclable ? "default" : "destructive"}>
                          {item.isRecyclable ? 'Recyclable' : 'Non-recyclable'}
                        </Badge>
                      </div>

                      {item.imageUrl && (
                        <div className="mb-3 rounded-md overflow-hidden">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-full h-40 object-cover"
                          />
                        </div>
                      )}

                      {item.videoUrl && (
                        <div className="mt-2 text-sm text-primary">
                          Video uploaded • Earned {item.points} points
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground mt-2">
                        {item.date.toLocaleTimeString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryTimeline;
