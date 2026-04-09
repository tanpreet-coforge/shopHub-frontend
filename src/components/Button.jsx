import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition duration-200 inline-flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-amazon-orange text-black hover:bg-orange-600 disabled:bg-orange-300',
    secondary: 'bg-amazon-blue text-white hover:bg-blue-700 disabled:bg-blue-300',
    outline: 'border-2 border-amazon-orange text-amazon-orange hover:bg-orange-50 disabled:border-orange-300 disabled:text-orange-300',
    ghost: 'text-gray-700 hover:bg-gray-100 disabled:text-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="inline-block animate-spin">⏳</span>}
      {children}
    </button>
  );
};
