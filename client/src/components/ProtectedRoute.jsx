import { useAuth } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const { isLoaded, userId } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!userId) {
    // Save the attempted URL to redirect back after login
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return children;
} 