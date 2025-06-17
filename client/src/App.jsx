import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ClerkProviderWrapper } from "./components/ClerkProvider";
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import Header from "./components/Header";
import Home from "./page/Home";
import About from "./page/About";
import Dashboard from "./page/Dashboard";
import AddStudent from "./page/AddStudent";
import AllData from "./page/AllData";
import Footer from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";

function AppContent() {
  const location = useLocation();
  const isDashboardPage = location.pathname.startsWith('/dashboard') || 
                         location.pathname.startsWith('/add-student') || 
                         location.pathname.startsWith('/all-data');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {!isDashboardPage && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/add-student" element={
            <ProtectedRoute>
              <AddStudent />
            </ProtectedRoute>
          } />
          <Route path="/all-data" element={
            <ProtectedRoute>
              <AllData />
            </ProtectedRoute>
          } />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isDashboardPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ClerkProviderWrapper>
      <Router>
        <AppContent />
      </Router>
    </ClerkProviderWrapper>
  );
}

export default App;
