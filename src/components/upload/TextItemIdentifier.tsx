
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { analyzeItemText } from '@/integrations/gemini/text-analyzer';
import { Loader2, Search, AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TextItemIdentifierProps {
  onItemIdentified?: (result: any) => void;
}

const TextItemIdentifier = ({ onItemIdentified }: TextItemIdentifierProps) => {
  const [itemDescription, setItemDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  
  useEffect(() => {
    // Check API key on component mount
    const hasApiKey = !!import.meta.env.VITE_GEMINI_API_KEY;
    setApiKeyMissing(!hasApiKey);
    
    if (!hasApiKey) {
      console.log('TextItemIdentifier: API key is missing');
    }
  }, []);

  const handleAnalyze = async () => {
    if (!itemDescription.trim()) {
      toast({
        title: "Description required",
        description: "Please describe the item you want to identify",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const analysisResult = await analyzeItemText(itemDescription);
      setResult(analysisResult);
      
      if (analysisResult.disposalInstructions.includes('API key required')) {
        setApiKeyMissing(true);
        toast({
          title: "API Key Missing",
          description: "Please add the Gemini API key to your environment variables",
          variant: "destructive"
        });
      }
      
      if (onItemIdentified) {
        onItemIdentified(analysisResult);
      }
    } catch (error) {
      console.error('Error analyzing item:', error);
      toast({
        title: "Analysis failed",
        description: "Unable to analyze your item. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {apiKeyMissing && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Gemini API key is missing. Add VITE_GEMINI_API_KEY to your environment variables to enable item analysis.
            <div className="mt-2 text-sm">
              <strong>Note:</strong> After adding the API key, you may need to restart the application for changes to take effect.
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="item-description">Describe the item</Label>
        <Textarea
          id="item-description"
          placeholder="Describe the item you want to identify (e.g. 'plastic water bottle with a blue cap')"
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <Button 
        onClick={handleAnalyze} 
        disabled={isAnalyzing || !itemDescription.trim()}
        className="w-full"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Identify Item
          </>
        )}
      </Button>

      {result && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">Item Identified</h3>
                <p className="text-lg font-bold">{result.itemName}</p>
              </div>
              
              <div>
                <h3 className="font-medium">Recyclability</h3>
                <div className={`text-sm px-3 py-1 rounded-full inline-block mt-1 ${
                  result.isRecyclable ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {result.isRecyclable ? 'Recyclable' : 'Not Recyclable'}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium">Material</h3>
                <p>{result.material}</p>
              </div>
              
              <div>
                <h3 className="font-medium">Disposal Instructions</h3>
                <p>{result.disposalInstructions}</p>
              </div>
              
              {result.additionalTips && (
                <div>
                  <h3 className="font-medium">Eco-friendly Tips</h3>
                  <p>{result.additionalTips}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TextItemIdentifier;
