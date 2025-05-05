
import { toast as sonnerToast } from "sonner";

// Create a wrapper with the same interface
const useToast = () => {
  return {
    toast: (props?: any) => sonnerToast(props),
    dismiss: (toastId?: string) => sonnerToast.dismiss(toastId),
    toasts: []
  };
};

// Create a toast function that only works for specific scenarios
const toast = (props?: any) => {
  return sonnerToast(props);
};

export { useToast, toast };
