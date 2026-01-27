import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, User, LogOut, Heart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b",
        isScrolled ? "bg-white shadow-sm border-gray-100" : "bg-white border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
              ShopHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary-600 relative py-2",
                  location.pathname === link.path ? "text-primary-600" : "text-gray-600"
                )}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/cart" className="relative group">
              <div className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md border-2 border-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </div>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-semibold text-gray-900 leading-none mb-1">
                      {user?.name?.split(' ')[0]}
                    </p>
                    <div className="flex gap-2 text-xs">
                       <Link to="/profile" className="text-primary-600 hover:underline">
                        Profile
                      </Link>
                      <span className="text-gray-300">|</span>
                      <Link to="/orders" className="text-primary-600 hover:underline">
                        Orders
                      </Link>
                    </div>
                  </div>
                  <Link to="/profile" className="h-10 w-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-gray-600 border border-white shadow-sm hover:ring-2 hover:ring-primary-100 transition-all">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-medium text-gray-600 hover:text-primary-600"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                {isAuthenticated ? (
                  <>
                      <Link
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-base font-medium text-gray-600"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-base font-medium text-gray-600"
                      >
                        My Orders
                      </Link>
                    <button
                      onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                      className="text-base font-medium text-red-500"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-center py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-center py-2.5 rounded-lg bg-primary-600 text-white font-medium shadow-lg shadow-primary-500/25"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
