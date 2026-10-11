import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2 text-white font-extrabold text-xl tracking-tight">
              <span className="text-2xl">🎬</span>
              <span>MovieBooking</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your premier destination for movie ticket reservations. Reserve your favorite seats in real-time across top cinema halls.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/movies" className="hover:text-blue-400 transition">
                  Now Showing Movies
                </Link>
              </li>
              <li>
                <Link to="/shows" className="hover:text-blue-400 transition">
                  Showtimes & Tickets
                </Link>
              </li>
              <li>
                <Link to="/theatres" className="hover:text-blue-400 transition">
                  Theatres & Venues
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-blue-400 transition">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Administration */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">Portal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/signin" className="hover:text-blue-400 transition">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-blue-400 transition">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-blue-400 transition">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/movies" className="hover:text-blue-400 transition">
                  Manage Movies
                </Link>
              </li>
            </ul>
          </div>

          {/* Demo & Tech Stack Info */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">Technology</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              Full-stack system built with Spring Boot 3, Spring Security, JWT, MySQL, React 18, Vite, and Tailwind CSS.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 bg-gray-800 text-gray-300 rounded border border-gray-700 font-mono">React</span>
              <span className="px-2 py-1 bg-gray-800 text-gray-300 rounded border border-gray-700 font-mono">Spring Boot</span>
              <span className="px-2 py-1 bg-gray-800 text-gray-300 rounded border border-gray-700 font-mono">MySQL</span>
              <span className="px-2 py-1 bg-gray-800 text-gray-300 rounded border border-gray-700 font-mono">Tailwind</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Movie Ticket Booking System. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="text-gray-300 font-semibold">CinePass Platform</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
