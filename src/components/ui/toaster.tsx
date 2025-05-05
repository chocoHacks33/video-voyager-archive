
"use client";

import { Toaster as Sonner } from "sonner";
import { useTheme } from "@/hooks/useTheme";

export function Toaster() {
  const { theme } = useTheme();
  
  return (
    <Sonner 
      position="bottom-right"
      theme={theme}
      toastOptions={{
        style: { 
          background: theme === "dark" ? "hsl(240, 10%, 10%)" : "hsl(var(--background))",
          color: theme === "dark" ? "hsl(210, 40%, 98%)" : "hsl(var(--foreground))",
          border: theme === "dark" 
            ? "1px solid hsl(240, 3.7%, 15.9%)" 
            : "1px solid hsl(var(--border))",
          boxShadow: theme === "dark" 
            ? "0 8px 16px rgba(0, 0, 0, 0.4)" 
            : "0 4px 12px rgba(0, 0, 0, 0.1)"
        }
      }}
    />
  );
}
