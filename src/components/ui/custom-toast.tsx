
import React from 'react';
import { toast as sonnerToast } from 'sonner';
import { Check, X, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const ToastIcon = ({ type }: { type: ToastType }) => {
  const icons = {
    success: <Check className="h-5 w-5" />,
    error: <X className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  };

  const iconColors = {
    success: "bg-green-100 text-green-600 dark:bg-green-800/30 dark:text-green-400 ring-1 ring-green-200 dark:ring-green-800/60",
    error: "bg-red-100 text-red-600 dark:bg-red-800/30 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-800/60",
    warning: "bg-amber-100 text-amber-600 dark:bg-amber-800/30 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800/60",
    info: "bg-blue-100 text-blue-600 dark:bg-blue-800/30 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800/60",
  };

  return (
    <div className={cn("rounded-full p-2", iconColors[type])}>
      {icons[type]}
    </div>
  );
};

const toast = {
  success: (title: string, options?: ToastOptions) => {
    return sonnerToast.custom((id) => (
      <div className="group pointer-events-auto flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border border-green-200 bg-white/90 p-4 pr-6 shadow-lg backdrop-blur-sm dark:border-green-800/50 dark:bg-gray-900/90">
        <div className="flex items-start gap-3">
          <ToastIcon type="success" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</p>
            {options?.description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{options.description}</p>
            )}
          </div>
        </div>
        {options?.action && (
          <button 
            onClick={options.action.onClick} 
            className="ml-3 inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-green-200 bg-transparent px-3 text-sm font-medium text-green-600 ring-offset-background transition-colors hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950"
          >
            {options.action.label}
          </button>
        )}
      </div>
    ), {
      duration: options?.duration || 5000,
    });
  },
  
  error: (title: string, options?: ToastOptions) => {
    return sonnerToast.custom((id) => (
      <div className="group pointer-events-auto flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border border-red-200 bg-white/90 p-4 pr-6 shadow-lg backdrop-blur-sm dark:border-red-800/50 dark:bg-gray-900/90">
        <div className="flex items-start gap-3">
          <ToastIcon type="error" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</p>
            {options?.description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{options.description}</p>
            )}
          </div>
        </div>
        {options?.action && (
          <button 
            onClick={options.action.onClick} 
            className="ml-3 inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-red-200 bg-transparent px-3 text-sm font-medium text-red-600 ring-offset-background transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
          >
            {options.action.label}
          </button>
        )}
      </div>
    ), {
      duration: options?.duration || 5000,
    });
  },
  
  warning: (title: string, options?: ToastOptions) => {
    return sonnerToast.custom((id) => (
      <div className="group pointer-events-auto flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border border-amber-200 bg-white/90 p-4 pr-6 shadow-lg backdrop-blur-sm dark:border-amber-800/50 dark:bg-gray-900/90">
        <div className="flex items-start gap-3">
          <ToastIcon type="warning" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</p>
            {options?.description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{options.description}</p>
            )}
          </div>
        </div>
        {options?.action && (
          <button 
            onClick={options.action.onClick} 
            className="ml-3 inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-amber-200 bg-transparent px-3 text-sm font-medium text-amber-600 ring-offset-background transition-colors hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950"
          >
            {options.action.label}
          </button>
        )}
      </div>
    ), {
      duration: options?.duration || 5000,
    });
  },
  
  info: (title: string, options?: ToastOptions) => {
    return sonnerToast.custom((id) => (
      <div className="group pointer-events-auto flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border border-blue-200 bg-white/90 p-4 pr-6 shadow-lg backdrop-blur-sm dark:border-blue-800/50 dark:bg-gray-900/90">
        <div className="flex items-start gap-3">
          <ToastIcon type="info" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</p>
            {options?.description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{options.description}</p>
            )}
          </div>
        </div>
        {options?.action && (
          <button 
            onClick={options.action.onClick} 
            className="ml-3 inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-blue-200 bg-transparent px-3 text-sm font-medium text-blue-600 ring-offset-background transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950"
          >
            {options.action.label}
          </button>
        )}
      </div>
    ), {
      duration: options?.duration || 5000,
    });
  },
};

export { toast };
