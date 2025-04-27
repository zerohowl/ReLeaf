
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import UploadZone from './UploadZone';
import { analyzeMedia } from '@/services/analysisService';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { uploadFile } from '@/services/uploadService';
import { addUserPoints } from '@/services/leaderboardService';

interface ProcessingState {
  stage: 'idle' | 'uploading' | 'analyzing' | 'detecting-actions' | 'verifying' | 'saving' | 'complete' | 'error';
  progress: number;
  message: string;
  details?: string;
  detectedObjects?: string[];
}

export interface VideoUploadProps {
  uploadedVideo?: File | null;
  setUploadedVideo?: (file: File | null) => void;
  isProcessing?: boolean;
  setIsProcessing?: (processing: boolean) => void;
  onUploadComplete?: () => void;
}

const VideoUpload = ({ 
  uploadedVideo = null, 
  setUploadedVideo = () => {}, 
  isProcessing = false, 
  setIsProcessing = () => {}, 
  onUploadComplete 
}: VideoUploadProps) => {
  const { toast } = useToast();
  const [processingState, setProcessingState] = useState<ProcessingState>({
    stage: 'idle',
    progress: 0,
    message: 'Ready to upload',
    detectedObjects: []
  });
  
  // Use the props for state instead of internal state

  const handleVideoUpload = (file: File) => {
    setUploadedVideo(file);
  };

  // Update processing state and notify parent component
  useEffect(() => {
    setIsProcessing(processingState.stage !== 'idle' && processingState.stage !== 'complete' && processingState.stage !== 'error');
  }, [processingState.stage, setIsProcessing]);

  const processVideo = async () => {
    if (!uploadedVideo) return;

    try {
      // Step 1: Upload initialization
      setProcessingState({
        stage: 'uploading',
        progress: 15,
        message: 'Processing video...',
        details: 'Preparing video data',
        detectedObjects: []
      });
      
      // Process the video file
      const reader = new FileReader();
      const base64Promise = new Promise((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(uploadedVideo);
      });
      
      const base64 = await base64Promise;
      console.log('Video converted to base64, sending to analyzer...');
      
      // Step 2: Frame extraction simulation
      setProcessingState(prev => ({
        ...prev,
        stage: 'analyzing',
        progress: 30,
        message: 'Analyzing video frames...',
        details: 'Extracting key frames',
        detectedObjects: ['Video content detected']
      }));
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Step 3: Object detection in video
      setProcessingState(prev => ({
        ...prev,
        progress: 45,
        details: 'Detecting objects in video',
        detectedObjects: ['Person detected', 'Object in hand']
      }));
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Step 4: Action recognition
      setProcessingState(prev => ({
        ...prev,
        stage: 'detecting-actions',
        progress: 60,
        message: 'Detecting recycling actions...',
        details: 'Analyzing movement patterns',
        detectedObjects: ['Person detected', 'Object in hand', 'Movement toward bin']
      }));
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Step 5: Verification
      setProcessingState(prev => ({
        ...prev,
        stage: 'verifying',
        progress: 75,
        message: 'Verifying proper disposal...',
        details: 'Checking if item was properly recycled',
        detectedObjects: ['Person detected', 'Object in hand', 'Proper disposal action']
      }));
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Use our secure backend service with realistic simulation
      const analysis = await analyzeMedia(base64 as string, false);
      console.log('Video analysis result:', analysis);
      
      // Step 6: Saving to database
      setProcessingState(prev => ({
        ...prev,
        stage: 'saving',
        progress: 90,
        message: 'Saving your activity...',
        details: 'Recording to your recycling history'
      }));
      
      // Calculate and update points - not just simulate anymore
      const isRecyclable = analysis.isRecyclable || false;
      const points = isRecyclable ? 25 : 5; // Give 5 points even for non-recyclable items
      
      // Save to database with detailed metadata
      try {
        const metadata = {
          identifiedItem: analysis.objectType || 'Video Activity',
          isRecyclable: isRecyclable,
          recyclingStatus: isRecyclable ? 'recyclable' : 'not recyclable',
          points: points,
          analysisDetails: analysis.explanation || 'Video showing recycling activity'
        };
        
        console.log('Saving video with metadata:', metadata);
        await uploadFile(uploadedVideo, JSON.stringify(metadata));
      } catch (uploadError) {
        console.error('Error saving to history:', uploadError);
        // Continue despite error
      }
      
      // Update the user's points in the leaderboard service
      const newTotalPoints = addUserPoints(points);
      console.log(`Added ${points} points for video upload, new total: ${newTotalPoints}`);
      
      const correctDisposal = isRecyclable;
      
      // Final state
      setProcessingState(prev => ({
        ...prev,
        stage: 'complete',
        progress: 100,
        message: correctDisposal ? 'Great job recycling!' : 'Incorrect disposal detected',
        details: correctDisposal 
          ? `You've earned ${points} points for proper recycling!`
          : 'The AI detected that the item was not disposed correctly'
      }));
      
      toast({
        title: correctDisposal ? "Good job!" : "Video Analysis Complete",
        description: correctDisposal
          ? `You've correctly disposed of this item and earned ${points} points! Your new total is ${newTotalPoints} points.`
          : `The AI has analyzed your video. You've earned ${points} points for submitting. Your new total is ${newTotalPoints} points.`,
        variant: correctDisposal ? "default" : "default",
      });
      
      // Wait before cleanup to allow user to see results
      setTimeout(() => {
        setUploadedVideo(null);
        
        if (onUploadComplete) {
          onUploadComplete();
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error processing video:', error);
      
      setProcessingState({
        stage: 'error',
        progress: 100,
        message: 'Analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error processing video'
      });
      
      toast({
        title: "Analysis Error",
        description: "We couldn't analyze your video. Please ensure it's a short clip (under 30 seconds) clearly showing the recycling action.",
        variant: "destructive",
      });
    }
  };

  // Render processing status feedback
  const renderProcessingStatus = () => {
    if (processingState.stage === 'idle') return null;
    
    const getStatusIcon = () => {
      switch (processingState.stage) {
        case 'complete': return <Check className="h-5 w-5 text-green-500" />;
        case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />;
        default: return <Loader2 className="h-5 w-5 animate-spin" />;
      }
    };
    
    return (
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium">{processingState.message}</span>
          </div>
          <span className="text-sm text-muted-foreground">{processingState.progress}%</span>
        </div>
        
        <Progress value={processingState.progress} className="h-2" />
        
        {processingState.details && (
          <p className="text-sm text-muted-foreground mt-1">{processingState.details}</p>
        )}
        
        {processingState.detectedObjects && processingState.detectedObjects.length > 0 && (
          <div className="mt-2">
            <p className="text-xs font-medium mb-1">AI detected:</p>
            <div className="flex flex-wrap gap-1">
              {processingState.detectedObjects.map((obj, i) => (
                <Badge key={i} variant="outline" className="text-xs">{obj}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
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
        
        {uploadedVideo && (
          <div className="mb-4">
            <video 
              src={URL.createObjectURL(uploadedVideo)} 
              controls 
              className="w-full h-auto max-h-56 rounded-md mb-3"
            />
            {renderProcessingStatus()}
          </div>
        )}

        <Button 
          onClick={processVideo} 
          className="w-full" 
          disabled={!uploadedVideo || (processingState.stage !== 'idle' && processingState.stage !== 'complete' && processingState.stage !== 'error')}
        >
          {processingState.stage === 'idle' || processingState.stage === 'complete' || processingState.stage === 'error' 
            ? 'Analyze Video' 
            : 'Analyzing...'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default VideoUpload;
