import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { Booking, BookingStatus } from '../types';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const ManageBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Cancel Dialog state
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState<boolean>(false);
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState<boolean>(false);

  // Updating status state
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.getAll();
      setBookings(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: BookingStatus) => {
    try {
      setUpdatingId(id);
      await bookingService.updateStatus(id, newStatus);
      setFeedback({ type: 'success', message: `Booking #${id} status changed to ${newStatus}.` });
      await fetchBookings();
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || `Failed to update status for booking #${id}.`,
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const openCancelDialog = (booking: Booking) => {
    setCancellingBooking(booking);
    setIsCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingBooking) return;

    try {
      setCancelling(true);
      await bookingService.cancel(cancellingBooking.id);
      setFeedback({
        type: 'success',
        message: `Booking #${cancellingBooking.id} has been cancelled and seats released.`,
      });
      setIsCancelDialogOpen(false);
      setCancellingBooking(null);
      await fetchBookings();
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || `Failed to cancel booking #${cancellingBooking.id}.`,
      });
      setIsCancelDialogOpen(false);
    } finally {
      setCancelling(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      (b.movieTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.userFullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.theatreName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(b.id).includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Navigation to Payments */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Manage Bookings</h1>
          <p className="text-gray-500 mt-1">
            Review customer reservations, modify booking statuses, and cancel tickets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/payments"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-lg border border-indigo-200 transition shadow-xs"
          >
            <span>💳</span>
            <span>View All Payments →</span>
          </Link>
          <button
            onClick={fetchBookings}
            className="px-3.5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer shadow-xs"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <span>{feedback.type === 'success' ? '✅' : '❌'}</span>
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-sm font-semibold opacity-70 hover:opacity-100 cursor-pointer ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            placeholder="Search by ID, customer, movie, theatre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-gray-600 whitespace-nowrap">Filter Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Main Table or Loading/Empty State */}
      {loading ? (
        <Spinner text="Loading bookings..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchBookings} />
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          icon="🎟️"
          title="No Bookings Found"
          description={
            searchTerm || statusFilter !== 'ALL'
              ? 'No bookings match your current search or status filter.'
              : 'No customer bookings have been created yet.'
          }
          actionText={searchTerm || statusFilter !== 'ALL' ? 'Clear Filters' : undefined}
          onAction={
            searchTerm || statusFilter !== 'ALL'
              ? () => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                }
              : undefined
          }
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Movie & Theatre</th>
                  <th className="px-6 py-4">Seats</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((booking) => {
                  const isCancelled = booking.status === 'CANCELLED';

                  return (
                    <tr key={booking.id} className="hover:bg-gray-50/70 transition">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-gray-500">
                        #{booking.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          {booking.userFullName || `User #${booking.userId || ''}`}
                        </div>
                        <div className="text-xs text-gray-400">
                          {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{booking.movieTitle || 'Movie'}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <span>🏛️ {booking.theatreName || 'Theatre'}</span>
                          <span>•</span>
                          <span>{booking.showDate} {booking.showTime}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">
                          {booking.seatNumbers ? booking.seatNumbers.join(', ') : 'None'}
                        </div>
                        <div className="text-xs text-gray-400">{booking.numberOfTickets} ticket(s)</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-600">
                        Rs. {Number(booking.totalAmount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={booking.status} />
                          {/* Inline Status Dropdown */}
                          <select
                            disabled={updatingId === booking.id}
                            value={booking.status}
                            onChange={(e) =>
                              handleStatusChange(booking.id, e.target.value as BookingStatus)
                            }
                            className="text-xs border border-gray-200 rounded px-1.5 py-1 bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!isCancelled && (
                          <button
                            onClick={() => openCancelDialog(booking)}
                            className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isCancelDialogOpen}
        title="Cancel Customer Booking"
        message={`Are you sure you want to cancel booking #${cancellingBooking?.id} for "${cancellingBooking?.userFullName || 'Customer'}"? This will release reserved seats and refund any associated payment.`}
        confirmText="Yes, Cancel Booking"
        cancelText="Keep Booking"
        isDanger={true}
        isLoading={cancelling}
        onConfirm={handleConfirmCancel}
        onClose={() => {
          if (!cancelling) {
            setIsCancelDialogOpen(false);
            setCancellingBooking(null);
          }
        }}
      />
    </div>
  );
};

export default ManageBookings;
