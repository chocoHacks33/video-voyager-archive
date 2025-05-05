
// Create empty implementations that don't do anything
const useToast = () => {
  return {
    toasts: [],
    toast: () => ({}),
    dismiss: () => {},
  };
};

const toast = () => ({});

export { useToast, toast };
