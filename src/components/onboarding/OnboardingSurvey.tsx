import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { analyzeItemText } from '@/integrations/gemini/text-analyzer';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface OnboardingSurveyProps {
  onComplete: (data: Record<string, any>) => void;
  initialData?: Record<string, any>;
}

const OnboardingSurvey = ({ onComplete, initialData }: OnboardingSurveyProps) => {
  // Basic recycling preferences
  const [recyclingExperience, setRecyclingExperience] = useState(
    initialData?.recyclingExperience || 'beginner'
  );
  const [recyclingGoals, setRecyclingGoals] = useState<string[]>(
    initialData?.recyclingGoals || []
  );
  const [homeType, setHomeType] = useState(
    initialData?.homeType || ''
  );
  
  // New sustainability data
  const [homeTemperature, setHomeTemperature] = useState(
    initialData?.homeTemperature || '68-72'
  );
  const [stoveType, setStoveType] = useState(
    initialData?.stoveType || ''
  );
  const [hasVehicle, setHasVehicle] = useState(
    initialData?.hasVehicle !== undefined ? initialData.hasVehicle : true
  );
  const [vehicleType, setVehicleType] = useState(
    initialData?.vehicleType || ''
  );
  const [vehicleMake, setVehicleMake] = useState(
    initialData?.vehicleMake || ''
  );
  const [vehicleModel, setVehicleModel] = useState(
    initialData?.vehicleModel || ''
  );
  const [packageFrequency, setPackageFrequency] = useState(
    initialData?.packageFrequency || ''
  );
  
  // Tab navigation
  const [activeTab, setActiveTab] = useState('basic');

  const [showCustomHomeType, setShowCustomHomeType] = useState(false);
  const [customHomeType, setCustomHomeType] = useState('');
  const [isAnalyzingHome, setIsAnalyzingHome] = useState(false);
  const [analyzedHomeType, setAnalyzedHomeType] = useState('');
  
  const [showCustomVehicle, setShowCustomVehicle] = useState(false);
  const [customVehicle, setCustomVehicle] = useState('');
  const [isAnalyzingVehicle, setIsAnalyzingVehicle] = useState(false);
  const [analyzedVehicleInfo, setAnalyzedVehicleInfo] = useState<{type: string, make: string, model: string} | null>(null);

  const { toast } = useToast();

  const handleGoalsChange = (goal: string) => {
    if (recyclingGoals.includes(goal)) {
      setRecyclingGoals(recyclingGoals.filter(g => g !== goal));
    } else {
      setRecyclingGoals([...recyclingGoals, goal]);
    }
  };

  const handleSubmit = () => {
    const surveyData = {
      // Basic recycling data
      recyclingExperience,
      recyclingGoals,
      homeType,
      
      // Sustainability data
      homeTemperature,
      stoveType,
      hasVehicle,
      vehicleType: hasVehicle ? vehicleType : 'none',
      vehicleMake: hasVehicle ? vehicleMake : '',
      vehicleModel: hasVehicle ? vehicleModel : '',
      packageFrequency,
    };
    
    onComplete(surveyData);
  };

  const analyzeHomeDescription = async () => {
    if (!customHomeType.trim()) return;
    
    setIsAnalyzingHome(true);
    try {
      const result = await analyzeItemText(customHomeType);
      setAnalyzedHomeType(result.itemName);
      setHomeType(result.itemName.toLowerCase());
      toast({
        title: "Home type analyzed",
        description: "Your description has been processed"
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Could not analyze your home description",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzingHome(false);
    }
  };

  const analyzeVehicleDescription = async () => {
    if (!customVehicle.trim()) return;
    
    setIsAnalyzingVehicle(true);
    try {
      const result = await analyzeItemText(customVehicle);
      const vehicleInfo = {
        type: result.material || 'unknown',
        make: result.itemName.split(' ')[0] || '',
        model: result.itemName.split(' ').slice(1).join(' ') || ''
      };
      
      setAnalyzedVehicleInfo(vehicleInfo);
      setVehicleType(vehicleInfo.type.toLowerCase());
      setVehicleMake(vehicleInfo.make);
      setVehicleModel(vehicleInfo.model);
      
      toast({
        title: "Vehicle analyzed",
        description: "Your description has been processed"
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Could not analyze your vehicle description",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzingVehicle(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-6 pt-4">
          <div className="space-y-4">
            <h3 className="font-medium text-lg">How experienced are you with recycling?</h3>
            <RadioGroup 
              value={recyclingExperience} 
              onValueChange={setRecyclingExperience}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner">Beginner - Just getting started</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate">Intermediate - I recycle regularly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced">Advanced - I'm a recycling pro</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">What are your recycling goals? (Select all that apply)</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="reduce-waste" 
                  checked={recyclingGoals.includes('reduce-waste')}
                  onCheckedChange={() => handleGoalsChange('reduce-waste')}
                />
                <Label htmlFor="reduce-waste">Reduce my household waste</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="learn-recycling" 
                  checked={recyclingGoals.includes('learn-recycling')}
                  onCheckedChange={() => handleGoalsChange('learn-recycling')}
                />
                <Label htmlFor="learn-recycling">Learn more about recycling</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="save-environment" 
                  checked={recyclingGoals.includes('save-environment')}
                  onCheckedChange={() => handleGoalsChange('save-environment')}
                />
                <Label htmlFor="save-environment">Help save the environment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="build-habit" 
                  checked={recyclingGoals.includes('build-habit')}
                  onCheckedChange={() => handleGoalsChange('build-habit')}
                />
                <Label htmlFor="build-habit">Build a daily recycling habit</Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">What type of home do you live in?</h3>
            {!showCustomHomeType ? (
              <>
                <Select value={homeType} onValueChange={setHomeType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select home type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCustomHomeType(true)}
                  className="mt-2"
                >
                  Or describe your home
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <Textarea
                  placeholder="Describe your home (e.g., 'A modern two-story townhouse with a small garden')"
                  value={customHomeType}
                  onChange={(e) => setCustomHomeType(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={analyzeHomeDescription}
                    disabled={isAnalyzingHome || !customHomeType.trim()}
                  >
                    {isAnalyzingHome ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : "Analyze Description"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowCustomHomeType(false);
                      setCustomHomeType('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
                {analyzedHomeType && (
                  <p className="text-sm text-muted-foreground">
                    Analyzed as: {analyzedHomeType}
                  </p>
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-end pt-4">
            <Button onClick={() => setActiveTab('sustainability')}>Next</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="sustainability" className="space-y-6 pt-4">
          <div className="space-y-4">
            <h3 className="font-medium text-lg">What temperature do you typically keep your home at?</h3>
            <RadioGroup 
              value={homeTemperature} 
              onValueChange={setHomeTemperature}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="below-65" id="below-65" />
                <Label htmlFor="below-65">Below 65°F (18°C)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="65-68" id="65-68" />
                <Label htmlFor="65-68">65-68°F (18-20°C)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="68-72" id="68-72" />
                <Label htmlFor="68-72">68-72°F (20-22°C)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="72-78" id="72-78" />
                <Label htmlFor="72-78">72-78°F (22-26°C)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="above-78" id="above-78" />
                <Label htmlFor="above-78">Above 78°F (26°C)</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-lg">What type of stove do you use?</h3>
            <Select value={stoveType} onValueChange={setStoveType}>
              <SelectTrigger>
                <SelectValue placeholder="Select stove type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="gas">Gas</SelectItem>
                <SelectItem value="induction">Induction</SelectItem>
                <SelectItem value="none">None/Don't use a stove</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="has-vehicle" 
                checked={hasVehicle}
                onCheckedChange={(checked) => setHasVehicle(!!checked)}
              />
              <Label htmlFor="has-vehicle">I own or regularly use a vehicle</Label>
            </div>
            
            {hasVehicle && (
              <div className="space-y-4 pl-6 pt-2">
                {!showCustomVehicle ? (
                  <>
                    <div>
                      <Label htmlFor="vehicle-type">Vehicle Type</Label>
                      <Select value={vehicleType} onValueChange={setVehicleType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gasoline">Gasoline</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                          <SelectItem value="plugin-hybrid">Plug-in Hybrid</SelectItem>
                          <SelectItem value="electric">Electric</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vehicle-make">Make</Label>
                        <Input 
                          id="vehicle-make" 
                          value={vehicleMake} 
                          onChange={(e) => setVehicleMake(e.target.value)}
                          placeholder="e.g. Toyota, Tesla"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vehicle-model">Model</Label>
                        <Input 
                          id="vehicle-model" 
                          value={vehicleModel} 
                          onChange={(e) => setVehicleModel(e.target.value)}
                          placeholder="e.g. Prius, Model 3"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Describe your vehicle (e.g., 'A 2020 Tesla Model 3 electric car')"
                      value={customVehicle}
                      onChange={(e) => setCustomVehicle(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={analyzeVehicleDescription}
                        disabled={isAnalyzingVehicle || !customVehicle.trim()}
                      >
                        {isAnalyzingVehicle ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : "Analyze Description"}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowCustomVehicle(false);
                          setCustomVehicle('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                    {analyzedVehicleInfo && (
                      <p className="text-sm text-muted-foreground">
                        Analyzed as: {analyzedVehicleInfo.make} {analyzedVehicleInfo.model} ({analyzedVehicleInfo.type})
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-lg">How often do you receive packages?</h3>
            <Select value={packageFrequency} onValueChange={setPackageFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Almost daily</SelectItem>
                <SelectItem value="weekly">A few times per week</SelectItem>
                <SelectItem value="monthly">A few times per month</SelectItem>
                <SelectItem value="rarely">Rarely</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setActiveTab('basic')}>Back</Button>
            <Button onClick={handleSubmit}>Complete Survey</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OnboardingSurvey;
