import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Settings as SettingsIcon, 
  Menu, 
  ArrowLeft, 
  Clock, 
  Mail, 
  RefreshCw,
  Save,
  Bell,
  BellOff
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

function Settings() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState({
    // Codeforces Sync Settings
    syncEnabled: true,
    syncTime: "02:00",
    syncFrequency: "daily",
    autoRefreshOnHandleChange: true,
    
    // Email Reminder Settings
    emailRemindersEnabled: true,
    inactivityThreshold: "7",
    reminderFrequency: "daily",
    reminderTime: "09:00",
    
    // General Settings
    darkMode: false,
    notificationsEnabled: true
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log("Saving settings:", settings);
    // Save settings to backend
    alert("Settings saved successfully!");
  };

  const handleManualSync = () => {
    console.log("Triggering manual sync");
    // Trigger manual Codeforces sync
    alert("Manual sync initiated!");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Settings</h1>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
            <p className="text-gray-600">Configure Codeforces sync and email reminder settings</p>
          </div>

          <div className="space-y-6">
            {/* Codeforces Sync Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                  Codeforces Data Sync
                </CardTitle>
                <CardDescription>
                  Configure automatic synchronization of Codeforces data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Automatic Sync</Label>
                    <p className="text-sm text-gray-500">
                      Automatically fetch updated Codeforces data
                    </p>
                  </div>
                  <Switch
                    checked={settings.syncEnabled}
                    onCheckedChange={(checked) => handleSettingChange('syncEnabled', checked)}
                  />
                </div>

                {settings.syncEnabled && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="syncTime">Sync Time</Label>
                        <Input
                          id="syncTime"
                          type="time"
                          value={settings.syncTime}
                          onChange={(e) => handleSettingChange('syncTime', e.target.value)}
                        />
                        <p className="text-xs text-gray-500">
                          Time when daily sync should run (24-hour format)
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="syncFrequency">Sync Frequency</Label>
                        <Select value={settings.syncFrequency} onValueChange={(value) => handleSettingChange('syncFrequency', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-refresh on Handle Change</Label>
                        <p className="text-sm text-gray-500">
                          Immediately fetch data when Codeforces handle is updated
                        </p>
                      </div>
                      <Switch
                        checked={settings.autoRefreshOnHandleChange}
                        onCheckedChange={(checked) => handleSettingChange('autoRefreshOnHandleChange', checked)}
                      />
                    </div>

                    <div className="pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={handleManualSync}
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Trigger Manual Sync Now
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        Last sync: {new Date().toLocaleString()}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Email Reminder Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-green-600" />
                  Email Reminder Settings
                </CardTitle>
                <CardDescription>
                  Configure automatic email reminders for inactive students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Email Reminders</Label>
                    <p className="text-sm text-gray-500">
                      Send automatic emails to inactive students
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailRemindersEnabled}
                    onCheckedChange={(checked) => handleSettingChange('emailRemindersEnabled', checked)}
                  />
                </div>

                {settings.emailRemindersEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="inactivityThreshold">Inactivity Threshold (days)</Label>
                      <Select value={settings.inactivityThreshold} onValueChange={(value) => handleSettingChange('inactivityThreshold', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 days</SelectItem>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reminderFrequency">Reminder Frequency</Label>
                      <Select value={settings.reminderFrequency} onValueChange={(value) => handleSettingChange('reminderFrequency', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reminderTime">Reminder Time</Label>
                      <Input
                        id="reminderTime"
                        type="time"
                        value={settings.reminderTime}
                        onChange={(e) => handleSettingChange('reminderTime', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5 text-purple-600" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Configure general application preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-gray-500">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Receive browser notifications for updates
                    </p>
                  </div>
                  <Switch
                    checked={settings.notificationsEnabled}
                    onCheckedChange={(checked) => handleSettingChange('notificationsEnabled', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSaveSettings}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings; 