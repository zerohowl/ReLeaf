
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OnboardingSurveyProps {
  onComplete: (data: Record<string, any>) => void;
  initialData?: Record<string, any>;
}

const OnboardingSurvey = ({ onComplete, initialData }: OnboardingSurveyProps) => {
  const [recyclingExperience, setRecyclingExperience] = useState(
    initialData?.recyclingExperience || 'beginner'
  );
  const [recyclingGoals, setRecyclingGoals] = useState<string[]>(
    initialData?.recyclingGoals || []
  );
  const [homeType, setHomeType] = useState(
    initialData?.homeType || ''
  );

  const handleGoalsChange = (goal: string) => {
    if (recyclingGoals.includes(goal)) {
      setRecyclingGoals(recyclingGoals.filter(g => g !== goal));
    } else {
      setRecyclingGoals([...recyclingGoals, goal]);
    }
  };

  const handleSubmit = () => {
    const surveyData = {
      recyclingExperience,
      recyclingGoals,
      homeType
    };
    
    onComplete(surveyData);
  };

  return (
    <div className="space-y-6 py-4">
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
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSubmit}>
          Complete Survey
        </Button>
      </div>
    </div>
  );
};

export default OnboardingSurvey;
