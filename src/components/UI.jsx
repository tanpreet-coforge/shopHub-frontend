import React from 'react';

export const Badge = ({ children, variant = 'default', className = '', ...props }) => {
  const variants = {
    default: 'bg-gray-200 text-gray-800',
    primary: 'bg-amazon-blue text-white',
    success: 'bg-green-200 text-green-800',
    warning: 'bg-yellow-200 text-yellow-800',
    danger: 'bg-red-200 text-red-800',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export const Skeleton = ({ className = '' }) => {
  return (
    <div className={`bg-gray-300 animate-pulse rounded-lg ${className}`} />
  );
};

export const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className={`bg-white rounded-xl shadow-xl max-w-md w-full mx-4 relative z-10 ${className}`}>
        {title && (
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
};
