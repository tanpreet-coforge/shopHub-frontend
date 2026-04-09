import React from 'react';

export const Input = React.forwardRef(
  ({ label, error, helperText, icon: Icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon size={18} />
            </span>
          )}
          <input
            ref={ref}
            className={`w-full px-4 py-2.5 ${Icon ? 'pl-10' : ''} border-2 rounded-lg transition ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-gray-300 focus:border-amazon-orange focus:ring-2 focus:ring-orange-200'
            } outline-none`}
            {...props}
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        {helperText && !error && <p className="text-gray-500 text-sm mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const Textarea = React.forwardRef(
  ({ label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full px-4 py-2.5 border-2 rounded-lg transition resize-none ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-gray-300 focus:border-amazon-orange focus:ring-2 focus:ring-orange-200'
          } outline-none`}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        {helperText && !error && <p className="text-gray-500 text-sm mt-1">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
