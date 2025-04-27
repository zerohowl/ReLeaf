
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getSettings, updatePrivacy } from "@/services/settingsService";

export const PrivacySection = ({ initialValue = true }: { initialValue?: boolean }) => {
  const [isPublic, setIsPublic] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch current settings when component mounts
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSettings();
        setIsPublic(settings.public_profile);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    
    fetchSettings();
  }, []);

  const handleToggle = async (checked: boolean) => {
    try {
      setIsLoading(true);
      setIsPublic(checked); // Optimistic update
      
      // Use our custom API service instead of Supabase
      await updatePrivacy(checked);
      
      toast({
        title: "Settings updated",
        description: `Profile visibility set to ${checked ? 'public' : 'private'}`
      });
    } catch (error) {
      console.error("Privacy update error:", error);
      setIsPublic(!checked); // Revert on error
      toast({
        title: "Error",
        description: "Failed to update privacy settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Switch
          checked={isPublic}
          onCheckedChange={handleToggle}
          disabled={isLoading}
          className="data-[state=checked]:bg-eco-green"
        />
        <Label>
          {isLoading ? 'Updating...' : 'Show my profile on the leaderboard'}
        </Label>
      </div>
      
      <div className={`rounded-md px-4 py-3 text-sm transition-all duration-300 ${isPublic ? 'bg-eco-green/10 text-eco-green border border-eco-green/20' : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}`}>
        <p>
          {isPublic 
            ? '✓ Your profile is visible on the leaderboard'
            : '🔒 Your profile is hidden from the leaderboard'}
        </p>
      </div>
    </div>
  );
};
