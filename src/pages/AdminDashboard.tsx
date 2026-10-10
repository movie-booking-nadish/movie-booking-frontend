import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../services/movieService';
import { theatreService } from '../services/theatreService';
import { showService } from '../services/showService';
import { bookingService } from '../services/bookingService';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

interface DashboardStats {
  moviesCount: number;
  theatresCount: number;
  showsCount: number;
  bookingsCount: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    moviesCount: 0,
    theatresCount: 0,
    showsCount: 0,
    bookingsCount: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const [movies, theatres, shows, bookings] = await Promise.all([
        movieService.getAll().catch(() => []),
        theatreService.getAll().catch(() => []),
        showService.getAll().catch(() => []),
        bookingService.getAll().catch(() => []),
      ]);

      setStats({
        moviesCount: movies.length,
        theatresCount: theatres.length,
        showsCount: shows.length,
        bookingsCount: bookings.length,
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Movies',
      count: stats.moviesCount,
      icon: '🎬',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      link: '/admin/movies',
      linkText: 'Manage Movies',
    },
    {
      title: 'Total Theatres',
      count: stats.theatresCount,
      icon: '🏛️',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      link: '/admin/theatres',
      linkText: 'Manage Theatres',
    },
    {
      title: 'Scheduled Shows',
      count: stats.showsCount,
      icon: '🎭',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      link: '/admin/shows',
      linkText: 'Manage Shows',
    },
    {
      title: 'Customer Bookings',
      count: stats.bookingsCount,
      icon: '🎟️',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      link: '/admin/bookings',
      linkText: 'Manage Bookings',
    },
  ];

  const quickLinks = [
    {
      title: 'Movie Catalogue',
      description: 'Add new movie titles, edit metadata, genres, and release statuses.',
      icon: '🎬',
      link: '/admin/movies',
      buttonText: 'Manage Movies →',
    },
    {
      title: 'Theatre Venues',
      description: 'Configure theatre halls, locations, seating capacities, and statuses.',
      icon: '🏛️',
      link: '/admin/theatres',
      buttonText: 'Manage Theatres →',
    },
    {
      title: 'Show Scheduling',
      description: 'Schedule showtimes, assign ticket pricing, and manage hall allocations.',
      icon: '🎭',
      link: '/admin/shows',
      buttonText: 'Manage Shows →',
    },
    {
      title: 'Bookings & Orders',
      description: 'View all customer reservations, update booking statuses, or cancel tickets.',
      icon: '🎟️',
      link: '/admin/bookings',
      buttonText: 'Manage Bookings →',
    },
    {
      title: 'User Management',
      description: 'Inspect registered user profiles, modify roles, or manage accounts.',
      icon: '👥',
      link: '/admin/users',
      buttonText: 'Manage Users →',
    },
  ];

  if (loading) {
    return <Spinner text="Loading admin dashboard..." className="min-h-[60vh]" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">
              System overview, operational metrics, and quick administrative management.
            </p>
          </div>
          <button
            onClick={fetchStats}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer self-start sm:self-auto shadow-sm"
          >
            <span>🔄</span> Refresh Stats
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} onRetry={fetchStats} />
        </div>
      )}

      {/* Count Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-500">{card.title}</span>
                <span className="text-2xl p-2 rounded-xl bg-gray-50">{card.icon}</span>
              </div>
              <div className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
                {card.count}
              </div>
            </div>
            <Link
              to={card.link}
              className={`text-xs font-bold inline-flex items-center gap-1 ${card.textColor} hover:underline`}
            >
              <span>{card.linkText}</span>
              <span>→</span>
            </Link>
          </div>
        ))}
      </div>

      {/* Quick Action Navigation */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Management Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mb-4">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1.5">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-6">{item.description}</p>
              </div>
              <Link
                to={item.link}
                className="w-full text-center py-2.5 px-4 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 text-gray-700 text-xs font-bold rounded-lg border border-gray-200 hover:border-indigo-200 transition"
              >
                {item.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
