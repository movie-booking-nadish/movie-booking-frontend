import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../services/movieService';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const Home: React.FC = () => {
  const [nowShowingMovies, setNowShowingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNowShowing();
  }, []);

  const fetchNowShowing = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await movieService.getAll({ status: 'NOW_SHOWING' });
      setNowShowingMovies(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load featured movies.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-950 via-gray-900 to-gray-900 py-16 md:py-24 overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
            ✨ Cinema Experience Reimagined
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            Book Movie Tickets Online with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Instant Seat Selection</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            Discover the latest blockbusters, check real-time showtimes at premier cinemas, and reserve your perfect seats in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/movies"
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5 text-center"
            >
              🎬 Explore Movies
            </Link>
            <Link
              to="/shows"
              className="w-full sm:w-auto px-8 py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-semibold rounded-xl transition text-center"
            >
              📅 View Showtimes
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Now Showing Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-blue-400 mb-1 block">In Theatres Now</span>
              <h2 className="text-3xl font-extrabold text-white">Featured Blockbusters</h2>
              <p className="text-gray-400 text-sm mt-1">Catch the most popular movies screening right now</p>
            </div>
            <Link
              to="/movies"
              className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 transition"
            >
              View all movies →
            </Link>
          </div>

          {loading ? (
            <Spinner text="Loading featured movies..." className="py-16" />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchNowShowing} />
          ) : nowShowingMovies.length === 0 ? (
            <EmptyState
              icon="🎬"
              title="No Movies Currently Showing"
              description="Check back soon for new release schedules or explore upcoming movies."
              actionText="Browse Upcoming Movies"
              actionLink="/movies"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {nowShowingMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Highlights */}
      <section className="py-16 bg-gray-950 border-t border-gray-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-3">Why Book With Us?</h2>
            <p className="text-gray-400 text-sm">Experience seamless booking with top features designed for movie enthusiasts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center text-2xl mb-4">
                🎟️
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Live Interactive Seat Map</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Choose your exact seats from a dynamic interactive visual hall grid with real-time seat availability.
              </p>
            </div>

            <div className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center text-2xl mb-4">
                ⚡
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Instant Ticket Confirmation</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Confirm your reservation in seconds and view your booking pass anytime under your personal account.
              </p>
            </div>

            <div className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center text-2xl mb-4">
                💳
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Flexible & Secure Payments</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Support for Card, Cash, and Online payment methods with simulated real-time gateway status verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-12 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Ready for your next movie night?</h2>
          <p className="text-gray-300 text-sm mb-6 max-w-xl mx-auto">
            Book your tickets today and enjoy an unforgettable cinematic adventure on the big screen.
          </p>
          <Link
            to="/movies"
            className="inline-block px-8 py-3 bg-white hover:bg-gray-100 text-gray-950 font-bold rounded-xl shadow-lg transition transform hover:-translate-y-0.5 text-sm"
          >
            Find Movies Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
