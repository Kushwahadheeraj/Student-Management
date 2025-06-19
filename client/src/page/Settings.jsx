import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Settings as SettingsIcon, 
  Clock, 
  Mail, 
  Play, 
  Pause, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Menu,
  Save,
  TestTube,
  Calendar,
  Bell,
  Database
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cronStatus, setCronStatus] = useState(null);
  const [emailStats, setEmailStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form states
  const [syncSchedule, setSyncSchedule] = useState("0 2 * * *");
  const [inactivitySchedule, setInactivitySchedule] = useState("0 3 * * *");
  const [timezone, setTimezone] = useState("UTC");
  const [saving, setSaving] = useState(false);

  // Load cron status and email stats
  const fetchCronStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/cron/status');
      const data = await response.json();

      if (data.success) {
        setCronStatus(data.data.status);
        setEmailStats(data.data.emailStats);
        setSyncSchedule(data.data.schedules.codeforcesSync);
        setInactivitySchedule(data.data.schedules.inactivityCheck);
        setTimezone(data.data.schedules.timezone);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error fetching cron status:', error);
      setError('Failed to fetch system status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCronStatus();
  }, []);

  // Handle manual sync trigger
  const handleManualSync = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cron/trigger/sync', {
        method: 'POST'
      });
      const data = await response.json();

      if (data.success) {
        alert('Manual sync completed successfully');
        fetchCronStatus(); // Refresh status
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error triggering manual sync:', error);
      alert('Failed to trigger manual sync');
    }
  };

  // Handle manual inactivity check
  const handleManualInactivityCheck = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cron/trigger/inactivity', {
        method: 'POST'
      });
      const data = await response.json();

      if (data.success) {
        alert('Manual inactivity check completed successfully');
        fetchCronStatus(); // Refresh status
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error triggering inactivity check:', error);
      alert('Failed to trigger inactivity check');
    }
  };

  // Handle start/stop cron jobs
  const handleToggleCronJobs = async (action) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cron/jobs/${action}`, {
        method: 'POST'
      });
      const data = await response.json();

      if (data.success) {
        alert(`Cron jobs ${action}ed successfully`);
        fetchCronStatus(); // Refresh status
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(`Error ${action}ing cron jobs:`, error);
      alert(`Failed to ${action} cron jobs`);
    }
  };

  // Handle schedule updates
  const handleUpdateSchedules = async () => {
    try {
      setSaving(true);
      
      // Update sync schedule
      const syncResponse = await fetch('http://localhost:5000/api/cron/schedule/sync', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ schedule: syncSchedule })
      });
      
      // Update inactivity schedule
      const inactivityResponse = await fetch('http://localhost:5000/api/cron/schedule/inactivity', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ schedule: inactivitySchedule })
      });

      const syncData = await syncResponse.json();
      const inactivityData = await inactivityResponse.json();

      if (syncData.success && inactivityData.success) {
        alert('Schedules updated successfully');
        fetchCronStatus(); // Refresh status
      } else {
        alert('Failed to update schedules');
      }
    } catch (error) {
      console.error('Error updating schedules:', error);
      alert('Failed to update schedules');
    } finally {
      setSaving(false);
    }
  };

  // Test email configuration
  const handleTestEmail = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cron/test/email');
      const data = await response.json();

      if (data.success) {
        alert('Email test sent successfully');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error testing email:', error);
      alert('Failed to test email configuration');
    }
  };

  const getStatusIcon = (active) => {
    return active ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusBadge = (active) => {
    return active ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Inactive</Badge>
    );
  };

  const formatNextRun = (dateString) => {
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleString();
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

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600">Manage cron jobs, email preferences, and system configuration</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : (
            <div className="space-y-6">
              {/* Cron Job Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Cron Job Status
                  </CardTitle>
                  <CardDescription>
                    Monitor and control automated tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Codeforces Sync Job */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Codeforces Data Sync</h3>
                          <p className="text-sm text-gray-500">Automatically sync student data from Codeforces</p>
                        </div>
                        {cronStatus && getStatusIcon(cronStatus.syncJob.active)}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Status:</span>
                          {cronStatus && getStatusBadge(cronStatus.syncJob.active)}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Schedule:</span>
                          <span className="font-mono">{cronStatus?.syncJob.schedule}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Next Run:</span>
                          <span>{cronStatus && formatNextRun(cronStatus.syncJob.nextRun)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Inactivity Check Job */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Inactivity Check</h3>
                          <p className="text-sm text-gray-500">Check for inactive students and send reminders</p>
                        </div>
                        {cronStatus && getStatusIcon(cronStatus.inactivityJob.active)}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Status:</span>
                          {cronStatus && getStatusBadge(cronStatus.inactivityJob.active)}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Schedule:</span>
                          <span className="font-mono">{cronStatus?.inactivityJob.schedule}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Next Run:</span>
                          <span>{cronStatus && formatNextRun(cronStatus.inactivityJob.nextRun)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Job Controls */}
                  <div className="flex gap-2 mt-6">
                    <Button onClick={() => handleToggleCronJobs('start')} className="flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      Start All Jobs
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleToggleCronJobs('stop')} 
                      className="flex items-center gap-2"
                    >
                      <Pause className="h-4 w-4" />
                      Stop All Jobs
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleManualSync} 
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Manual Sync
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleManualInactivityCheck} 
                      className="flex items-center gap-2"
                    >
                      <Bell className="h-4 w-4" />
                      Check Inactivity
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Schedule Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    Schedule Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure when automated tasks should run
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="syncSchedule">Codeforces Sync Schedule (Cron Pattern)</Label>
                        <Input
                          id="syncSchedule"
                          value={syncSchedule}
                          onChange={(e) => setSyncSchedule(e.target.value)}
                          placeholder="0 2 * * *"
                          className="font-mono"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Format: minute hour day month weekday (e.g., "0 2 * * *" = 2 AM daily)
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="inactivitySchedule">Inactivity Check Schedule (Cron Pattern)</Label>
                        <Input
                          id="inactivitySchedule"
                          value={inactivitySchedule}
                          onChange={(e) => setInactivitySchedule(e.target.value)}
                          placeholder="0 3 * * *"
                          className="font-mono"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Format: minute hour day month weekday (e.g., "0 3 * * *" = 3 AM daily)
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <Button 
                      onClick={handleUpdateSchedules} 
                      disabled={saving}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {saving ? 'Saving...' : 'Save Schedules'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Email Statistics */}
              {emailStats && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-purple-600" />
                      Email Statistics
                    </CardTitle>
                    <CardDescription>
                      Overview of email reminder system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{emailStats.totalStudents}</div>
                        <div className="text-sm text-gray-500">Total Students</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {emailStats.studentsWithRemindersEnabled}
                        </div>
                        <div className="text-sm text-gray-500">Reminders Enabled</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {emailStats.studentsWithRemindersDisabled}
                        </div>
                        <div className="text-sm text-gray-500">Reminders Disabled</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{emailStats.totalRemindersSent}</div>
                        <div className="text-sm text-gray-500">Total Reminders Sent</div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <div className="text-lg font-medium">
                        Average: {emailStats.averageRemindersPerStudent} reminders per student
                      </div>
                    </div>
                    <div className="flex justify-center mt-4">
                      <Button 
                        variant="outline" 
                        onClick={handleTestEmail} 
                        className="flex items-center gap-2"
                      >
                        <TestTube className="h-4 w-4" />
                        Test Email Configuration
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* System Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-gray-600" />
                    System Information
                  </CardTitle>
                  <CardDescription>
                    Current system configuration and status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Timezone</Label>
                      <div className="text-sm text-gray-600">{timezone}</div>
                    </div>
                    <div>
                      <Label>Environment</Label>
                      <div className="text-sm text-gray-600">
                        {process.env.NODE_ENV || 'development'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings; 