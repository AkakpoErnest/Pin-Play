'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

let toastId = 0;
const toasts: Toast[] = [];
const listeners: ((toasts: Toast[]) => void)[] = [];

const notify = (toast: Omit<Toast, 'id'>) => {
  const id = (++toastId).toString();
  const newToast = { ...toast, id };
  toasts.push(newToast);
  
  listeners.forEach((listener) => listener([...toasts]));
  
  // Auto remove after duration
  setTimeout(() => {
    const index = toasts.findIndex((t) => t.id === id);
    if (index > -1) {
      toasts.splice(index, 1);
      listeners.forEach((listener) => listener([...toasts]));
    }
  }, toast.duration || 5000);
};

export const toast = {
  success: (title: string, message?: string, duration?: number) =>
    notify({ type: 'success', title, message, duration }),
  error: (title: string, message?: string, duration?: number) =>
    notify({ type: 'error', title, message, duration }),
  info: (title: string, message?: string, duration?: number) =>
    notify({ type: 'info', title, message, duration }),
};

export function Toaster() {
  const [toastList, setToastList] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => setToastList(newToasts);
    listeners.push(listener);
    
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const removeToast = (id: string) => {
    const index = toasts.findIndex((t) => t.id === id);
    if (index > -1) {
      toasts.splice(index, 1);
      listeners.forEach((listener) => listener([...toasts]));
    }
  };

  if (toastList.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toastList.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

function ToastComponent({ 
  toast, 
  onRemove 
}: { 
  toast: Toast; 
  onRemove: (id: string) => void;
}) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
  };

  const Icon = icons[toast.type];

  return (
    <div className={`
      max-w-sm w-full ${colors[toast.type]} border rounded-lg shadow-lg p-4
      transform transition-all duration-300 ease-in-out
      animate-in slide-in-from-right-full
    `}>
      <div className="flex items-start space-x-3">
        <Icon className={`w-5 h-5 mt-0.5 ${iconColors[toast.type]}`} />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">
            {toast.title}
          </p>
          {toast.message && (
            <p className="text-sm opacity-90 mt-1">
              {toast.message}
            </p>
          )}
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
