import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
  // Movie Statuses
  NOW_SHOWING: { label: 'Now Showing', bg: 'bg-green-900/60', text: 'text-green-300', border: 'border-green-600' },
  UPCOMING: { label: 'Upcoming', bg: 'bg-blue-900/60', text: 'text-blue-300', border: 'border-blue-600' },
  ENDED: { label: 'Ended', bg: 'bg-gray-800', text: 'text-gray-400', border: 'border-gray-600' },

  // Theatre Statuses
  ACTIVE: { label: 'Active', bg: 'bg-green-900/60', text: 'text-green-300', border: 'border-green-600' },
  INACTIVE: { label: 'Inactive', bg: 'bg-red-900/60', text: 'text-red-300', border: 'border-red-600' },

  // Show Statuses
  SCHEDULED: { label: 'Scheduled', bg: 'bg-blue-900/60', text: 'text-blue-300', border: 'border-blue-600' },
  COMPLETED: { label: 'Completed', bg: 'bg-gray-800', text: 'text-gray-400', border: 'border-gray-600' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-red-900/60', text: 'text-red-300', border: 'border-red-600' },

  // Booking & Payment Statuses
  PENDING: { label: 'Pending', bg: 'bg-yellow-900/60', text: 'text-yellow-300', border: 'border-yellow-600' },
  CONFIRMED: { label: 'Confirmed', bg: 'bg-green-900/60', text: 'text-green-300', border: 'border-green-600' },
  FAILED: { label: 'Failed', bg: 'bg-red-900/60', text: 'text-red-300', border: 'border-red-600' },
  REFUNDED: { label: 'Refunded', bg: 'bg-purple-900/60', text: 'text-purple-300', border: 'border-purple-600' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const normalized = status ? status.toUpperCase() : '';
  const config = statusConfig[normalized] || {
    label: status,
    bg: 'bg-gray-800',
    text: 'text-gray-300',
    border: 'border-gray-600',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
