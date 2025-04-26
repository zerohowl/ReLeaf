
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailNotificationsSection } from "@/components/settings/EmailNotificationsSection";
import { PrivacySection } from "@/components/settings/PrivacySection";
import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { DeleteAccountSection } from "@/components/settings/DeleteAccountSection";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const [settings, setSettings] = useState({
    email_notifications: true,
    public_profile: true,
    theme: 'light'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data) {
          setSettings(data);
        }
      }
    };

    fetchSettings();
  }, []);

  return (
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
              <AppearanceSection initialValue={settings.theme} />
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
    </AppLayout>
  );
};

export default Settings;
