import { useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";

export const AppearanceSection = ({ initialValue = 'light' }: { initialValue?: 'light' | 'dark' }) => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    // Only update if there's no active theme (first load) or if initialValue exists and differs
    if (initialValue && (!theme || theme !== initialValue)) {
      setTheme(initialValue);
    }
  }, [initialValue, setTheme]);

  const handleThemeChange = async (value: 'light' | 'dark') => {
    // First set theme locally
    setTheme(value);
    
    // TODO: Implement theme persistence using localStorage or a future API
    console.log(`Theme changed to ${value}, persistence mechanism needed.`);
    
    toast({
      title: "Theme updated",
      description: `Theme set to ${value}`
    });
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
    </RadioGroup>
  );
};
