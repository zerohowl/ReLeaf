import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import HistoryTimeline from '@/components/history/HistoryTimeline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import PageTransition from '@/components/PageTransition';
import BackgroundImage from '@/components/BackgroundImage';
import { supabase } from '@/integrations/supabase/client';

const History = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock history data
  const mockHistoryItems = [
    {
      id: '1',
      name: 'Plastic Bottle',
      isRecyclable: true,
      date: new Date(2023, 3, 15, 10, 30),
      imageUrl: 'https://images.unsplash.com/photo-1581213779916-8de94d7f3d3e?auto=format&fit=crop&w=600&h=400&q=80',
      points: 25,
      videoUrl: 'video1.mp4'
    },
    {
      id: '2',
      name: 'Cardboard Box',
      isRecyclable: true,
      date: new Date(2023, 3, 15, 14, 45),
      imageUrl: 'https://images.unsplash.com/photo-1595864658389-d8e0eea27c5e?auto=format&fit=crop&w=600&h=400&q=80'
    },
    {
      id: '3',
      name: 'Styrofoam Container',
      isRecyclable: false,
      date: new Date(2023, 3, 14, 9, 20),
      imageUrl: 'https://images.unsplash.com/photo-1591993676692-175b71bd1ed1?auto=format&fit=crop&w=600&h=400&q=80'
    },
    {
      id: '4',
      name: 'Aluminum Can',
      isRecyclable: true,
      date: new Date(2023, 3, 14, 16, 10),
      imageUrl: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=600&h=400&q=80',
      points: 20,
      videoUrl: 'video2.mp4'
    },
    {
      id: '5',
      name: 'Glass Jar',
      isRecyclable: true,
      date: new Date(2023, 3, 13, 11, 5),
      imageUrl: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?auto=format&fit=crop&w=600&h=400&q=80'
    },
    {
      id: '6',
      name: 'Pizza Box (Soiled)',
      isRecyclable: false,
      date: new Date(2023, 3, 12, 19, 30),
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&h=400&q=80'
    }
  ];

  // Filter by recyclable status
  const allItems = mockHistoryItems;
  const recyclableItems = mockHistoryItems.filter(item => item.isRecyclable);
  const nonRecyclableItems = mockHistoryItems.filter(item => !item.isRecyclable);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const localUser = localStorage.getItem('user');
      setIsAuthenticated(!!data.session || !!localUser);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading history...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <PageTransition>
      <BackgroundImage blurred={true}>
        <AppLayout>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Your Recycling History</h1>
          <p className="text-muted-foreground">
            Track all your scanned items and recycling activities over time.
          </p>
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
                <HistoryTimeline items={allItems} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recyclable">
            <Card>
              <CardContent className="pt-6">
                <HistoryTimeline items={recyclableItems} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="non-recyclable">
            <Card>
              <CardContent className="pt-6">
                <HistoryTimeline items={nonRecyclableItems} />
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
