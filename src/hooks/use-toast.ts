
import { toast as sonnerToast } from "sonner";

// Create a wrapper with the same interface
function toast(props?: any) {
  return sonnerToast(props);
}

function useToast() {
  return {
    toast: (props?: any) => sonnerToast(props),
    dismiss: (toastId?: string) => sonnerToast.dismiss(toastId),
    toasts: []
  };
}

export { useToast, toast };
