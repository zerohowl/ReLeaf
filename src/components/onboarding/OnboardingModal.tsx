
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import OnboardingSurvey from './OnboardingSurvey';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingModal = ({ isOpen, onClose }: OnboardingModalProps) => {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const totalSteps = 1;

  const handleComplete = (surveyData: Record<string, any>) => {
    // Save survey data to localStorage
    localStorage.setItem('onboarding_survey_data', JSON.stringify(surveyData));
    localStorage.setItem('onboarding_completed', 'true');
    
    // Show success toast
    toast({
      title: 'Onboarding complete',
      description: 'Your preferences have been saved',
    });
    
    // Close modal
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Welcome to Releaf</DialogTitle>
        </DialogHeader>
        
        {step === 1 && (
          <OnboardingSurvey onComplete={handleComplete} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
