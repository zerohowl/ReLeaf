
import { useState, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  type: 'image' | 'video';
  className?: string;
}

const UploadZone = ({ onFileSelected, type, className }: UploadZoneProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Accept images or videos based on type prop
  const acceptMap = {
    image: 'image/*',
    video: 'video/*'
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    // Check if the file is of the correct type
    if (!file.type.includes(type)) {
      toast({
        variant: "destructive",
        title: `Invalid file type`,
        description: `Please select a ${type} file.`
      });
      return;
    }

    // Create a preview URL and set it
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    
    // Pass the file to the parent component
    onFileSelected(file);
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const clearFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={`${className || ''}`}>
      {!preview ? (
        <div
          className={`upload-zone ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50'
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <input
            ref={inputRef}
            type="file"
            accept={acceptMap[type]}
            onChange={handleChange}
            className="hidden"
          />
          {/* Upload icon removed */}
          <p className="text-center text-muted-foreground font-medium">
            <span className="text-primary">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {type === 'image' 
              ? 'PNG, JPG or JPEG (max. 10MB)' 
              : 'MP4, WEBM or MOV (max. 50MB)'}
          </p>
        </div>
      ) : (
        <div className="relative">
          {type === 'image' ? (
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-64 object-cover rounded-md" 
            />
          ) : (
            <video 
              src={preview} 
              controls 
              className="w-full h-64 object-cover rounded-md"
            />
          )}
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={clearFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
