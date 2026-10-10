import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Show, Movie, Theatre } from '../types';
import { showService } from '../services/showService';
import { movieService } from '../services/movieService';
import { theatreService } from '../services/theatreService';
import StatusBadge from '../components/StatusBadge';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const Shows: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedMovieId, setSelectedMovieId] = useState<string>('');
  const [selectedTheatreId, setSelectedTheatreId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const fetchDropdownData = async () => {
    try {
      const [moviesData, theatresData] = await Promise.all([
        movieService.getAll(),
        theatreService.getAll(),
      ]);
      setMovies(moviesData);
      setTheatres(theatresData);
    } catch {
      // Non-blocking for main shows view
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchShows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await showService.getAll({
        movieId: selectedMovieId ? Number(selectedMovieId) : undefined,
        theatreId: selectedTheatreId ? Number(selectedTheatreId) : undefined,
        showDate: selectedDate || undefined,
      });
      setShows(data);
    } catch {
      setError('Failed to load shows. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedMovieId, selectedTheatreId, selectedDate]);

  useEffect(() => {
    fetchShows();
  }, [fetchShows]);

  const handleClearFilters = () => {
    setSelectedMovieId('');
    setSelectedTheatreId('');
    setSelectedDate('');
  };

  const hasActiveFilters = Boolean(selectedMovieId || selectedTheatreId || selectedDate);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Movie Shows & Screenings</h1>
        <p className="mt-2 text-sm text-gray-400">
          Explore upcoming showtimes across all cinema halls and reserve your seats
        </p>
      </div>

      {/* Filter Section */}
      <div className="bg-gray-800/80 backdrop-blur border border-gray-700 rounded-xl p-5 mb-8 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Movie filter */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Filter by Movie</label>
            <select
              value={selectedMovieId}
              onChange={(e) => setSelectedMovieId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Movies</option>
              {movies.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          {/* Theatre filter */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Filter by Theatre</label>
            <select
              value={selectedTheatreId}
              onChange={(e) => setSelectedTheatreId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Theatres</option>
              {theatres.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.location})
                </option>
              ))}
            </select>
          </div>

          {/* Date filter */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Show Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 pt-3 border-t border-gray-700/60 flex items-center justify-between text-xs">
            <span className="text-gray-400">Filtering results</span>
            <button
              onClick={handleClearFilters}
              className="text-blue-400 hover:text-blue-300 hover:underline font-medium cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {loading && <Spinner text="Loading shows..." />}

      {error && !loading && (
        <ErrorMessage message={error} onRetry={fetchShows} />
      )}

      {!loading && !error && shows.length === 0 && (
        <EmptyState
          icon="🕒"
          title="No Shows Available"
          description={
            hasActiveFilters
              ? 'No shows match your chosen filter criteria.'
              : 'There are currently no scheduled shows.'
          }
          actionText={hasActiveFilters ? 'Reset Filters' : undefined}
          onAction={hasActiveFilters ? handleClearFilters : undefined}
        />
      )}

      {!loading && !error && shows.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shows.map((show) => {
            const isScheduled = show.status === 'SCHEDULED';
            return (
              <div
                key={show.id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg hover:border-gray-500 hover:shadow-2xl transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-white text-lg line-clamp-1" title={show.movieTitle || 'Movie'}>
                      {show.movieTitle || `Movie #${show.movieId}`}
                    </h3>
                    <StatusBadge status={show.status} />
                  </div>

                  <p className="text-sm font-medium text-blue-400 mb-4 flex items-center gap-1.5">
                    <span>🏛️</span>
                    <span>{show.theatreName || `Theatre #${show.theatreId}`}</span>
                  </p>

                  <div className="space-y-2 text-sm text-gray-300 mb-6 bg-gray-900/40 p-3.5 rounded-lg border border-gray-700/50">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date:</span>
                      <span className="font-semibold text-white">{show.showDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time:</span>
                      <span className="font-semibold text-white">{show.showTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price per ticket:</span>
                      <span className="font-bold text-green-400">
                        ${typeof show.ticketPrice === 'number' ? show.ticketPrice.toFixed(2) : show.ticketPrice}
                      </span>
                    </div>
                  </div>
                </div>

                {isScheduled ? (
                  <Link
                    to={`/shows/${show.id}/seats`}
                    className="w-full text-center py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition shadow-md"
                  >
                    Select Seats
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full py-2.5 px-4 rounded-lg bg-gray-700 text-gray-500 font-medium text-sm cursor-not-allowed"
                  >
                    Not Available
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Shows;
