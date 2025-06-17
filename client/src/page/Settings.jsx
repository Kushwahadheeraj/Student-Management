import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Save, 
  Settings as SettingsIcon, 
  Menu,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Mail,
  Bell,
  Clock,
  Database,
  Shield,
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

function Settings() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState({
    // Codeforces Sync Settings
    autoSyncEnabled: true,
    syncInterval: "6",
    lastSyncTime: "2024-01-20T10:30:00Z",
    syncOnStartup: true,
    
    // Email Reminder Settings
    emailRemindersEnabled: true,
    reminderFrequency: "7",
    reminderTime: "09:00",
    reminderDays: ["monday", "wednesday", "friday"],
    inactivityThreshold: "7",
    
    // System Settings
    maxStudentsPerPage: "50",
    enableNotifications: true,
    dataRetentionDays: "365",
    backupEnabled: true,
    backupFrequency: "daily"
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSettingChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Settings to save:", settings);
      
      // Success
      setSaveStatus("success");
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
      
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualSync = async () => {
    try {
      console.log("Manual sync triggered");
      // Trigger manual sync logic
    } catch (error) {
      console.error("Error during manual sync:", error);
    }
  };

  const formatLastSync = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar for Mobile */}
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between lg:hidden flex-shrink-0">
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
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
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
            <p className="text-gray-600">Configure system preferences and automation</p>
          </div>

          {/* Save Status */}
          {saveStatus && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              saveStatus === "success" 
                ? "bg-green-50 border border-green-200 text-green-800" 
                : "bg-red-50 border border-red-200 text-red-800"
            }`}>
              {saveStatus === "success" ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span>
                {saveStatus === "success" 
                  ? "Settings saved successfully!" 
                  : "Error saving settings. Please try again."}
              </span>
            </div>
          )}

          <div className="space-y-6">
            {/* Codeforces Sync Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Codeforces Data Sync
                </CardTitle>
                <CardDescription>
                  Configure automatic synchronization with Codeforces
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Enable Auto Sync</Label>
                    <p className="text-sm text-gray-500">
                      Automatically sync student data from Codeforces
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoSyncEnabled}
                    onCheckedChange={(checked) => handleSettingChange("autoSyncEnabled", checked)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sync Interval</Label>
                    <Select value={settings.syncInterval} onValueChange={(value) => handleSettingChange("syncInterval", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Every hour</SelectItem>
                        <SelectItem value="6">Every 6 hours</SelectItem>
                        <SelectItem value="12">Every 12 hours</SelectItem>
                        <SelectItem value="24">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Last Sync</Label>
                    <Input
                      value={formatLastSync(settings.lastSyncTime)}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Sync on Startup</Label>
                    <p className="text-sm text-gray-500">
                      Sync data when the application starts
                    </p>
                  </div>
                  <Switch
                    checked={settings.syncOnStartup}
                    onCheckedChange={(checked) => handleSettingChange("syncOnStartup", checked)}
                  />
                </div>

                <Button
                  onClick={handleManualSync}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Manual Sync Now
                </Button>
              </CardContent>
            </Card>

            {/* Email Reminder Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Reminders
                </CardTitle>
                <CardDescription>
                  Configure automatic email reminders for inactive students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Enable Email Reminders</Label>
                    <p className="text-sm text-gray-500">
                      Send automatic reminders to inactive students
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailRemindersEnabled}
                    onCheckedChange={(checked) => handleSettingChange("emailRemindersEnabled", checked)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Reminder Frequency</Label>
                    <Select value={settings.reminderFrequency} onValueChange={(value) => handleSettingChange("reminderFrequency", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">Every 3 days</SelectItem>
                        <SelectItem value="7">Weekly</SelectItem>
                        <SelectItem value="14">Bi-weekly</SelectItem>
                        <SelectItem value="30">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Reminder Time</Label>
                    <Input
                      type="time"
                      value={settings.reminderTime}
                      onChange={(e) => handleSettingChange("reminderTime", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Inactivity Threshold</Label>
                  <Select value={settings.inactivityThreshold} onValueChange={(value) => handleSettingChange("inactivityThreshold", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="7">1 week</SelectItem>
                      <SelectItem value="14">2 weeks</SelectItem>
                      <SelectItem value="30">1 month</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    Send reminders after this period of inactivity
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* System Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  System Preferences
                </CardTitle>
                <CardDescription>
                  General system configuration options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Students per Page</Label>
                    <Select value={settings.maxStudentsPerPage} onValueChange={(value) => handleSettingChange("maxStudentsPerPage", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                        <SelectItem value="200">200</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Data Retention</Label>
                    <Select value={settings.dataRetentionDays} onValueChange={(value) => handleSettingChange("dataRetentionDays", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">6 months</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="730">2 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Enable Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Show browser notifications for important events
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) => handleSettingChange("enableNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Automatic Backups</Label>
                    <p className="text-sm text-gray-500">
                      Create automatic backups of student data
                    </p>
                  </div>
                  <Switch
                    checked={settings.backupEnabled}
                    onCheckedChange={(checked) => handleSettingChange("backupEnabled", checked)}
                  />
                </div>

                {settings.backupEnabled && (
                  <div className="space-y-2">
                    <Label>Backup Frequency</Label>
                    <Select value={settings.backupFrequency} onValueChange={(value) => handleSettingChange("backupFrequency", value)}>
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
                )}
              </CardContent>
            </Card>

            {/* System Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  System Information
                </CardTitle>
                <CardDescription>
                  Current system status and statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">1,234</div>
                    <div className="text-sm text-gray-600">Total Students</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <RefreshCw className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">24</div>
                    <div className="text-sm text-gray-600">Syncs Today</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Mail className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">156</div>
                    <div className="text-sm text-gray-600">Emails Sent</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings; 