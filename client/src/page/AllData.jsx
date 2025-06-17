import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  Eye, 
  ArrowLeft, 
  Menu,
  RefreshCw,
  Mail,
  Bell,
  BellOff,
  ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

function AllData() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  // Mock data with Codeforces information - replace with actual data from your backend
  const [students] = useState([
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@email.com",
      phone: "+1 234-567-8900",
      course: "Computer Science",
      enrollmentDate: "2024-01-15",
      status: "Active",
      codeforcesHandle: "john_doe_cp",
      currentRating: 1450,
      maxRating: 1650,
      lastUpdated: "2024-01-20T10:30:00Z",
      reminderEmailsSent: 2,
      emailRemindersEnabled: true,
      lastSubmissionDate: "2024-01-18T15:45:00Z"
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@email.com",
      phone: "+1 234-567-8901",
      course: "Engineering",
      enrollmentDate: "2024-02-01",
      status: "Active",
      codeforcesHandle: "jane_smith",
      currentRating: 2100,
      maxRating: 2200,
      lastUpdated: "2024-01-20T11:15:00Z",
      reminderEmailsSent: 0,
      emailRemindersEnabled: true,
      lastSubmissionDate: "2024-01-20T09:30:00Z"
    },
    {
      id: 3,
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike.johnson@email.com",
      phone: "+1 234-567-8902",
      course: "Business Administration",
      enrollmentDate: "2024-01-20",
      status: "Inactive",
      codeforcesHandle: "mike_j",
      currentRating: 800,
      maxRating: 1200,
      lastUpdated: "2024-01-19T14:20:00Z",
      reminderEmailsSent: 5,
      emailRemindersEnabled: false,
      lastSubmissionDate: "2024-01-13T16:20:00Z"
    },
    {
      id: 4,
      firstName: "Sarah",
      lastName: "Williams",
      email: "sarah.williams@email.com",
      phone: "+1 234-567-8903",
      course: "Arts & Humanities",
      enrollmentDate: "2024-02-10",
      status: "Active",
      codeforcesHandle: "sarah_w",
      currentRating: 1600,
      maxRating: 1700,
      lastUpdated: "2024-01-20T12:45:00Z",
      reminderEmailsSent: 1,
      emailRemindersEnabled: true,
      lastSubmissionDate: "2024-01-19T20:15:00Z"
    },
    {
      id: 5,
      firstName: "David",
      lastName: "Brown",
      email: "david.brown@email.com",
      phone: "+1 234-567-8904",
      course: "Computer Science",
      enrollmentDate: "2024-01-25",
      status: "Active",
      codeforcesHandle: "david_brown_cp",
      currentRating: 1800,
      maxRating: 1900,
      lastUpdated: "2024-01-20T13:30:00Z",
      reminderEmailsSent: 0,
      emailRemindersEnabled: true,
      lastSubmissionDate: "2024-01-20T14:45:00Z"
    }
  ]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.codeforcesHandle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterCourse === "all" || student.course === filterCourse;
    
    return matchesSearch && matchesFilter;
  });

  const getRatingColor = (rating) => {
    if (rating >= 2400) return "text-red-600";
    if (rating >= 2100) return "text-orange-600";
    if (rating >= 1900) return "text-purple-600";
    if (rating >= 1600) return "text-blue-600";
    if (rating >= 1400) return "text-cyan-600";
    if (rating >= 1200) return "text-green-600";
    return "text-gray-600";
  };

  const getInactivityStatus = (lastSubmissionDate) => {
    const daysSinceLastSubmission = Math.floor((new Date() - new Date(lastSubmissionDate)) / (1000 * 60 * 60 * 24));
    if (daysSinceLastSubmission > 7) return "inactive";
    if (daysSinceLastSubmission > 3) return "warning";
    return "active";
  };

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setShowProfile(true);
  };

  const handleEdit = (studentId) => {
    console.log("Edit student:", studentId);
    // Navigate to edit student page
  };

  const handleDelete = (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      console.log("Delete student:", studentId);
      // Delete student logic
    }
  };

  const handleRefreshData = (studentId) => {
    console.log("Refresh Codeforces data for student:", studentId);
    // Trigger real-time Codeforces data fetch
  };

  const handleToggleEmailReminders = (studentId) => {
    console.log("Toggle email reminders for student:", studentId);
    // Toggle email reminders
  };

  const handleDownloadCSV = () => {
    const headers = [
      "ID", "Name", "Email", "Phone", "Course", "Status", 
      "Codeforces Handle", "Current Rating", "Max Rating", 
      "Last Updated", "Last Submission", "Reminder Emails Sent"
    ];
    
    const csvContent = [
      headers.join(","),
      ...filteredStudents.map(student => [
        student.id,
        `${student.firstName} ${student.lastName}`,
        student.email,
        student.phone,
        student.course,
        student.status,
        student.codeforcesHandle,
        student.currentRating,
        student.maxRating,
        new Date(student.lastUpdated).toLocaleDateString(),
        new Date(student.lastSubmissionDate).toLocaleDateString(),
        student.reminderEmailsSent
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students_data.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatLastUpdated = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  if (showProfile && selectedStudent) {
    return (
      <StudentProfile 
        student={selectedStudent} 
        onBack={() => setShowProfile(false)}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
    );
  }

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
          <h1 className="text-lg font-semibold">All Data</h1>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Management</h1>
            <p className="text-gray-600">View and manage all registered students with Codeforces progress</p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Student Records</CardTitle>
                  <CardDescription>
                    Total students: {filteredStudents.length} | 
                    Last sync: {new Date().toLocaleString()}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={handleDownloadCSV}
                  >
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button 
                    onClick={() => navigate('/add-student')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Add New Student
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, email, or Codeforces handle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={filterCourse} onValueChange={setFilterCourse}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Business Administration">Business Administration</SelectItem>
                      <SelectItem value="Arts & Humanities">Arts & Humanities</SelectItem>
                      <SelectItem value="Natural Sciences">Natural Sciences</SelectItem>
                      <SelectItem value="Medicine">Medicine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-medium text-gray-700">Student</th>
                      <th className="text-left p-3 font-medium text-gray-700">Contact</th>
                      <th className="text-left p-3 font-medium text-gray-700">Course</th>
                      <th className="text-left p-3 font-medium text-gray-700">Codeforces</th>
                      <th className="text-left p-3 font-medium text-gray-700">Rating</th>
                      <th className="text-left p-3 font-medium text-gray-700">Activity</th>
                      <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => {
                      const inactivityStatus = getInactivityStatus(student.lastSubmissionDate);
                      return (
                        <tr key={student.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div>
                              <div className="font-medium">{student.firstName} {student.lastName}</div>
                              <div className="text-sm text-gray-500">ID: {student.id}</div>
                              <Badge variant={student.status === 'Active' ? 'default' : 'secondary'}>
                                {student.status}
                              </Badge>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              <div>{student.email}</div>
                              <div className="text-gray-500">{student.phone}</div>
                            </div>
                          </td>
                          <td className="p-3 text-gray-700">{student.course}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">{student.codeforcesHandle}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => window.open(`https://codeforces.com/profile/${student.codeforcesHandle}`, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-xs text-gray-500">
                              Updated: {formatLastUpdated(student.lastUpdated)}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              <div className={`font-medium ${getRatingColor(student.currentRating)}`}>
                                {student.currentRating}
                              </div>
                              <div className="text-xs text-gray-500">
                                Max: {student.maxRating}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              <div className={`text-xs ${
                                inactivityStatus === 'inactive' ? 'text-red-600' :
                                inactivityStatus === 'warning' ? 'text-orange-600' : 'text-green-600'
                              }`}>
                                {inactivityStatus === 'inactive' ? 'Inactive' :
                                 inactivityStatus === 'warning' ? 'Warning' : 'Active'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {student.reminderEmailsSent} reminders sent
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewProfile(student)}
                                className="h-8 w-8 p-0"
                                title="View Profile"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRefreshData(student.id)}
                                className="h-8 w-8 p-0"
                                title="Refresh Data"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleEmailReminders(student.id)}
                                className="h-8 w-8 p-0"
                                title={student.emailRemindersEnabled ? "Disable Reminders" : "Enable Reminders"}
                              >
                                {student.emailRemindersEnabled ? 
                                  <Bell className="h-4 w-4" /> : 
                                  <BellOff className="h-4 w-4" />
                                }
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(student.id)}
                                className="h-8 w-8 p-0"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(student.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredStudents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No students found matching your criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AllData; 