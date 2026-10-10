import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { paymentService } from '../services/paymentService';
import { Payment } from '../types';
import StatusBadge from '../components/StatusBadge';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentService.getAll();
      setPayments(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch payments.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      String(p.id).includes(searchTerm) ||
      String(p.bookingId).includes(searchTerm) ||
      p.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Payment Transactions</h1>
          <p className="text-gray-500 mt-1">Audit customer payment logs, transaction amounts, and gateway statuses</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/bookings"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-lg border border-indigo-200 transition shadow-xs"
          >
            <span>🎟️</span>
            <span>← Manage Bookings</span>
          </Link>
          <button
            onClick={fetchPayments}
            className="px-3.5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer shadow-xs"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            placeholder="Search by Payment ID, Booking ID, Method..."
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
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <Spinner text="Loading payments..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchPayments} />
      ) : filteredPayments.length === 0 ? (
        <EmptyState
          icon="💳"
          title="No Payments Found"
          description={
            searchTerm || statusFilter !== 'ALL'
              ? 'No payments match your filter criteria.'
              : 'No payment transactions recorded yet.'
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
                  <th className="px-6 py-4">Payment ID</th>
                  <th className="px-6 py-4">Booking Ref</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Payment Method</th>
                  <th className="px-6 py-4">Payment Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition">
                    <td className="px-6 py-4 font-mono font-bold text-xs text-gray-500">
                      #{p.id}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to="/admin/bookings"
                        className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline"
                      >
                        Booking #{p.bookingId}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-emerald-600">
                      Rs. {Number(p.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
                        {p.paymentMethod === 'CARD'
                          ? '💳 Card'
                          : p.paymentMethod === 'ONLINE'
                          ? '🏦 Online'
                          : '💵 Cash'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {p.paymentDate ? new Date(p.paymentDate).toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
