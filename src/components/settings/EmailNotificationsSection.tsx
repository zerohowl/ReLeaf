
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const EmailNotificationsSection = ({ initialValue = true }: { initialValue?: boolean }) => {
  const [enabled, setEnabled] = useState(initialValue);
  const { toast } = useToast();

  const handleToggle = async (checked: boolean) => {
    try {
      const { error } = await supabase
        .from('user_settings')
        .update({ email_notifications: checked })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      setEnabled(checked);
      toast({
        title: "Settings updated",
        description: `Email notifications ${checked ? 'enabled' : 'disabled'}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={enabled}
        onCheckedChange={handleToggle}
        id="email-notifications"
      />
      <Label htmlFor="email-notifications">Receive email notifications</Label>
    </div>
  );
};
