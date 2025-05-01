
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/animations.css'
import { Toaster } from 'sonner'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster 
      position="top-right" 
      richColors 
      closeButton
      toastOptions={{
        className: "rounded-lg border border-indigo-100 dark:border-indigo-900 shadow-lg",
        style: {
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)"
        }
      }}
    />
  </React.StrictMode>,
)
