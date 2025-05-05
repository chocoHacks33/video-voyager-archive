
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Create a no-operation toast implementation
const toast = {
  success: () => ({}),
  error: () => ({}),
  warning: () => ({}),
  info: () => ({}),
};

export { toast };
