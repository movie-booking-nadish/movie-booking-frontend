import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Movie, Show } from '../types';
import { movieService } from '../services/movieService';
import { showService } from '../services/showService';
import StatusBadge from '../components/StatusBadge';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const movieId = Number(id);
        const [movieData, showsData] = await Promise.all([
          movieService.getById(movieId),
          showService.getByMovieId(movieId),
        ]);
        setMovie(movieData);
        setShows(showsData);
      } catch {
        setError('Failed to load movie details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p className="text-gray-400 text-sm">Loading movie details...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="p-8 bg-gray-800 rounded-xl border border-red-500/30 max-w-md mx-auto">
          <p className="text-red-400 mb-4">{error || 'Movie not found'}</p>
          <Link
            to="/movies"
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
          >
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/movies"
        className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-6 transition"
      >
        ← Back to Movies
      </Link>

      {/* Hero section */}
      <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-xl mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 sm:p-8">
          <div className="aspect-[2/3] rounded-xl overflow-hidden bg-gray-900 shadow-md">
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://placehold.co/400x600/1e293b/94a3b8?text=No+Poster';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                No Poster
              </div>
            )}
          </div>

          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{movie.title}</h1>
                <StatusBadge status={movie.status} />
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-300 mb-6">
                <span><strong className="text-gray-400">Language:</strong> {movie.language}</span>
                <span>•</span>
                <span><strong className="text-gray-400">Genre:</strong> {movie.genre}</span>
                <span>•</span>
                <span><strong className="text-gray-400">Duration:</strong> {movie.duration} minutes</span>
                {movie.releaseDate && (
                  <>
                    <span>•</span>
                    <span><strong className="text-gray-400">Release Date:</strong> {movie.releaseDate}</span>
                  </>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Overview
                </h3>
                <p className="text-gray-200 leading-relaxed text-base">
                  {movie.description || 'No description provided for this movie.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shows section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Scheduled Shows</h2>
        {shows.length === 0 ? (
          <div className="p-8 bg-gray-800/50 rounded-xl border border-gray-700 text-center">
            <span className="text-4xl block mb-2">🎟️</span>
            <p className="text-gray-300 font-medium">No shows scheduled yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Please check back later for upcoming screening dates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shows.map((show) => {
              const isScheduled = show.status === 'SCHEDULED';
              return (
                <div
                  key={show.id}
                  className="bg-gray-800 rounded-xl p-5 border border-gray-700 shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-white text-lg">
                          {show.theatreName || `Theatre #${show.theatreId}`}
                        </h3>
                        <p className="text-xs text-gray-400">Show ID: #{show.id}</p>
                      </div>
                      <StatusBadge status={show.status} />
                    </div>

                    <div className="space-y-1.5 text-sm text-gray-300 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Date:</span>
                        <span className="font-medium text-white">{show.showDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time:</span>
                        <span className="font-medium text-white">{show.showTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Ticket Price:</span>
                        <span className="font-semibold text-green-400">
                          ${typeof show.ticketPrice === 'number' ? show.ticketPrice.toFixed(2) : show.ticketPrice}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isScheduled ? (
                    <Link
                      to={`/shows/${show.id}/seats`}
                      className="w-full text-center py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition shadow"
                    >
                      Book Now
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2.5 px-4 rounded-lg bg-gray-700 text-gray-500 font-medium text-sm cursor-not-allowed"
                    >
                      Booking Unavailable
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
