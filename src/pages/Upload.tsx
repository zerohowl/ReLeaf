
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageScan from '@/components/upload/ImageScan';
import VideoUpload from '@/components/upload/VideoUpload';
import TextItemIdentifier from '@/components/upload/TextItemIdentifier';

const Upload = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('scan');
  const [hasGeminiKey, setHasGeminiKey] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem('user');
    
    // Check if Gemini API key is present
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    setHasGeminiKey(!!geminiKey);
    console.log('Upload component: Gemini API Key present:', !!geminiKey);
    
    setTimeout(() => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    }, 500);
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
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Upload & Scan</h1>
        <p className="text-muted-foreground">
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
  );
};

export default Upload;
