import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const isActive = (path: string) => location.pathname === path;

  const customerLinks = [
    { name: 'Movies', path: '/movies' },
    { name: 'Theatres', path: '/theatres' },
    { name: 'Shows', path: '/shows' },
    { name: 'My Bookings', path: '/my-bookings' },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Manage Movies', path: '/admin/movies' },
    { name: 'Manage Theatres', path: '/admin/theatres' },
    { name: 'Manage Shows', path: '/admin/shows' },
    { name: 'Manage Bookings', path: '/admin/bookings' },
    { name: 'Manage Users', path: '/admin/users' },
  ];

  const currentLinks = role === 'ADMIN' ? adminLinks : customerLinks;

  return (
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link
              to={role === 'ADMIN' ? '/admin' : '/movies'}
              className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent"
            >
              🎬 MovieBooking
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {isAuthenticated &&
                currentLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition duration-150 ${
                      isActive(link.path)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
            </div>
          </div>

          {/* Desktop Right items */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Hello,</span>
                  <span className="text-sm font-semibold text-white">{user?.fullName}</span>
                  {role === 'ADMIN' && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded bg-purple-900 text-purple-200 border border-purple-700">
                      ADMIN
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition duration-150 cursor-pointer shadow-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/signin"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition duration-150"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition duration-150 shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-label="Main menu"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 px-4 pt-2 pb-4 space-y-1">
          {isAuthenticated ? (
            <>
              <div className="py-2 border-b border-gray-700 mb-2">
                <p className="text-sm font-medium text-white">{user?.fullName}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
                {role === 'ADMIN' && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded bg-purple-900 text-purple-200">
                    ADMIN
                  </span>
                )}
              </div>

              {currentLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-2 border-t border-gray-700 mt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-gray-700 hover:text-red-300"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-1 pt-2">
              <Link
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
