
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/hooks/useTheme";
import { CreditsProvider } from "@/contexts/CreditsContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import UploadPage from "@/pages/UploadPage";
import LoadingPage from "@/pages/LoadingPage";
import GalleryPage from "@/pages/GalleryPage";
import CampaignEvolution from "@/pages/CampaignEvolution";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <CreditsProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<ProtectedRoute><Navigate to="/upload" replace /></ProtectedRoute>} />
                <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
                <Route path="/loading" element={<ProtectedRoute><LoadingPage /></ProtectedRoute>} />
                <Route path="/gallery" element={<ProtectedRoute><GalleryPage /></ProtectedRoute>} />
                <Route path="/campaign-evolution" element={<ProtectedRoute><CampaignEvolution /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CreditsProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
