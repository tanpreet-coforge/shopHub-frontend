import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToast } from '../hooks/useToast';

const toastStyles = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: CheckCircle,
    iconColor: 'text-green-500',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: AlertCircle,
    iconColor: 'text-red-500',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: Info,
    iconColor: 'text-blue-500',
  },
};

export const Toast = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => {
        const style = toastStyles[toast.type] || toastStyles.info;
        const Icon = style.icon;

        return (
          <div
            key={toast.id}
            className={`${style.bg} ${style.border} border rounded-lg p-4 shadow-md flex items-center gap-3 animate-slideIn max-w-md pointer-events-auto`}
          >
            <Icon className={`${style.iconColor} flex-shrink-0`} size={20} />
            <p className={`${style.text} flex-1 text-sm`}>{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className={`${style.text} hover:opacity-70 transition flex-shrink-0`}
            >
              <X size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
