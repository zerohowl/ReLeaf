import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { uploadFile } from '@/services/uploadService';
import { Loader2 } from 'lucide-react';

interface UploadFormProps {
  onSuccess?: () => void;
}

const UploadForm = ({ onSuccess }: UploadFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Clear previous preview
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      // Determine file type and create preview
      if (selectedFile.type.startsWith('image/')) {
        setFileType('image');
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else if (selectedFile.type.startsWith('video/')) {
        setFileType('video');
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        setFileType(null);
        setPreviewUrl(null);
        toast.error('Please select an image or video file');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File is too large. Maximum file size is 50MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast.error('Only image and video files are allowed');
      return;
    }
    
    try {
      setIsUploading(true);
      await uploadFile(file, description);
      
      toast.success('File uploaded successfully!');
      
      // Reset form
      setFile(null);
      setDescription('');
      setFileType(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      console.error('Upload error:', error);
      let errorMessage = 'Failed to upload file';
      
      if (error.message.includes('Authentication')) {
        errorMessage = 'You need to log in to upload files';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error - please check your internet connection';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upload Media</CardTitle>
        <CardDescription>Upload images or videos of recyclable items.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Select Image or Video</Label>
              <Input 
                id="file" 
                type="file" 
                accept="image/*,video/*" 
                onChange={handleFileChange} 
                disabled={isUploading}
              />
            </div>
            
            {previewUrl && (
              <div className="mt-4 border rounded-md overflow-hidden aspect-video bg-muted flex items-center justify-center">
                {fileType === 'image' ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-h-full max-w-full object-contain" 
                  />
                ) : fileType === 'video' ? (
                  <video 
                    src={previewUrl} 
                    controls 
                    className="max-h-full max-w-full" 
                  />
                ) : null}
              </div>
            )}
            
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea 
                id="description" 
                placeholder="What is this item? Is it recyclable?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isUploading}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setFile(null);
              setDescription('');
              if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
              }
            }}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : 'Upload'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default UploadForm;
