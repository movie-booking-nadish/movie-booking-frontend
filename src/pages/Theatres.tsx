import React, { useState, useEffect } from 'react';
import { Theatre } from '../types';
import { theatreService } from '../services/theatreService';
import StatusBadge from '../components/StatusBadge';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const Theatres: React.FC = () => {
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTheatres = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await theatreService.getAll();
      setTheatres(data);
    } catch {
      setError('Failed to load theatres. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheatres();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Cinema Theatres</h1>
        <p className="mt-2 text-sm text-gray-400">
          Find comfortable cinema halls and modern screening facilities near you
        </p>
      </div>

      {loading && <Spinner text="Loading theatres..." />}

      {error && !loading && (
        <ErrorMessage message={error} onRetry={fetchTheatres} />
      )}

      {!loading && !error && theatres.length === 0 && (
        <EmptyState
          icon="🏛️"
          title="No Theatres Available"
          description="There are currently no theatres listed in the system."
        />
      )}

      {!loading && !error && theatres.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {theatres.map((theatre) => (
            <div
              key={theatre.id}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg hover:border-gray-500 hover:shadow-2xl transition duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-900/50 border border-blue-700 flex items-center justify-center text-xl">
                      🏛️
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight">
                        {theatre.name}
                      </h3>
                      <p className="text-xs text-gray-400">ID: #{theatre.id}</p>
                    </div>
                  </div>
                  <StatusBadge status={theatre.status} />
                </div>

                <div className="space-y-3 pt-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📍</span>
                    <span className="font-medium text-white">{theatre.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">💺</span>
                    <span>
                      Total Capacity: <strong className="text-blue-400">{theatre.capacity}</strong> seats
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700/60 flex items-center justify-between text-xs text-gray-400">
                <span>10 seats per row layout</span>
                <span className="text-green-400 font-medium">Dolby Atmos Audio</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Theatres;
