import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showService } from '../services/showService';
import { Show } from '../types';
import { SeatMap } from '../components/SeatMap';

const BookShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [show, setShow] = useState<Show | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchShow = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await showService.getById(Number(id));
        setShow(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load show details.');
      } finally {
        setLoading(false);
      }
    };
    fetchShow();
  }, [id]);

  const handleSeatToggle = (seatLabel: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatLabel)
        ? prev.filter((s) => s !== seatLabel)
        : [...prev, seatLabel].sort()
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600 font-medium">Loading booking information...</span>
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 bg-red-50 text-red-700 rounded-xl text-center">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p className="mb-4">{error || 'Show not found'}</p>
        <button
          onClick={() => navigate('/shows')}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Back to Shows
        </button>
      </div>
    );
  }

  const ticketPrice = show.ticketPrice || 0;
  const numberOfTickets = selectedSeats.length;
  const totalAmount = numberOfTickets * ticketPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Show header summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 mb-2">
              Book Tickets
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{show.movieTitle}</h1>
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              <span>🏛️ {show.theatreName}</span>
              <span>•</span>
              <span>📅 {show.showDate}</span>
              <span>•</span>
              <span>⏰ {show.showTime}</span>
            </p>
          </div>
          <div className="text-left md:text-right border-t md:border-t-0 pt-4 md:pt-0">
            <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold block">Ticket Price</span>
            <span className="text-2xl font-bold text-indigo-600">Rs. {ticketPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Seat Map (2 cols on desktop) */}
        <div className="lg:col-span-2">
          <SeatMap
            showId={show.id}
            selectedSeats={selectedSeats}
            onSeatToggle={handleSeatToggle}
            maxSeats={10}
          />
        </div>

        {/* Live Booking Summary Panel (1 col on desktop) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-4 mb-4">Booking Summary</h2>

          <div className="space-y-4 text-sm">
            <div>
              <span className="text-gray-500 block mb-1">Selected Seats:</span>
              {selectedSeats.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat}
                      className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-semibold rounded-md border border-indigo-200 text-xs"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">No seats selected yet</p>
              )}
            </div>

            <div className="flex justify-between items-center py-2 border-t border-gray-100">
              <span className="text-gray-500">Number of tickets:</span>
              <span className="font-semibold text-gray-800">{numberOfTickets}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-t border-gray-100">
              <span className="text-gray-500">Price per ticket:</span>
              <span className="text-gray-800 font-medium">Rs. {ticketPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-t border-b border-gray-200">
              <span className="text-base font-bold text-gray-900">Total Amount:</span>
              <span className="text-xl font-extrabold text-indigo-600">
                Rs. {totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookShow;
