import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { UserButton, useUser } from "@clerk/clerk-react"

const Header = () => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div 
          onClick={handleLogoClick}
          className="flex items-center space-x-2 transition-colors hover:text-blue-600 cursor-pointer"
        >
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Student Management
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          {isSignedIn && (
            <>
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                onClick={() => navigate('/')}
              >
                Home
              </Button>
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button> 
            </>
          )}
          
          {isSignedIn ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.firstName || user.username}
              </span>
              <UserButton 
                afterSignOutUrl="/sign-in"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                asChild
              >
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button 
                variant="default" 
                className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                asChild
              >
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
