import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="p-8 max-w-md bg-gray-800 rounded-xl border border-gray-700 shadow-xl">
        <h1 className="text-7xl font-extrabold text-blue-500 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-gray-400 mb-6 text-sm">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/movies"
          className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
