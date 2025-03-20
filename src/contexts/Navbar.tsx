import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavbarProps } from '@/types';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  ChevronDown, 
  BookOpen, 
  BarChart3,
  Settings
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navbarClass = `
    fixed top-0 left-0 right-0 z-50
    transition-all duration-300 ease-in-out
    ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-subtle' : 'bg-transparent'}
  `;

  const NavLinks = () => (
    <>
      {user?.role === 'admin' ? (
        // Admin Links
        <>
          <Link to="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors duration-200">
            <span className="flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </span>
          </Link>
          <Link to="/settings" className="text-foreground/80 hover:text-foreground transition-colors duration-200">
            <span className="flex items-center gap-1.5">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </span>
          </Link>
        </>
      ) : (
        // Student Links
        <>
          <Link to="/tests" className="text-foreground/80 hover:text-foreground transition-colors duration-200">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>Tests</span>
            </span>
          </Link>
          <Link to="/results" className="text-foreground/80 hover:text-foreground transition-colors duration-200">
            <span className="flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4" />
              <span>Results</span>
            </span>
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className={navbarClass}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 font-medium text-lg text-foreground"
          >
            <div className="h-8 w-8 rounded-md bg-cbt-500 flex items-center justify-center text-white font-bold">
              CBT
            </div>
            <span className="hidden sm:inline-block">ExamPortal</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-6">
              <NavLinks />
            </nav>
          )}

          {/* User Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="focus-ring">
                      <User className="h-4 w-4 mr-1.5" />
                      <span className="hidden sm:inline-block">{user.name}</span>
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 animate-scale-in">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link to="/login" className="hidden sm:inline-block">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            {isMobile && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobile && isMenuOpen && (
          <div className="md:hidden py-4 border-t animate-slide-in overflow-hidden">
            <nav className="flex flex-col space-y-4 text-sm">
              <NavLinks />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;