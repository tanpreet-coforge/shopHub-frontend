import React from 'react';

export const Card = ({ children, className = '', hoverable = false, ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md ${hoverable ? 'hover:shadow-xl transition duration-300 hover:-translate-y-1' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 bg-gray-50 rounded-b-xl ${className}`} {...props}>
    {children}
  </div>
);
