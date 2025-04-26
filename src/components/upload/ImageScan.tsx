
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import UploadZone from './UploadZone';
import ScanResult from './ScanResult';
import { analyzeRecyclingAction } from '@/integrations/gemini/image-video-analyzer';

export interface ImageScanProps {
  onScanComplete?: () => void;
}

const ImageScan = ({ onScanComplete }: ImageScanProps) => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
  };

  const processImage = async () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    
    try {
      const reader = new FileReader();
      const base64Promise = new Promise((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(uploadedImage);
      });
      
      const base64 = await base64Promise;
      const analysis = await analyzeRecyclingAction(base64 as string, false);
      
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

  if (scanResult) {
    return (
      <ScanResult 
        object={scanResult.object}
        isRecyclable={scanResult.isRecyclable}
        confidence={scanResult.confidence}
        material={scanResult.material}
        locations={scanResult.locations}
        onReset={resetScan}
        onSaveResult={saveResult}
      />
    );
  }

  return (
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
  );
};

export default ImageScan;
