import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export const EmailNotificationsSection = ({ initialValue = true }: { initialValue?: boolean }) => {
  const [enabled, setEnabled] = useState(initialValue);
  const { toast } = useToast();

  const handleToggle = async (checked: boolean) => {
    console.log(`Email notifications changed to ${checked}. Backend update needed.`);
    setEnabled(checked);
    toast({
      title: "Settings updated",
      description: `Email notifications ${checked ? 'enabled' : 'disabled'}`
    });
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
