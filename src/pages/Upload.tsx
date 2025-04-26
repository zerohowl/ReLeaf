import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import UploadZone from '@/components/upload/UploadZone';
import ScanResult from '@/components/upload/ScanResult';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { analyzeRecyclingAction } from '@/integrations/gemini/image-video-analyzer';

const Upload = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('scan');

  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem('user');
    
    setTimeout(() => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
  };

  const handleVideoUpload = (file: File) => {
    setUploadedVideo(file);
  };

  const processImage = async () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    
    try {
      // Convert image to base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(uploadedImage);
      });
      
      const base64 = await base64Promise;
      const analysis = await analyzeRecyclingAction(base64 as string, false);
      
      // Mock result data combined with AI analysis
      const result = {
        object: 'Plastic Water Bottle',
        isRecyclable: analysis.isCorrect,
        confidence: analysis.confidence * 100,
        material: 'PET Plastic',
        locations: [
          {
            name: 'Community Recycling Center',
            address: '123 Green St, Eco City',
            distance: '0.8 miles'
          },
          {
            name: 'Supermarket Drop-off',
            address: '456 Main Ave, Eco City',
            distance: '1.2 miles'
          }
        ]
      };

      setScanResult(result);
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processVideo = async () => {
    if (!uploadedVideo) return;

    setIsProcessing(true);
    
    try {
      // Convert video to base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(uploadedVideo);
      });
      
      const base64 = await base64Promise;
      const analysis = await analyzeRecyclingAction(base64 as string, true);
      
      toast({
        title: analysis.isCorrect ? "Good job!" : "Incorrect disposal",
        description: analysis.isCorrect 
          ? "You've correctly disposed of this item and earned 25 points!"
          : "Please check the recycling guidelines and try again.",
        variant: analysis.isCorrect ? "default" : "destructive",
      });
      
      // Reset the video upload
      setUploadedVideo(null);
      
      // Switch back to scan tab
      setActiveTab('scan');
    } catch (error) {
      console.error('Error processing video:', error);
      toast({
        title: "Error",
        description: "Failed to analyze the video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetScan = () => {
    setUploadedImage(null);
    setScanResult(null);
  };

  const saveResult = () => {
    toast({
      title: "Scan saved successfully",
      description: "This item has been added to your history.",
    });
    
    // Reset the scan
    resetScan();
  };

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
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="scan">Scan Item</TabsTrigger>
          <TabsTrigger value="video">Upload Recycling Video</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scan">
          {!scanResult ? (
            <Card>
              <CardHeader>
                <CardTitle>Scan a New Item</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  Upload a photo of an item you want to check for recyclability.
                  Our AI will identify the object and provide recycling information.
                </p>
                
                <UploadZone
                  onFileSelected={handleImageUpload}
                  type="image"
                  className="mb-6"
                />

                <Button 
                  onClick={processImage} 
                  className="w-full" 
                  disabled={!uploadedImage || isProcessing}
                >
                  {isProcessing ? 'Processing Image...' : 'Analyze Item'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <ScanResult 
              object={scanResult.object}
              isRecyclable={scanResult.isRecyclable}
              confidence={scanResult.confidence}
              material={scanResult.material}
              locations={scanResult.locations}
              onReset={resetScan}
              onSaveResult={saveResult}
            />
          )}
        </TabsContent>

        <TabsContent value="video">
          <Card>
            <CardHeader>
              <CardTitle>Upload Recycling Video</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                Record and upload a short video of yourself actually recycling an item.
                Our AI will score your effort and award points to keep your streak going!
              </p>
              
              <UploadZone
                onFileSelected={handleVideoUpload}
                type="video"
                className="mb-6"
              />

              <Button 
                onClick={processVideo} 
                className="w-full" 
                disabled={!uploadedVideo || isProcessing}
              >
                {isProcessing ? 'Processing Video...' : 'Submit Video'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Upload;
