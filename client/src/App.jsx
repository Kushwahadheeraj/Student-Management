import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProviderWrapper } from "./components/ClerkProvider";
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import Header from "./components/Header";
import Home from "./page/Home";
import Footer from "./components/Footer";



function App() {
  return (
    <ClerkProviderWrapper>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer/>
        </div>
      </Router>
    </ClerkProviderWrapper>
  );
}

export default App;
