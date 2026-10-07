import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import { movieService } from '../services/movieService';
import MovieCard from '../components/MovieCard';

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await movieService.getAll();
      setMovies(data);
    } catch {
      setError('Failed to load movies. Please check your network or try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Movies</h1>
        <p className="mt-2 text-sm text-gray-400">
          Discover current screenings and upcoming movie releases
        </p>
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
          <p className="text-gray-400 text-sm mt-1">There are currently no movies available.</p>
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
