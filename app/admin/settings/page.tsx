"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const handleSave = (section: string) => {
    toast.success(`${section} settings saved successfully.`);
  };

  return (
    <div className="space-y-6 w-full mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Admin Settings</h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
          Configure platform-wide settings, access controls, and preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Platform Configuration</CardTitle>
              <CardDescription>
                Manage basic settings for the logistics platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input id="platformName" defaultValue="Move All Logistics" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input id="supportEmail" defaultValue="support@moveall.com" type="email" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultCurrency">Default Currency</Label>
                <Input id="defaultCurrency" defaultValue="INR (₹)" />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-end">
              <Button onClick={() => handleSave("General")}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure access controls and authentication requirements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="space-y-1">
                  <Label className="text-base">Two-Factor Authentication (2FA)</Label>
                  <p className="text-sm text-muted-foreground">
                    Require all admin users to enable 2FA for their accounts.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-4">
                <div className="space-y-1">
                  <Label className="text-base">Session Timeout</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically log out inactive users after 30 minutes.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-end">
              <Button onClick={() => handleSave("Security")}>Update Security</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what events trigger system-wide alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="space-y-1">
                  <Label className="text-base">New Tenant Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive an alert when a new client signs up.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-4">
                <div className="space-y-1">
                  <Label className="text-base">Critical System Errors</Label>
                  <p className="text-sm text-muted-foreground">
                    Get immediately notified for API or courier downtime.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-4">
                <div className="space-y-1">
                  <Label className="text-base">High Volume Escalations</Label>
                  <p className="text-sm text-muted-foreground">
                    Alert when pending escalations exceed 100.
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-end">
              <Button onClick={() => handleSave("Notification")}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
