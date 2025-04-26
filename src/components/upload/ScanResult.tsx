
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Trash, Recycle, CheckCircle, XCircle } from 'lucide-react';

interface RecyclingLocation {
  name: string;
  address: string;
  distance: string;
}

interface ScanResultProps {
  object: string;
  isRecyclable: boolean;
  confidence: number;
  material: string;
  locations?: RecyclingLocation[];
  onReset: () => void;
  onSaveResult: () => void;
}

const ScanResult = ({ 
  object, 
  isRecyclable, 
  confidence, 
  material, 
  locations = [], 
  onReset,
  onSaveResult
}: ScanResultProps) => {
  return (
    <Card className="w-full animate-bounce-in">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Scan Result</CardTitle>
          <Button variant="outline" size="sm" onClick={onReset}>
            Scan Again
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Object Identified</h3>
            <Badge variant="outline">{confidence}% confident</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">{object}</span>
          </div>
          <div>
            <span className="text-muted-foreground text-sm">Material: {material}</span>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-semibold">Recyclability</h3>
          <div className={`flex items-center space-x-3 p-3 rounded-md ${
            isRecyclable ? 'bg-eco-green/10' : 'bg-destructive/10'
          }`}>
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              isRecyclable ? 'bg-eco-green' : 'bg-destructive'
            }`}>
              {isRecyclable ? (
                <Recycle className="h-5 w-5 text-white" />
              ) : (
                <Trash className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <div className="font-medium">
                {isRecyclable ? 'Recyclable' : 'Not Recyclable'}
              </div>
              <div className="text-sm text-muted-foreground">
                {isRecyclable 
                  ? 'This item can be recycled.' 
                  : 'This item should go in regular trash.'}
              </div>
            </div>
          </div>
        </div>

        {isRecyclable && locations.length > 0 && (
          <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-semibold">Where to Recycle</h3>
            <div className="space-y-2">
              {locations.map((location, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 rounded-md bg-muted">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">{location.name}</div>
                    <div className="text-sm text-muted-foreground">{location.address}</div>
                    <div className="text-xs text-muted-foreground">{location.distance} away</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button className="w-full" onClick={onSaveResult}>
          Save Result
        </Button>
      </CardContent>
    </Card>
  );
};

export default ScanResult;
