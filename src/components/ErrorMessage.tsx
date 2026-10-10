import React from 'react';

interface ErrorMessageProps {
  message: string;
  title?: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  title = 'Something went wrong',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`max-w-xl mx-auto my-8 p-6 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-center shadow-xs ${className}`}
    >
      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
        ⚠️
      </div>
      <h3 className="text-base font-bold text-red-900 mb-1">{title}</h3>
      <p className="text-sm text-red-700 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
