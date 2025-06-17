import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  UserPlus, 
  Database, 
  LogOut,
  Menu,
  X,
  Settings,
  User
} from "lucide-react";

const Sidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useUser();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/sign-in');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
      onClick: () => navigate('/dashboard')
    },
    {
      icon: UserPlus,
      label: "Add Student",
      path: "/add-student",
      onClick: () => navigate('/add-student')
    },
    {
      icon: Database,
      label: "All Data",
      path: "/all-data",
      onClick: () => navigate('/all-data')
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        w-64 flex flex-col
        overflow-hidden
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Student Management</h2>
            <p className="text-sm text-gray-600">Admin Panel</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b bg-blue-50 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-600">{user.emailAddresses[0]?.emailAddress}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              className={`w-full justify-start text-left h-12 px-4 transition-colors ${
                isActive(item.path) 
                  ? "bg-blue-600 text-white hover:bg-blue-700" 
                  : "hover:bg-blue-50 hover:text-blue-600"
              }`}
              onClick={item.onClick}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Settings and Logout Section */}
        <div className="p-4 border-t bg-gray-50 space-y-2 flex-shrink-0">
          {/* Settings Button */}
          <Button
            variant={isActive("/settings") ? "default" : "ghost"}
            className={`w-full justify-start text-left h-12 px-4 transition-colors ${
              isActive("/settings") 
                ? "bg-blue-600 text-white hover:bg-blue-700" 
                : "hover:bg-gray-100 hover:text-gray-700"
            }`}
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Button>

          {/* Logout Button */}
          <Button
            variant="ghost"
            className="w-full justify-start text-left h-12 px-4 hover:bg-red-50 hover:text-red-600 transition-colors border border-red-200 hover:border-red-300"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 