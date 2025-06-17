import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  UserPlus, 
  Database, 
  LogOut,
  Menu,
  X,
  Settings
} from "lucide-react";

const Sidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const { signOut } = useUser();

  const handleLogout = async () => {
    await signOut();
    navigate('/sign-in');
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
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
      onClick: () => navigate('/settings')
    }
  ];

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
        fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        w-64
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Student Management</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className="w-full justify-start text-left h-12 px-4 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              onClick={item.onClick}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-left h-12 px-4 hover:bg-red-50 hover:text-red-600 transition-colors"
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