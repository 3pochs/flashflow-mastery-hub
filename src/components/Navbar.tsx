
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Settings } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-3 glass" : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-display font-bold text-xl"
        >
          <img src="/logo.svg" alt="FlashFlow" className="h-8 w-8" />
          <span>FlashFlow</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {user ? (
            <>
              <Link to="/decks" className="text-sm font-medium hover:text-primary transition-colors">
                My Decks
              </Link>
              <Link to="/create" className="text-sm font-medium hover:text-primary transition-colors">
                Create
              </Link>
              <Link to="/community" className="text-sm font-medium hover:text-primary transition-colors">
                Community
              </Link>
              <Link to="/settings" className="text-sm font-medium hover:text-primary transition-colors">
                <Settings size={18} className="inline mr-1" />
                Settings
              </Link>
            </>
          ) : (
            <>
              <Link to="/decks" className="text-sm font-medium hover:text-primary transition-colors">
                My Decks
              </Link>
              <Link to="/create" className="text-sm font-medium hover:text-primary transition-colors">
                Create
              </Link>
              <Link to="/community" className="text-sm font-medium hover:text-primary transition-colors">
                Community
              </Link>
              <Link 
                to="/signup" 
                className="btn-primary"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass absolute top-full left-0 right-0 py-4 animate-slide-down">
          <nav className="container mx-auto px-4 flex flex-col gap-4">
            <Link 
              to="/decks" 
              className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Decks
            </Link>
            <Link 
              to="/create" 
              className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Create
            </Link>
            <Link 
              to="/community" 
              className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Community
            </Link>
            
            {user ? (
              <Link 
                to="/settings" 
                className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings size={16} className="inline mr-1" /> Settings
              </Link>
            ) : (
              <Link 
                to="/signup" 
                className="mx-4 btn-primary text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
