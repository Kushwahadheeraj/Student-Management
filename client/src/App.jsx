import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProviderWrapper } from "./components/ClerkProvider";
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import Header from "./components/Header";
import Home from "./page/Home";
import About from "./page/About";
import Dashboard from "./page/Dashboard";
import AddStudent from "./page/AddStudent";
import AllData from "./page/AllData";
import Settings from "./page/Settings";
import Footer from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <ClerkProviderWrapper>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
          <Header />
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
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ClerkProviderWrapper>
  );
}

export default App;
