import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: string | React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  actionLink?: string;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  description,
  actionText,
  onAction,
  actionLink,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-lg mx-auto shadow-xs ${className}`}
    >
      <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-1.5">{title}</h3>
      {description && <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">{description}</p>}

      {actionLink && actionText && (
        <Link
          to={actionLink}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs shadow-xs transition"
        >
          {actionText}
        </Link>
      )}

      {!actionLink && onAction && actionText && (
        <button
          onClick={onAction}
          type="button"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs shadow-xs transition cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
