import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProviderWrapper } from "./components/ClerkProvider";
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Header from "./components/Header";

function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Welcome to Student Management
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Dashboard Overview
          </h2>
          <p className="text-gray-600 mb-4">
            Manage your students, courses, and academic records all in one place.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-700">Students</h3>
              <p className="text-sm text-gray-600">Manage student records</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-700">Courses</h3>
              <p className="text-sm text-gray-600">View and manage courses</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-700">Reports</h3>
              <p className="text-sm text-gray-600">Generate academic reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ClerkProviderWrapper>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ClerkProviderWrapper>
  );
}

export default App;
