
import { toast as sonnerToast } from "sonner";

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Create a toast object that implements only the necessary functionality
const toast = {
  success: (message: string, options?: ToastOptions) => {
    // Only show toasts for specific scenarios
    if (
      message.includes("Login successful") ||
      message.includes("Campaign launched") ||
      message.includes("Loaded evolution data") || 
      message.includes("Mutation") ||
      message.includes("Morphing complete")
    ) {
      return sonnerToast.success(message, options);
    }
    return {};
  },
  error: () => ({}),
  warning: () => ({}),
  info: () => ({})
};

export { toast };
