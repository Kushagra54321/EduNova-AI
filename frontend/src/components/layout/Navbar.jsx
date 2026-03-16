import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../ui/Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'AI Chat', path: '/chat' },
    { name: 'Smart Study', path: '/notes' },
    { name: 'Planner', path: '/planner' },
    { name: 'Quiz', path: '/quiz' }
  ];

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-md border-b border-white/10 shadow-lg py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 ml-10">
            <div className="flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === link.path ? 'text-primary' : 'text-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {!token ? (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="text-sm font-medium text-primary hover:text-white transition-colors flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary border border-primary/30">
                     {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-semibold text-white bg-white/10 hover:bg-red-500/20 hover:text-red-400 rounded-full border border-white/10 transition-all"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-3 px-3">
                {!token ? (
                  <>
                    <Link
                      to="/login"
                      className="w-full text-center py-3 text-sm font-medium text-white border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="w-full text-center py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-lg shadow-lg"
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      className="w-full text-center py-3 text-sm font-medium text-primary border border-primary/20 rounded-lg hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-center py-3 text-sm font-semibold text-red-400 bg-red-500/10 rounded-lg shadow-lg border border-red-500/20"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
