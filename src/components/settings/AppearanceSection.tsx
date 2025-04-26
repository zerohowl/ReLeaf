
import { useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";

export const AppearanceSection = ({ initialValue = 'light' }: { initialValue?: string }) => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    if (initialValue) {
      setTheme(initialValue as "light" | "dark" | "system");
    }
  }, [initialValue, setTheme]);

  const handleThemeChange = async (value: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to update settings",
          variant: "destructive"
        });
        return;
      }

      setTheme(value as "light" | "dark" | "system");
      
      const { error } = await supabase
        .from('user_settings')
        .update({ theme: value })
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast({
        title: "Theme updated",
        description: `Theme set to ${value}`
      });
    } catch (error) {
      console.error("Theme update error:", error);
      toast({
        title: "Error",
        description: "Failed to update theme",
        variant: "destructive"
      });
    }
  };

  return (
    <RadioGroup defaultValue={theme} onValueChange={handleThemeChange}>
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
