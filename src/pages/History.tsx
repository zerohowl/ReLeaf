import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import HistoryTimeline from '@/components/history/HistoryTimeline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import PageTransition from '@/components/PageTransition';
import BackgroundImage from '@/components/BackgroundImage';
import { isAuthenticated as isAuth } from '@/services/authService';
import { getUserUploads } from '@/services/uploadService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const History = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Filter by recyclable status
  const allItems = historyItems;
  const recyclableItems = historyItems.filter(item => item.isRecyclable);
  const nonRecyclableItems = historyItems.filter(item => !item.isRecyclable);

  const fetchHistoryItems = async () => {
    try {
      setIsRefreshing(true);
      const uploads = await getUserUploads();
      setHistoryItems(uploads);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching history:', err);
      setError(err.message || 'Failed to load history');
      // Don't clear existing items on error to keep the UI stable
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const auth = isAuth();
    setIsAuthenticated(auth);
    
    if (auth) {
      fetchHistoryItems();
    } else {
      setIsLoading(false);
    }
  }, []);
  
  const handleRefresh = () => {
    fetchHistoryItems();
    toast.success('Refreshing history...');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading history...</p>
      </div>
    );
  }
  
  // If there's no history items yet
  const noHistoryItems = historyItems.length === 0 && !isLoading;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <PageTransition>
      <BackgroundImage>
        <AppLayout>
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Recycling History</h1>
              <p className="text-muted-foreground">
                Track all your scanned items and recycling activities over time.
              </p>
            </div>
            <Button 
              onClick={handleRefresh} 
              disabled={isRefreshing}
              variant="outline"
              size="sm"
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="recyclable">Recyclable</TabsTrigger>
            <TabsTrigger value="non-recyclable">Non-Recyclable</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardContent className="pt-6">
                {noHistoryItems ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      You haven't uploaded any items yet. Start recycling to build your history!
                    </p>
                    <Button onClick={() => window.location.href = '/scan'}>Scan an Item</Button>
                  </div>
                ) : (
                  <HistoryTimeline items={allItems} />
                )}
                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recyclable">
            <Card>
              <CardContent className="pt-6">
                {recyclableItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No recyclable items found in your history.</p>
                  </div>
                ) : (
                  <HistoryTimeline items={recyclableItems} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="non-recyclable">
            <Card>
              <CardContent className="pt-6">
                {nonRecyclableItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No non-recyclable items found in your history.</p>
                  </div>
                ) : (
                  <HistoryTimeline items={nonRecyclableItems} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </AppLayout>
      </BackgroundImage>
    </PageTransition>
  );
};

export default History;
