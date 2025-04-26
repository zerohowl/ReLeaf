
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const AppearanceSection = ({ initialValue = 'light' }: { initialValue?: string }) => {
  const { toast } = useToast();

  const handleThemeChange = async (value: string) => {
    try {
      const { error } = await supabase
        .from('user_settings')
        .update({ theme: value })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      toast({
        title: "Theme updated",
        description: `Theme set to ${value}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update theme",
        variant: "destructive"
      });
    }
  };

  return (
    <RadioGroup defaultValue={initialValue} onValueChange={handleThemeChange}>
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
