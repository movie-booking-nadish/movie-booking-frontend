import React from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../types';
import StatusBadge from './StatusBadge';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg hover:border-gray-500 hover:shadow-2xl transition duration-300 flex flex-col">
      <div className="relative aspect-[2/3] w-full bg-gray-900 overflow-hidden">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://placehold.co/400x600/1e293b/94a3b8?text=No+Poster';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 p-4">
            <span className="text-4xl mb-2">🎬</span>
            <span className="text-sm">No Poster Available</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <StatusBadge status={movie.status} />
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white line-clamp-1 mb-1" title={movie.title}>
            {movie.title}
          </h3>
          <p className="text-xs text-gray-400 mb-2">
            {movie.language} • {movie.genre} • {movie.duration} mins
          </p>
          {movie.description && (
            <p className="text-sm text-gray-300 line-clamp-2 mb-4">
              {movie.description}
            </p>
          )}
        </div>

        <Link
          to={`/movies/${movie.id}`}
          className="w-full block text-center py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition duration-150 shadow-md"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
