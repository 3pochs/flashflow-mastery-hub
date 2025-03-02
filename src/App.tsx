
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ThemeProvider } from "./hooks/useTheme";

import Index from "./pages/Index";
import DecksPage from "./pages/DecksPage";
import CreatePage from "./pages/CreatePage";
import StudyPage from "./pages/StudyPage";
import NotFound from "./pages/NotFound";
import DemoPage from "./pages/DemoPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import CommunityPage from "./pages/CommunityPage";
import ProfilePage from "./pages/ProfilePage";
import FriendsPage from "./pages/FriendsPage";
import PrivateRoute from "./components/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/community" element={<CommunityPage />} />
              
              {/* Protected Routes */}
              <Route path="/decks" element={<PrivateRoute><DecksPage /></PrivateRoute>} />
              <Route path="/create" element={<PrivateRoute><CreatePage /></PrivateRoute>} />
              <Route path="/decks/:deckId" element={<PrivateRoute><StudyPage /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
              <Route path="/friends" element={<PrivateRoute><FriendsPage /></PrivateRoute>} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
