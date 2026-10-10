import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  text,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-10 w-10 border-b-2',
    lg: 'h-14 w-14 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div
        className={`animate-spin rounded-full border-indigo-600 border-t-transparent ${sizeClasses[size]}`}
      />
      {text && (
        <span className="mt-3 text-sm font-medium text-gray-500 animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
};

export default Spinner;
