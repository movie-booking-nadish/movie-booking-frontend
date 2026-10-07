import React, { useState, useEffect, useCallback } from 'react';
import { Movie, MovieStatus } from '../types';
import { movieService } from '../services/movieService';
import MovieCard from '../components/MovieCard';

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState<MovieStatus | ''>('');

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await movieService.getAll({
        title: title.trim() || undefined,
        language: language || undefined,
        genre: genre || undefined,
        status: status || undefined,
      });
      setMovies(data);
    } catch {
      setError('Failed to load movies. Please check your network or try again.');
    } finally {
      setLoading(false);
    }
  }, [title, language, genre, status]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchMovies();
    }, 300);

    return () => clearTimeout(handler);
  }, [fetchMovies]);

  const handleClearFilters = () => {
    setTitle('');
    setLanguage('');
    setGenre('');
    setStatus('');
  };

  const hasActiveFilters = Boolean(title || language || genre || status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Movies</h1>
        <p className="mt-2 text-sm text-gray-400">
          Discover current screenings and upcoming movie releases
        </p>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-gray-800/80 backdrop-blur border border-gray-700 rounded-xl p-5 mb-8 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Title search */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Search Title</label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Search movies..."
                className="w-full pl-9 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
            </div>
          </div>

          {/* Language filter */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Languages</option>
              <option value="English">English</option>
              <option value="Sinhala">Sinhala</option>
              <option value="Tamil">Tamil</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>

          {/* Genre filter */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Genres</option>
              <option value="Action">Action</option>
              <option value="Adventure">Adventure</option>
              <option value="Comedy">Comedy</option>
              <option value="Drama">Drama</option>
              <option value="Horror">Horror</option>
              <option value="Romance">Romance</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Thriller">Thriller</option>
              <option value="Animation">Animation</option>
            </select>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as MovieStatus | '')}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="NOW_SHOWING">Now Showing</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="ENDED">Ended</option>
            </select>
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

      {loading && (
        <div className="min-h-[300px] flex flex-col items-center justify-center">
          <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-gray-400 text-sm">Loading movies...</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-6 bg-red-900/30 border border-red-500/50 rounded-xl text-center max-w-lg mx-auto">
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={fetchMovies}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && movies.length === 0 && (
        <div className="text-center py-16 bg-gray-800/40 rounded-xl border border-gray-700 max-w-md mx-auto">
          <span className="text-5xl block mb-3">🎬</span>
          <h3 className="text-lg font-semibold text-white">No Movies Found</h3>
          <p className="text-gray-400 text-sm mt-1">
            {hasActiveFilters
              ? 'No movies match your current search and filter criteria.'
              : 'There are currently no movies available.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {!loading && !error && movies.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;
