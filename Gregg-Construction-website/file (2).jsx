/**
 * Gregg Construction - Luxury Navigation Bar
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiUser, HiLogout } from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isContractor, logout } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navLinks = isAuthenticated
    ? isContractor
      ? [
          { name: 'Dashboard', path: '/contractor/dashboard' },
          { name: 'Projects', path: '/projects' },
          { name: 'Clients', path: '/contractor/clients' },
        ]
      : [
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'My Projects', path: '/projects' },
          { name: 'New Project', path: '/projects/new' },
        ]
    : [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/#services' },
        { name: 'About', path: '/#about' },
        { name: 'Contact', path: '/#contact' },
      ];
  
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-charcoal-950/95 backdrop-blur-md py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gold-500 flex items-center justify-center">
              <span className="text-charcoal-950 font-display font-bold text-xl">G</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-ivory-100 font-display text-xl tracking-wide">
                GREGG
              </span>
              <span className="text-gold-500 font-display text-xl tracking-wide ml-2">
                CONSTRUCTION
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm uppercase tracking-widest transition-colors duration-300 ${
                  location.pathname === link.path
                    ? 'text-gold-500'
                    : 'text-ivory-300 hover:text-gold-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          {/* Auth Buttons / User Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-6">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-ivory-300 hover:text-gold-400 transition-colors"
                >
                  <HiUser className="w-5 h-5" />
                  <span className="text-sm">{user?.first_name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-ivory-400 hover:text-red-400 transition-colors"
                >
                  <HiLogout className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-ivory-300 hover:text-gold-400 text-sm uppercase tracking-widest transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-ivory-100 p-2"
          >
            {isMobileMenuOpen ? (
              <HiX className="w-6 h-6" />
            ) : (
              <HiMenu className="w-6 h-6" />
            )}
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
            className="lg:hidden bg-charcoal-950/98 backdrop-blur-lg"
          >
            <div className="px-6 py-8 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-ivory-100 text-lg uppercase tracking-wider"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-6 border-t border-charcoal-700">
                {isAuthenticated ? (
                  <button
                    onClick={logout}
                    className="text-red-400 uppercase tracking-wider"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-primary w-full text-center block"
                  >
                    Sign In
                  </Link>
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
