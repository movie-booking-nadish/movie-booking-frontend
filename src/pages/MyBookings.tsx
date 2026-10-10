import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { Booking } from '../types';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Cancel dialog state
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState<boolean>(false);
  const [cancelling, setCancelling] = useState<boolean>(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCancelDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;
    try {
      setCancelling(true);
      await bookingService.cancel(selectedBooking.id);
      setFeedback({
        type: 'success',
        message: `Booking #${selectedBooking.id} for "${selectedBooking.movieTitle || 'Movie'}" has been successfully cancelled.`,
      });
      setIsCancelDialogOpen(false);
      setSelectedBooking(null);
      await fetchBookings();
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || `Failed to cancel booking #${selectedBooking.id}.`,
      });
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <Spinner text="Loading your bookings..." className="min-h-[60vh]" />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchBookings} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">My Bookings</h1>
          <p className="text-gray-500 mt-1">View your movie reservations and booking history</p>
        </div>
        <Link
          to="/movies"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 shadow-sm transition"
        >
          Book More Tickets
        </Link>
      </div>

      {feedback && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center justify-between ${
            feedback.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{feedback.type === 'success' ? '✅' : '❌'}</span>
            <p className="text-sm font-medium">{feedback.message}</p>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-sm font-semibold opacity-70 hover:opacity-100 cursor-pointer ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {bookings.length === 0 ? (
        <EmptyState
          icon="🎟️"
          title="No Bookings Found"
          description="You haven't made any ticket bookings yet. Explore our current movie listings!"
          actionText="Explore Movies"
          actionLink="/movies"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => {
            const isCancelled = booking.status === 'CANCELLED';
            const isPending = booking.status === 'PENDING';

            return (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-bold text-lg text-gray-900 leading-snug line-clamp-1">
                      {booking.movieTitle || 'Movie Booking'}
                    </h3>
                    <StatusBadge status={booking.status} />
                  </div>

                  <p className="text-sm text-gray-600 flex items-center gap-1.5 mb-2">
                    <span>🏛️</span>
                    <span>{booking.theatreName || 'Theatre'}</span>
                  </p>

                  <p className="text-xs text-gray-500 flex items-center gap-2 mb-4">
                    <span>📅 {booking.showDate}</span>
                    <span>•</span>
                    <span>⏰ {booking.showTime}</span>
                  </p>

                  <div className="bg-gray-50 rounded-lg p-3 text-xs space-y-1.5 mb-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Seats:</span>
                      <span className="font-semibold text-gray-800">
                        {booking.seatNumbers ? booking.seatNumbers.join(', ') : 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tickets:</span>
                      <span className="font-semibold text-gray-800">{booking.numberOfTickets}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Total:</span>
                      <span className="font-bold text-indigo-600">
                        Rs. {Number(booking.totalAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  {/* Action Buttons: Pay Now & Cancel */}
                  <div className="flex items-center gap-2 mb-3">
                    {isPending && (
                      <Link
                        to={`/bookings/${booking.id}/payment`}
                        className="flex-1 text-center py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                      >
                        💳 Pay Now
                      </Link>
                    )}
                    {!isCancelled && (
                      <button
                        type="button"
                        onClick={() => handleOpenCancelDialog(booking)}
                        className={`text-center py-2 px-3 text-xs font-semibold rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition cursor-pointer ${
                          isPending ? 'flex-1' : 'w-full'
                        }`}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs text-gray-400">
                    <span>ID: #{booking.id}</span>
                    {booking.bookingDate && (
                      <span>Booked: {new Date(booking.bookingDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isCancelDialogOpen}
        title="Cancel Booking"
        message={`Are you sure you want to cancel booking #${selectedBooking?.id} for "${selectedBooking?.movieTitle || 'this movie'}"? Your booked seats (${selectedBooking?.seatNumbers?.join(', ')}) will be released.`}
        confirmText="Yes, Cancel Booking"
        cancelText="Keep Booking"
        isDanger={true}
        isLoading={cancelling}
        onConfirm={handleConfirmCancel}
        onClose={() => {
          if (!cancelling) {
            setIsCancelDialogOpen(false);
            setSelectedBooking(null);
          }
        }}
      />
    </div>
  );
};

export default MyBookings;
