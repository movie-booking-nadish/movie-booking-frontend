import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import { Booking, Payment, PaymentMethod } from '../types';
import StatusBadge from '../components/StatusBadge';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

const PaymentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const bookingId = Number(id);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [existingPayment, setExistingPayment] = useState<Payment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARD');
  const [loading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<Payment | null>(null);

  useEffect(() => {
    if (bookingId) {
      loadData();
    }
  }, [bookingId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const bookingData = await bookingService.getById(bookingId);
      setBooking(bookingData);

      try {
        const paymentData = await paymentService.getByBookingId(bookingId);
        if (paymentData) {
          setExistingPayment(paymentData);
          setPaymentResult(paymentData);
        }
      } catch {
        // No existing payment record, allow creating new payment
        setExistingPayment(null);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load booking details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (simulateSuccess: boolean = true) => {
    if (!booking) return;

    try {
      setProcessing(true);
      setError(null);

      // Step 1: Create payment record if none exists
      let paymentRecord = existingPayment;
      if (!paymentRecord) {
        paymentRecord = await paymentService.create({
          bookingId: booking.id,
          paymentMethod,
        });
      }

      // Step 2: Process payment with success flag
      const processedPayment = await paymentService.processPayment(paymentRecord.id, simulateSuccess);
      setPaymentResult(processedPayment);
      setExistingPayment(processedPayment);

      // Refresh booking to reflect new status (CONFIRMED or PENDING)
      const updatedBooking = await bookingService.getById(booking.id);
      setBooking(updatedBooking);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleRetry = () => {
    setPaymentResult(null);
    setError(null);
  };

  if (loading) {
    return <Spinner text="Loading payment details..." className="min-h-[60vh]" />;
  }

  if (error && !booking) {
    return (
      <div className="max-w-xl mx-auto my-12 text-center">
        <ErrorMessage message={error} />
        <Link
          to="/my-bookings"
          className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-semibold"
        >
          Back to My Bookings
        </Link>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb / Back button */}
      <div className="mb-6">
        <Link
          to="/my-bookings"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
        >
          ← Back to My Bookings
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-700 to-indigo-900 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold">Booking Payment</h1>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
              Booking #{booking.id}
            </span>
          </div>
          <p className="text-indigo-200 text-sm mt-1">Complete your transaction to confirm reserved seats</p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center justify-between">
              <span>⚠️ {error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-500 font-bold ml-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Booking Summary Card */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
              Booking Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block text-xs">Movie</span>
                <span className="font-bold text-gray-900 text-base">{booking.movieTitle || 'Movie'}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Theatre</span>
                <span className="font-semibold text-gray-800">{booking.theatreName || 'Theatre'}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Show Date & Time</span>
                <span className="font-semibold text-gray-800">
                  {booking.showDate} at {booking.showTime}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Selected Seats ({booking.numberOfTickets})</span>
                <span className="font-bold text-indigo-600">
                  {booking.seatNumbers ? booking.seatNumbers.join(', ') : 'None'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Booking Status</span>
                <div className="mt-1">
                  <StatusBadge status={booking.status} />
                </div>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Total Amount</span>
                <span className="font-extrabold text-lg text-emerald-600">
                  Rs. {Number(booking.totalAmount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Status Result View (if already processed or completed) */}
          {paymentResult ? (
            <div
              className={`rounded-xl p-6 text-center border ${
                paymentResult.status === 'COMPLETED'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : paymentResult.status === 'FAILED'
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="text-4xl mb-3">
                {paymentResult.status === 'COMPLETED'
                  ? '🎉'
                  : paymentResult.status === 'FAILED'
                  ? '❌'
                  : '⏳'}
              </div>
              <h3 className="text-lg font-bold">
                Payment {paymentResult.status}
              </h3>
              <p className="text-sm mt-1 mb-4 opacity-90">
                {paymentResult.status === 'COMPLETED'
                  ? 'Your payment was processed successfully and your booking is confirmed!'
                  : paymentResult.status === 'FAILED'
                  ? 'The payment transaction could not be processed.'
                  : 'Your payment is currently being processed.'}
              </p>

              <div className="inline-block bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 text-xs font-medium space-y-1 text-gray-700 mb-6">
                <div>Payment ID: #{paymentResult.id}</div>
                <div>Method: {paymentResult.paymentMethod}</div>
                <div>Amount Paid: Rs. {Number(paymentResult.amount).toFixed(2)}</div>
                {paymentResult.paymentDate && (
                  <div>Date: {new Date(paymentResult.paymentDate).toLocaleString()}</div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {paymentResult.status === 'FAILED' && (
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition shadow-sm cursor-pointer"
                  >
                    🔄 Retry Payment
                  </button>
                )}
                <Link
                  to="/my-bookings"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
                >
                  View My Bookings
                </Link>
                <Link
                  to="/movies"
                  className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-sm font-semibold transition"
                >
                  Browse More Movies
                </Link>
              </div>
            </div>
          ) : (
            /* Payment Form */
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'CARD', label: 'Credit / Debit Card', icon: '💳' },
                    { id: 'ONLINE', label: 'Online Banking', icon: '🏦' },
                    { id: 'CASH', label: 'Pay at Counter', icon: '💵' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                      className={`p-4 rounded-xl border-2 text-left flex flex-col justify-between transition cursor-pointer ${
                        paymentMethod === method.id
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <span className="text-2xl mb-2">{method.icon}</span>
                      <span className="text-sm font-bold text-gray-900">{method.label}</span>
                      <span className="text-xs text-gray-500 mt-0.5">{method.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  disabled={processing}
                  onClick={() => handlePay(true)}
                  className="flex-1 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay Rs. {Number(booking.totalAmount).toFixed(2)}</span>
                      <span>→</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={processing}
                  onClick={() => handlePay(false)}
                  className="py-3 px-4 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 font-semibold rounded-xl transition disabled:opacity-50 cursor-pointer text-xs flex items-center justify-center gap-1.5"
                  title="Simulates payment rejection (POST /api/payments/{id}/process?success=false)"
                >
                  <span>⚠️</span>
                  <span>Simulate Failed Payment</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
