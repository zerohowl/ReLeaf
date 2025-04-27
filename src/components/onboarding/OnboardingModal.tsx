import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import OnboardingSurvey from './OnboardingSurvey';
import { saveSurvey, getSurvey, SurveyData } from "@/services/surveyService";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingModal = ({ isOpen, onClose }: OnboardingModalProps) => {
  const [step, setStep] = useState(1);
  const [initialData, setInitialData] = useState<SurveyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const totalSteps = 1;

  // Fetch existing survey data if available
  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        setIsLoading(true);
        const data = await getSurvey();
        setInitialData(data);
      } catch (error) {
        console.error('Error fetching survey data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchSurveyData();
    }
  }, [isOpen]);

  const handleComplete = async (surveyData: SurveyData) => {
    try {
      // Save to backend database
      await saveSurvey(surveyData);
      
      // Also save to localStorage for client-side checks
      localStorage.setItem('onboarding_survey_data', JSON.stringify(surveyData));
      localStorage.setItem('onboarding_completed', 'true');
      
      // Show success toast
      toast({
        title: 'Onboarding complete',
        description: 'Your preferences have been saved to your account',
      });
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error saving survey:', error);
      toast({
        variant: 'destructive',
        title: 'Error saving preferences',
        description: 'Please try again',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Welcome to Releaf</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-eco-green border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your preferences...</p>
          </div>
        ) : step === 1 && (
          <OnboardingSurvey onComplete={handleComplete} initialData={initialData} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
