import React from 'react';
import { Link } from 'react-router-dom';

const NotAllowed: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="p-8 max-w-md bg-gray-800 rounded-xl border border-red-500/30 shadow-xl">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-3xl font-bold text-red-400 mb-2">Not Allowed</h1>
        <p className="text-gray-300 mb-6 text-sm">
          You do not have the required permissions to access this page.
        </p>
        <Link
          to="/movies"
          className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          Return to Movies
        </Link>
      </div>
    </div>
  );
};

export default NotAllowed;
