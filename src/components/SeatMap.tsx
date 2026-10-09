import React, { useEffect, useState } from 'react';
import { showService } from '../services/showService';
import { SeatAvailability } from '../types';

interface SeatMapProps {
  showId: number;
  selectedSeats: string[];
  onSeatToggle: (seatNumber: string) => void;
  maxSeats?: number;
  refreshKey?: number;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  showId,
  selectedSeats,
  onSeatToggle,
  maxSeats = 10,
  refreshKey = 0,
}) => {
  const [availability, setAvailability] = useState<SeatAvailability | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSeats();
  }, [showId, refreshKey]);

  const fetchSeats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await showService.getSeatAvailability(showId);
      setAvailability(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load seat availability.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading seat layout...</span>
      </div>
    );
  }

  if (error || !availability) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center my-4">
        <p>{error || 'Seat information unavailable'}</p>
        <button
          onClick={fetchSeats}
          className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const seatsPerRow = availability.seatsPerRow || 10;
  const capacity = availability.capacity || 50;
  const totalRows = Math.ceil(capacity / seatsPerRow);
  const bookedSet = new Set(availability.bookedSeats || []);

  const handleSeatClick = (seatLabel: string) => {
    if (bookedSet.has(seatLabel)) return;

    if (!selectedSeats.includes(seatLabel) && selectedSeats.length >= maxSeats) {
      alert(`You can select a maximum of ${maxSeats} seats.`);
      return;
    }
    onSeatToggle(seatLabel);
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Screen bar */}
      <div className="w-full max-w-lg mx-auto mb-10 text-center">
        <div className="h-2 w-full bg-indigo-500 rounded-t-full shadow-md shadow-indigo-100 mb-2"></div>
        <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">SCREEN THIS WAY</p>
      </div>

      {/* Seat grid */}
      <div className="overflow-x-auto pb-4">
        <div className="inline-flex flex-col gap-3 min-w-[320px] mx-auto items-center w-full">
          {Array.from({ length: totalRows }).map((_, rowIndex) => {
            const rowChar = String.fromCharCode(65 + rowIndex); // A, B, C...
            return (
              <div key={rowChar} className="flex items-center gap-2">
                <span className="w-6 text-xs font-bold text-gray-400 text-center">{rowChar}</span>
                <div className="flex gap-2">
                  {Array.from({ length: seatsPerRow }).map((_, seatIndex) => {
                    const seatNum = seatIndex + 1;
                    const seatIndexTotal = rowIndex * seatsPerRow + seatNum;
                    if (seatIndexTotal > capacity) return null;

                    const seatLabel = `${rowChar}${seatNum}`;
                    const isBooked = bookedSet.has(seatLabel);
                    const isSelected = selectedSeats.includes(seatLabel);

                    let seatClasses =
                      'w-8 h-8 sm:w-9 sm:h-9 text-xs font-semibold rounded-lg flex items-center justify-center transition-all duration-150 ';

                    if (isBooked) {
                      seatClasses +=
                        'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-200';
                    } else if (isSelected) {
                      seatClasses +=
                        'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105 border border-indigo-600';
                    } else {
                      seatClasses +=
                        'bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 hover:border-indigo-300 cursor-pointer';
                    }

                    return (
                      <button
                        key={seatLabel}
                        type="button"
                        disabled={isBooked}
                        onClick={() => handleSeatClick(seatLabel)}
                        className={seatClasses}
                        title={`Seat ${seatLabel} - ${isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'}`}
                      >
                        {seatNum}
                      </button>
                    );
                  })}
                </div>
                <span className="w-6 text-xs font-bold text-gray-400 text-center">{rowChar}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center items-center gap-6 mt-8 pt-6 border-t border-gray-100 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gray-50 border border-gray-200"></div>
          <span className="text-gray-600 text-xs">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-indigo-600 border border-indigo-600 shadow-sm"></div>
          <span className="text-gray-600 text-xs">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gray-200 border border-gray-200"></div>
          <span className="text-gray-600 text-xs">Booked</span>
        </div>
      </div>
    </div>
  );
};
