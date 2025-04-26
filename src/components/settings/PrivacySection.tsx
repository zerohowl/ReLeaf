
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const PrivacySection = ({ initialValue = true }: { initialValue?: boolean }) => {
  const [isPublic, setIsPublic] = useState(initialValue);
  const { toast } = useToast();

  const handleToggle = async (checked: boolean) => {
    try {
      const { error } = await supabase
        .from('user_settings')
        .update({ public_profile: checked })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      setIsPublic(checked);
      toast({
        title: "Settings updated",
        description: `Profile visibility set to ${checked ? 'public' : 'private'}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update privacy settings",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={isPublic}
        onCheckedChange={handleToggle}
        id="public-profile"
      />
      <Label htmlFor="public-profile">Make profile public</Label>
    </div>
  );
};
