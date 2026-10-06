import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-gray-800 border-t border-gray-700 py-6 text-center text-sm text-gray-400">
        <p>© 2026 Movie Ticket Booking System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
