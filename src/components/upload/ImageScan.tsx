import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import UploadZone from './UploadZone';
import ScanResult from './ScanResult';
import { analyzeRecyclingAction } from '@/integrations/gemini/image-video-analyzer';
import jsQR from 'jsqr';

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
      // Attempt QR code detection from uploaded image
      const imgEl = new Image();
      await new Promise((resolve) => {
        imgEl.onload = resolve;
        imgEl.src = base64 as string;
      });
      const canvas = document.createElement('canvas');
      canvas.width = imgEl.width;
      canvas.height = imgEl.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(imgEl, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code) {
          setScanResult({ qrData: code.data });
          toast({ title: 'QR Code Detected', description: code.data });
          setIsProcessing(false);
          return;
        }
      }
      const analysis = await analyzeRecyclingAction(base64 as string, false);
      
      if (!analysis.isCorrect) {
        toast({
          title: "Invalid Image",
          description: analysis.explanation || "Please upload an image of a recyclable or non-recyclable item.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      const result = {
        object: analysis.objectType || 'Unknown Item',
        isRecyclable: analysis.isRecyclable || false,
        confidence: analysis.confidence * 100,
        material: 'Analyzing...',
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

      toast({
        title: analysis.isRecyclable ? "Recyclable Item!" : "Non-Recyclable Item",
        description: analysis.explanation || (analysis.isRecyclable ? 
          "This item can be recycled. Check the locations below." : 
          "This item should go in the regular trash."),
        variant: analysis.isRecyclable ? "default" : "destructive",
      });

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

  if (scanResult && 'qrData' in scanResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>QR Code Result</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="break-all text-muted-foreground">{scanResult.qrData}</p>
          <div className="flex space-x-2">
            <Button onClick={saveResult}>Save</Button>
            <Button variant="outline" onClick={resetScan}>Reset</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          Upload a photo of an item you want to check for recyclability. For most accurate results, include a QR code in your image. Otherwise, AI prediction will be used.
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
