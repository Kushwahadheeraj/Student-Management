import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChartComponent, BarChartComponent } from "@/components/ui/chart";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  BarChart3, 
  Plus,
  Search,
  Settings,
  Menu,
  TrendingUp,
  Target
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock data for dashboard graphs
  const contestHistoryData = [
    { date: "2024-01-15", rating: 1450 },
    { date: "2024-01-16", rating: 1460 },
    { date: "2024-01-17", rating: 1445 },
    { date: "2024-01-18", rating: 1470 },
    { date: "2024-01-19", rating: 1485 },
    { date: "2024-01-20", rating: 1500 },
    { date: "2024-01-21", rating: 1495 },
    { date: "2024-01-22", rating: 1510 },
    { date: "2024-01-23", rating: 1525 },
    { date: "2024-01-24", rating: 1530 }
  ];

  const problemsSolvedData = [
    { date: "2024-01-15", problems: 5 },
    { date: "2024-01-16", problems: 3 },
    { date: "2024-01-17", problems: 7 },
    { date: "2024-01-18", problems: 4 },
    { date: "2024-01-19", problems: 6 },
    { date: "2024-01-20", problems: 8 },
    { date: "2024-01-21", problems: 2 },
    { date: "2024-01-22", problems: 5 },
    { date: "2024-01-23", problems: 9 },
    { date: "2024-01-24", problems: 4 }
  ];

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
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <div className="w-10"></div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome to your Student Management System</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">+3 new this semester</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Next event in 3 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average GPA</CardTitle>
                <BarChart3 className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.45</div>
                <p className="text-xs text-muted-foreground">+0.1 from last semester</p>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Graphs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Contest History Graph */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Contest History
                </CardTitle>
                <CardDescription>
                  Rating progression over recent contests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LineChartComponent 
                  data={contestHistoryData} 
                  xKey="date" 
                  yKey="rating" 
                  color="#3b82f6"
                />
              </CardContent>
            </Card>

            {/* Problems Solved Graph */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Problems Solved
                </CardTitle>
                <CardDescription>
                  Daily problem solving activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChartComponent 
                  data={problemsSolvedData} 
                  xKey="date" 
                  yKey="problems" 
                  color="#10b981"
                />
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/add-student')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-blue-600" />
                  Add New Student
                </CardTitle>
                <CardDescription>
                  Register a new student in the system
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/all-data')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-green-600" />
                  View All Students
                </CardTitle>
                <CardDescription>
                  Find and view student information
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/settings')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  System Settings
                </CardTitle>
                <CardDescription>
                  Configure system preferences
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates and activities in your system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New student registered</p>
                    <p className="text-xs text-gray-500">John Doe was added to Computer Science</p>
                  </div>
                  <span className="text-xs text-gray-400">2 hours ago</span>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Grade updated</p>
                    <p className="text-xs text-gray-500">Mathematics grades for Class 10A</p>
                  </div>
                  <span className="text-xs text-gray-400">4 hours ago</span>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Event scheduled</p>
                    <p className="text-xs text-gray-500">Parent-Teacher meeting on Friday</p>
                  </div>
                  <span className="text-xs text-gray-400">1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 