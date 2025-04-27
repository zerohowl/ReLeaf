import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import PageTransition from "@/components/PageTransition";
import BackgroundImage from "@/components/BackgroundImage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailNotificationsSection } from "@/components/settings/EmailNotificationsSection";
import { PrivacySection } from "@/components/settings/PrivacySection";
import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { DeleteAccountSection } from "@/components/settings/DeleteAccountSection";
import { resetUserData, getSettings } from "@/services/settingsService";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import OnboardingModal from "@/components/onboarding/OnboardingModal";
import { useTheme } from "@/contexts/ThemeContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const [settings, setSettings] = useState({
    email_notifications: true,
    public_profile: true,
    theme: 'light'
  });
  const { theme } = useTheme();
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Use our custom settings service instead of Supabase
        const userSettings = await getSettings();
        
        setSettings(prev => ({
          ...prev,
          public_profile: userSettings.public_profile
        }));
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast({
          title: "Failed to load settings",
          description: "Your settings could not be loaded.",
          variant: "destructive"
        });
      }
    };

    fetchSettings();
  }, [toast]);

  const handleResetData = async () => {
    try {
      // Show loading toast
      toast({
        title: "Resetting data...",
        description: "Please wait while we reset your data",
      });
      
      // Call the backend API to reset user data
      await resetUserData();
      
      // Clear local storage items
      localStorage.removeItem('onboarding_completed');
      localStorage.removeItem('onboarding_survey_data');
      
      toast({
        title: "Data reset complete",
        description: "All your app data has been reset. Refreshing page...",
      });
      
      // Wait a moment then reload the page
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error resetting data:', error);
      toast({
        title: "Reset failed",
        description: "Failed to reset your data. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <PageTransition>
      <BackgroundImage>
        <AppLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account settings and preferences.
              </p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>
                    Manage your email notification preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EmailNotificationsSection initialValue={settings.email_notifications} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Privacy</CardTitle>
                  <CardDescription>
                    Control your profile visibility and privacy settings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PrivacySection initialValue={settings.public_profile} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize how the application looks.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AppearanceSection initialValue={theme} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Onboarding</CardTitle>
                  <CardDescription>
                    Retake the onboarding survey to update your preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setShowOnboardingModal(true)}>
                    Retake Onboarding Survey
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reset Data</CardTitle>
                  <CardDescription>
                    Reset all your app data without deleting your account.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Reset All Data</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will reset all your app data including scan history, 
                          streaks, and preferences. Your account will not be deleted,
                          but you'll start fresh as if you just signed up.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetData}>
                          Reset All Data
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                  <CardDescription>
                    Permanently delete your account and all associated data.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DeleteAccountSection />
                </CardContent>
              </Card>
            </div>
          </div>
          
          <OnboardingModal 
            isOpen={showOnboardingModal} 
            onClose={() => setShowOnboardingModal(false)} 
          />
        </AppLayout>
      </BackgroundImage>
    </PageTransition>
  );
};

export default Settings;
