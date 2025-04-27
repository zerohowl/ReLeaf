import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import UploadZone from './UploadZone';
import ScanResult from './ScanResult';
import { uploadFile } from '@/services/uploadService';
import { analyzeMedia } from '@/services/analysisService';
import { addUserPoints } from '@/services/leaderboardService';
import jsQR from 'jsqr';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, AlertCircle, Check, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface ImageScanProps {
  uploadedImage?: File | null;
  setUploadedImage?: (file: File | null) => void;
  scanResult?: any | null;
  setScanResult?: (result: any | null) => void;
  isProcessing?: boolean;
  setIsProcessing?: (processing: boolean) => void;
  onScanComplete?: () => void;
  uploadType?: 'image' | 'video'; // Added to handle different upload types
}

interface ProcessingState {
  stage: 'idle' | 'uploading' | 'detecting-qr' | 'analyzing' | 'saving' | 'complete' | 'error';
  progress: number;
  message: string;
  details?: string;
  detectedObjects?: string[];
}

const ImageScan = ({ 
  uploadedImage = null, 
  setUploadedImage = () => {}, 
  scanResult = null, 
  setScanResult = () => {}, 
  isProcessing = false, 
  setIsProcessing = () => {}, 
  onScanComplete,
  uploadType = 'image'
}: ImageScanProps) => {
  const { toast } = useToast();
  const [processingState, setProcessingState] = useState<ProcessingState>({
    stage: 'idle',
    progress: 0,
    message: 'Ready to scan',
    detectedObjects: []
  });
  
  // Use the props for state instead of internal state

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    // Clear any previous scan results when a new image is uploaded
    setScanResult(null);
  };

  useEffect(() => {
    setIsProcessing(processingState.stage !== 'idle' && processingState.stage !== 'complete' && processingState.stage !== 'error');
  }, [processingState.stage, setIsProcessing]);

  // Try QR code detection with different rotations/transformations
  const detectQrWithTransforms = async (imageData: ImageData, originalCanvas: HTMLCanvasElement): Promise<{code: any, transform: string} | null> => {
    // Original orientation
    let code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) return {code, transform: 'original'};
    
    // Try different angles and transformations
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', {willReadFrequently: true});
    if (!ctx) return null;
    
    // Check with different rotations
    const angles = [90, 180, 270]; // Try different rotations
    for (const angle of angles) {
      setProcessingState(prev => ({
        ...prev,
        details: `Trying QR detection at ${angle}° rotation...`
      }));
      
      canvas.width = angle === 90 || angle === 270 ? imageData.height : imageData.width;
      canvas.height = angle === 90 || angle === 270 ? imageData.width : imageData.height;
      
      ctx.save();
      ctx.translate(canvas.width/2, canvas.height/2);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.drawImage(
        originalCanvas, 
        -imageData.width/2, 
        -imageData.height/2, 
        imageData.width, 
        imageData.height
      );
      ctx.restore();
      
      const rotatedData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      code = jsQR(rotatedData.data, rotatedData.width, rotatedData.height);
      if (code) return {code, transform: `${angle}° rotation`};
    }
    
    return null;
  };
  
  const processMedia = async () => {
    if (!uploadedImage) return;

    try {
      setProcessingState({
        stage: 'uploading',
        progress: 10,
        message: `Processing ${uploadType}...`,
        details: `Preparing ${uploadType} for analysis`,
        detectedObjects: []
      });
    
      // Read the image file
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(uploadedImage);
      });
      
      const base64 = await base64Promise;
      
      // Load image for visual processing
      setProcessingState(prev => ({
        ...prev,
        progress: 20,
        details: 'Loading image for analysis...'
      }));
      
      const imgEl = new Image();
      await new Promise((resolve) => {
        imgEl.onload = resolve;
        imgEl.src = base64;
      });
      
      // Set up canvas for image processing
      const canvas = document.createElement('canvas');
      canvas.width = imgEl.width;
      canvas.height = imgEl.height;
      const ctx = canvas.getContext('2d', {willReadFrequently: true});
      if (!ctx) throw new Error('Could not create canvas context');
      
      // Draw image to canvas
      ctx.drawImage(imgEl, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Try QR code detection with different transformations
      setProcessingState(prev => ({
        ...prev,
        stage: 'detecting-qr',
        progress: 35,
        message: 'Searching for QR codes...',
        details: 'Examining image from different angles'
      }));
      
      // Pass the canvas to the function instead of attaching it to imageData
      const qrResult = await detectQrWithTransforms(imageData, canvas);
      
      if (qrResult) {
        setScanResult({ qrData: qrResult.code.data });
        setProcessingState(prev => ({
          ...prev,
          stage: 'complete',
          progress: 100,
          message: 'QR Code Detected!',
          details: `Found using ${qrResult.transform}` 
        }));
        
        toast({ 
          title: 'QR Code Detected', 
          description: `Found using ${qrResult.transform}: ${qrResult.code.data.substring(0, 30)}${qrResult.code.data.length > 30 ? '...' : ''}` 
        });
        return;
      }
      // Analyze with Gemini through our backend
      setProcessingState(prev => ({
        ...prev,
        stage: 'analyzing',
        progress: 50,
        message: 'Analyzing image with AI...',
        details: 'Identifying objects and recyclability'
      }));
      
      // Use our secure backend service for analysis
      const analysis = await analyzeMedia(base64, false);
      
      // Update processing state with detected objects
      setProcessingState(prev => ({
        ...prev,
        progress: 70,
        details: `AI identification complete: ${analysis.objectType || 'Unknown'}`,
        detectedObjects: analysis.objectType ? [analysis.objectType] : ['Unknown item']
      }));
      
      if (!analysis.isCorrect) {
        setProcessingState(prev => ({
          ...prev,
          stage: 'error',
          progress: 100,
          message: 'Analysis failed',
          details: analysis.explanation || "Please upload an image of a recyclable or non-recyclable item."
        }));
        
        toast({
          title: "Invalid Image",
          description: analysis.explanation || "Please upload an image of a recyclable or non-recyclable item.",
          variant: "destructive",
        });
        return;
      }

      // Create results object - ENSURE THIS IS CONSISTENT with how history displays items
      const isRecyclable = analysis.isRecyclable || false;
      
      // Log the analysis result for debugging
      console.log('Analysis result:', analysis);
      
      const result = {
        object: analysis.objectType || 'Unknown Item',
        isRecyclable: isRecyclable, // Store the boolean directly, not derived
        confidence: analysis.confidence * 100,
        material: analysis.objectType ? analysis.objectType.toLowerCase().includes('plastic') ? 'Plastic' : 
                                      analysis.objectType.toLowerCase().includes('paper') ? 'Paper' : 
                                      analysis.objectType.toLowerCase().includes('glass') ? 'Glass' : 
                                      analysis.objectType.toLowerCase().includes('metal') ? 'Metal' : 'Mixed' : 'Unknown',
        explanation: analysis.explanation || '',
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
      
      // Save the result to the database
      setProcessingState(prev => ({
        ...prev,
        stage: 'saving',
        progress: 85,
        message: 'Saving results...',
        details: 'Uploading to your history'
      }));
      
      try {
        // Save to database with detailed metadata to ensure consistency
        const uploadData = {
          file: uploadedImage,
          description: analysis.explanation || '',
          metadata: {
            identifiedItem: result.object,
            isRecyclable: result.isRecyclable,
            confidence: result.confidence,
            materialType: result.material
          }
        };
        
        // Log for debugging
        console.log('Saving scan with metadata:', uploadData);
        
        // Update user points for this scan
        const pointsEarned = result.isRecyclable ? Math.floor(Math.random() * 30) + 10 : 5;
        const newTotalPoints = addUserPoints(pointsEarned);
        console.log(`Added ${pointsEarned} points, new total: ${newTotalPoints}`);
        
        await uploadFile(uploadedImage, JSON.stringify({
          identifiedItem: result.object,
          isRecyclable: result.isRecyclable,
          recyclingStatus: result.isRecyclable ? 'recyclable' : 'not recyclable',
          points: pointsEarned
        }));
        
        setProcessingState(prev => ({
          ...prev,
          stage: 'complete',
          progress: 100,
          message: 'Analysis complete!',
          details: `${result.object} is ${result.isRecyclable ? '' : 'not '}recyclable`
        }));
      } catch (uploadError) {
        console.error('Error uploading to history:', uploadError);
        // Continue with analysis results but warn about history save failure
        setProcessingState(prev => ({
          ...prev,
          stage: 'complete',
          progress: 100,
          message: 'Analysis complete! (Save to history failed)',
          details: `${result.object} is ${result.isRecyclable ? '' : 'not '}recyclable`
        }));
        
        toast({
          title: "Warning",
          description: "Analysis complete but failed to save to history.",
          variant: "destructive",
        });
      }

      // Update the scan result state
      setScanResult(result);

      // Get points message for toast
      const pointsMessage = result.isRecyclable ? 
        `You earned ${result.isRecyclable ? Math.floor(Math.random() * 30) + 10 : 5} points!` : 
        'Thanks for checking! Even non-recyclable scans help our database.';
      
      toast({
        title: analysis.isRecyclable ? "Recyclable Item!" : "Non-Recyclable Item",
        description: `${analysis.explanation || (analysis.isRecyclable ? 
          "This item can be recycled. Check the locations below." : 
          "This item should go in the regular trash.")} ${pointsMessage}`,
        variant: analysis.isRecyclable ? "default" : "destructive",
      });

    } catch (error) {
      console.error('Error processing image:', error);
      setProcessingState({
        stage: 'error',
        progress: 100,
        message: 'Error processing image',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      
      toast({
        title: "Error",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
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
    
    resetScan();
    if (onScanComplete) {
      onScanComplete();
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
            <p className="text-sm font-medium mb-1">Detected:</p>
            <div className="flex flex-wrap gap-1">
              {processingState.detectedObjects.map((obj, i) => (
                <Badge key={i} variant="outline">{obj}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (scanResult && 'qrData' in scanResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>QR Code Result</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="break-all text-muted-foreground">{scanResult.qrData}</p>

          <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center sm:justify-between">
            <Button variant="outline" onClick={resetScan}>
              Scan New Item
            </Button>
            <Button onClick={saveResult}>
              Save Result
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (scanResult) {
    // Create props for ScanResult component
    const scanResultProps = {
      object: scanResult.object,
      isRecyclable: scanResult.isRecyclable,
      confidence: scanResult.confidence,
      material: scanResult.material,
      locations: scanResult.locations,
      onReset: resetScan,
      onSaveResult: saveResult
    };
    
    return <ScanResult {...scanResultProps} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recycle Scanner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {scanResult && !('qrData' in scanResult) ? (
          <ScanResult 
            object={scanResult.object}
            isRecyclable={scanResult.isRecyclable}
            confidence={scanResult.confidence}
            material={scanResult.material}
            locations={scanResult.locations}
            onReset={resetScan}
            onSaveResult={saveResult}
          />
        ) : (
          <>
            <UploadZone 
              onFileSelected={handleImageUpload}
              type={uploadType}
              className="mb-4"
            />
            
            {uploadedImage && (
              <div className="mt-4 flex flex-col space-y-4 items-center">
                {uploadType === 'image' ? (
                  <img
                    src={URL.createObjectURL(uploadedImage)}
                    alt="Preview"
                    className="w-full max-w-xs rounded-lg object-contain max-h-48"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(uploadedImage)}
                    controls
                    className="w-full max-w-xs rounded-lg object-contain max-h-48"
                  />
                )}

                {renderProcessingStatus()}

                <Button 
                  onClick={processMedia}
                  disabled={processingState.stage !== 'idle' && processingState.stage !== 'complete' && processingState.stage !== 'error'}
                  className="mt-2"
                >
                  {processingState.stage === 'idle' || processingState.stage === 'complete' || processingState.stage === 'error' 
                    ? `Analyze ${uploadType}` 
                    : `Analyzing ${uploadType}...`}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageScan;
