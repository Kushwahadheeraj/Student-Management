import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Save, 
  UserPlus, 
  Menu,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

function AddStudent() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [handleValid, setHandleValid] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    course: "",
    enrollmentDate: "",
    codeforcesHandle: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    notes: ""
  });
  
  // Validation state
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // If handle hasn't been verified, verify it first
    if (handleValid === null) {
      await verifyHandle();
      if (!handleValid) {
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Student added successfully!');
        navigate('/all-data');
      } else {
        // Handle specific error cases
        if (data.message.includes('email')) {
          setErrors(prev => ({ ...prev, email: data.message }));
        } else if (data.message.includes('Codeforces handle')) {
          setErrors(prev => ({ ...prev, codeforcesHandle: data.message }));
        } else {
          alert(data.message);
        }
      }
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters long';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Codeforces handle validation
    if (!formData.codeforcesHandle.trim()) {
      newErrors.codeforcesHandle = 'Codeforces handle is required';
    } else if (formData.codeforcesHandle.trim().length < 3) {
      newErrors.codeforcesHandle = 'Codeforces handle must be at least 3 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const verifyHandle = async () => {
    if (!formData.codeforcesHandle.trim()) {
      setErrors(prev => ({ ...prev, codeforcesHandle: 'Codeforces handle is required' }));
      return;
    }

    setVerifying(true);
    setHandleValid(null);

    try {
      const response = await fetch(`https://codeforces.com/api/user.info?handles=${formData.codeforcesHandle.trim()}`);
      const data = await response.json();

      if (data.status === 'OK' && data.result.length > 0) {
        setHandleValid(true);
        setErrors(prev => ({ ...prev, codeforcesHandle: '' }));
      } else {
        setHandleValid(false);
        setErrors(prev => ({ 
          ...prev, 
          codeforcesHandle: 'Invalid Codeforces handle or handle does not exist' 
        }));
      }
    } catch (error) {
      console.error('Error verifying handle:', error);
      setHandleValid(false);
      setErrors(prev => ({ 
        ...prev, 
        codeforcesHandle: 'Failed to verify handle. Please try again.' 
      }));
    } finally {
      setVerifying(false);
    }
  };

  const handleHandleBlur = () => {
    if (formData.codeforcesHandle.trim() && handleValid === null) {
      verifyHandle();
    }
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
          <h1 className="text-lg font-semibold">Add Student</h1>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Student</h1>
            <p className="text-gray-600">Register a new student in the system</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Basic details about the student
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Enter first name"
                      required
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter email address"
                      required
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter phone number"
                      required
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="enrollmentDate">Enrollment Date *</Label>
                    <Input
                      id="enrollmentDate"
                      type="date"
                      value={formData.enrollmentDate}
                      onChange={(e) => handleInputChange("enrollmentDate", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
                <CardDescription>
                  Course and enrollment details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="course">Course/Program *</Label>
                  <Select value={formData.course} onValueChange={(value) => handleInputChange("course", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Business Administration">Business Administration</SelectItem>
                      <SelectItem value="Arts & Humanities">Arts & Humanities</SelectItem>
                      <SelectItem value="Natural Sciences">Natural Sciences</SelectItem>
                      <SelectItem value="Medicine">Medicine</SelectItem>
                      <SelectItem value="Law">Law</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="codeforcesHandle">Codeforces Handle *</Label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        id="codeforcesHandle"
                        value={formData.codeforcesHandle}
                        onChange={(e) => handleInputChange("codeforcesHandle", e.target.value)}
                        onBlur={handleHandleBlur}
                        placeholder="Enter Codeforces username (optional)"
                        className={`${errors.codeforcesHandle ? 'border-red-500' : ''} ${
                          handleValid === true ? 'border-green-500' : 
                          handleValid === false ? 'border-red-500' : ''
                        }`}
                      />
                      {verifying && (
                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                      )}
                      {handleValid === true && !verifying && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-600" />
                      )}
                      {handleValid === false && !verifying && (
                        <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={verifyHandle}
                      disabled={verifying || !formData.codeforcesHandle.trim()}
                      className="flex items-center gap-2"
                    >
                      {verifying ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ExternalLink className="h-4 w-4" />
                      )}
                      Verify
                    </Button>
                  </div>
                  {errors.codeforcesHandle && (
                    <p className="text-sm text-red-600">{errors.codeforcesHandle}</p>
                  )}
                  {handleValid === true && (
                    <p className="text-sm text-green-600">✓ Valid Codeforces handle</p>
                  )}
                  {formData.codeforcesHandle && !errors.codeforcesHandle && handleValid === null && (
                    <p className="text-sm text-gray-500">Click verify to check if the handle exists</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Address and emergency contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Enter full address"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                      placeholder="Enter emergency contact name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                      placeholder="Enter emergency contact phone"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>
                  Any additional notes or special requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Enter any additional notes or special requirements"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                disabled={loading || verifying}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!validateForm() || loading || verifying}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Registering...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Register Student
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddStudent; 