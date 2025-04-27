import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageScan from '@/components/upload/ImageScan';
import VideoUpload from '@/components/upload/VideoUpload';
import TextItemIdentifier from '@/components/upload/TextItemIdentifier';
import PageTransition from '@/components/PageTransition';
import BackgroundImage from '@/components/BackgroundImage';
import { isAuthenticated as isAuth } from '@/services/authService';

const Upload = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('scan');
  const [hasGeminiKey, setHasGeminiKey] = useState(false);

  useEffect(() => {
    const auth = isAuth();
    setIsAuthenticated(auth);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Check Gemini API key for feature flag
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    setHasGeminiKey(!!geminiKey);
    console.log('Upload component: Gemini API Key present:', !!geminiKey);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <PageTransition>
      <BackgroundImage>
        <AppLayout>
      <div className="mb-6 bg-white/70 dark:bg-black/50 backdrop-blur-sm p-4 rounded-lg">
        <h1 className="text-3xl font-bold mb-2 dark:text-white">Upload & Scan</h1>
        <p className="text-muted-foreground dark:text-gray-200">
          Upload an item to check its recyclability or record your recycling action.
        </p>
        {!hasGeminiKey && (
          <p className="text-amber-500 mt-2">
            Note: Gemini API key not detected. Some features may be limited.
          </p>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="scan">Scan Item</TabsTrigger>
          <TabsTrigger value="describe">Describe Item</TabsTrigger>
          <TabsTrigger value="video">Upload Recycling Video</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scan">
          <ImageScan onScanComplete={() => setActiveTab('video')} />
        </TabsContent>
        
        <TabsContent value="describe">
          <TextItemIdentifier onItemIdentified={() => {
            // You can handle what happens after item identification
          }} />
        </TabsContent>

        <TabsContent value="video">
          <VideoUpload onUploadComplete={() => setActiveTab('scan')} />
        </TabsContent>
      </Tabs>
        </AppLayout>
      </BackgroundImage>
    </PageTransition>
  );
};

export default Upload;
