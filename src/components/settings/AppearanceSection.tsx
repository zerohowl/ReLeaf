
import { useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";

export const AppearanceSection = ({ initialValue = 'light' }: { initialValue?: string }) => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  // Only set the theme from initialValue when the component first mounts,
  // not on every re-render or when navigating back to this page
  useEffect(() => {
    // Only update if there's no active theme (first load) or if initialValue exists and differs
    if (initialValue && (!theme || (theme !== initialValue && initialValue !== 'system'))) {
      setTheme(initialValue as "light" | "dark" | "system");
    }
  }, [initialValue, setTheme]);

  const handleThemeChange = async (value: string) => {
    // First set theme locally - this should work regardless of login status
    setTheme(value as "light" | "dark" | "system");
    
    try {
      // Then attempt to save to user settings if logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // User is logged in, update their settings in the database
        const { error } = await supabase
          .from('user_settings')
          .update({ theme: value })
          .eq('user_id', user.id);

        if (error) throw error;
        
        toast({
          title: "Theme updated",
          description: `Theme set to ${value}`
        });
      } else {
        // Just show a toast notification without the error
        toast({
          title: "Theme updated",
          description: `Theme set to ${value} (local only)`
        });
      }
    } catch (error) {
      console.error("Theme update error:", error);
      // Don't show an error toast since the theme was already changed locally
    }
  };

  return (
    <RadioGroup value={theme} onValueChange={handleThemeChange}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="light" id="light" />
        <Label htmlFor="light">Light</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="dark" id="dark" />
        <Label htmlFor="dark">Dark</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="system" id="system" />
        <Label htmlFor="system">System</Label>
      </div>
    </RadioGroup>
  );
};
