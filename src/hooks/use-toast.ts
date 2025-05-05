
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

// Create noop (no operation) versions of all functions
function toast() {
  return {
    id: "",
    dismiss: () => {},
    update: () => {},
  }
}

function useToast() {
  return {
    toasts: [],
    toast,
    dismiss: () => {},
  }
}

export { useToast, toast }
