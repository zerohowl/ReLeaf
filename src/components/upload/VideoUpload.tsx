
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import UploadZone from './UploadZone';
import { analyzeRecyclingAction } from '@/integrations/gemini/image-video-analyzer';

export interface VideoUploadProps {
  onUploadComplete?: () => void;
}

const VideoUpload = ({ onUploadComplete }: VideoUploadProps) => {
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleVideoUpload = (file: File) => {
    setUploadedVideo(file);
  };

  const processVideo = async () => {
    if (!uploadedVideo) return;

    setIsProcessing(true);
    
    try {
      const reader = new FileReader();
      const base64Promise = new Promise((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(uploadedVideo);
      });
      
      const base64 = await base64Promise;
      console.log('Video converted to base64, sending to analyzer...');
      
      const analysis = await analyzeRecyclingAction(base64 as string, true);
      console.log('Video analysis result:', analysis);
      
      const points = analysis.isCorrect ? 25 : 0;
      
      toast({
        title: analysis.isCorrect ? "Good job!" : "Incorrect disposal",
        description: analysis.isCorrect 
          ? `You've correctly disposed of this item and earned ${points} points!`
          : "The AI detected incorrect disposal. Check the recycling guidelines and try again.",
        variant: analysis.isCorrect ? "default" : "destructive",
      });
      
      setUploadedVideo(null);
      
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error('Error processing video:', error);
      toast({
        title: "Analysis Error",
        description: "We couldn't analyze your video. Please ensure it's a short clip (under 30 seconds) clearly showing the recycling action.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
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
  );
};

export default VideoUpload;
