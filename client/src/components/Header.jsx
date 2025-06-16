import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const Header = () => {
  return (
    <header className="w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 transition-colors hover:text-blue-600">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Logo
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <Button 
            variant="ghost" 
            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            asChild
          >
            <Link to="/">Home</Link>
          </Button>
          <Button 
            variant="default" 
            className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            asChild
          >
            <Link to="/login">Login</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

export default Header
