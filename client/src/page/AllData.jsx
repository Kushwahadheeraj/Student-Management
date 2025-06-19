import { useState, useEffect } from "react";
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
  ExternalLink,
  Plus,
  MoreHorizontal,
  Calendar,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import StudentProfile from "@/components/StudentProfile";

function AllData() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        sortBy,
        sortOrder
      });

      const response = await fetch(`http://localhost:5000/api/students?${params}`);
      const data = await response.json();

      if (data.success) {
        setStudents(data.data);
        setTotalPages(data.pagination.pages);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch students');
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load students on component mount and when filters change
  useEffect(() => {
    fetchStudents();
  }, [currentPage, pageSize, searchTerm, sortBy, sortOrder]);

  // Handle student deletion
  const handleDelete = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/students/${studentId}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (data.success) {
        fetchStudents(); // Refresh the list
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student');
    }
  };

  // Handle manual Codeforces data refresh
  const handleRefreshData = async (studentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/students/${studentId}/sync`, {
        method: 'POST'
      });
      const data = await response.json();

      if (data.success) {
        fetchStudents(); // Refresh the list
        alert('Codeforces data refreshed successfully');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      alert('Failed to refresh Codeforces data');
    }
  };

  // Handle email reminder toggle
  const handleToggleEmailReminders = async (studentId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/students/${studentId}/email-preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inactivityReminders: !currentStatus
        })
      });
      const data = await response.json();

      if (data.success) {
        fetchStudents(); // Refresh the list
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error updating email preferences:', error);
      alert('Failed to update email preferences');
    }
  };

  // Handle CSV export
  const handleDownloadCSV = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/students/export-csv');
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'students_export.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to download CSV');
      }
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Failed to download CSV');
    }
  };

  // Handle view profile
  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setShowProfile(true);
  };

  // Filter students based on status
  const filteredStudents = students.filter(student => {
    if (filterStatus === "all") return true;
    if (filterStatus === "active") return student.isActive;
    if (filterStatus === "inactive") return !student.isActive;
    return true;
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
    if (!lastSubmissionDate) return "inactive";
    const daysSinceLastSubmission = Math.floor((new Date() - new Date(lastSubmissionDate)) / (1000 * 60 * 60 * 24));
    if (daysSinceLastSubmission > 7) return "inactive";
    if (daysSinceLastSubmission > 3) return "warning";
    return "active";
  };

  const formatLastUpdated = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
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
          <h1 className="text-lg font-semibold">All Students</h1>
          <div className="w-10"></div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">All Students</h1>
                <p className="text-gray-600">Manage and view all enrolled students</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => navigate('/add-student')} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Student
                </Button>
                <Button variant="outline" onClick={handleDownloadCSV} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, email, or Codeforces handle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Students Table */}
          <Card>
            <CardHeader>
              <CardTitle>Students ({filteredStudents.length})</CardTitle>
              <CardDescription>
                Showing {filteredStudents.length} of {students.length} students
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">{error}</div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No students found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Name</th>
                        <th className="text-left py-3 px-4 font-medium">Email</th>
                        <th className="text-left py-3 px-4 font-medium">Phone</th>
                        <th className="text-left py-3 px-4 font-medium">Codeforces Handle</th>
                        <th className="text-left py-3 px-4 font-medium">Current Rating</th>
                        <th className="text-left py-3 px-4 font-medium">Max Rating</th>
                        <th className="text-left py-3 px-4 font-medium">Last Updated</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student._id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-sm text-gray-500">
                                {student.emailPreferences.reminderCount} reminders sent
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">{student.email}</td>
                          <td className="py-3 px-4">{student.phoneNumber}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono">{student.codeforcesHandle}</span>
                              <a 
                                href={`https://codeforces.com/profile/${student.codeforcesHandle}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`font-medium ${getRatingColor(student.currentRating)}`}>
                              {student.currentRating}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`font-medium ${getRatingColor(student.maxRating)}`}>
                              {student.maxRating}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">{formatLastUpdated(student.lastDataSync)}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={getInactivityStatus(student.lastSubmissionDate) === "active" ? "default" : "secondary"}
                                className={getInactivityStatus(student.lastSubmissionDate) === "inactive" ? "bg-red-100 text-red-800" : ""}
                              >
                                {getInactivityStatus(student.lastSubmissionDate)}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleEmailReminders(student._id, student.emailPreferences.inactivityReminders)}
                                className="h-6 w-6 p-0"
                              >
                                {student.emailPreferences.inactivityReminders ? (
                                  <Bell className="h-3 w-3 text-green-600" />
                                ) : (
                                  <BellOff className="h-3 w-3 text-gray-400" />
                                )}
                              </Button>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewProfile(student)}
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRefreshData(student._id)}
                                className="h-8 w-8 p-0"
                                title="Refresh Codeforces data"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/edit-student/${student._id}`)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(student._id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
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