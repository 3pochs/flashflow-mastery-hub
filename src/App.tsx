
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import DecksPage from "./pages/DecksPage";
import CreatePage from "./pages/CreatePage";
import StudyPage from "./pages/StudyPage";
import NotFound from "./pages/NotFound";
import DemoPage from "./pages/DemoPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import CommunityPage from "./pages/CommunityPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/decks" element={<DecksPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/decks/:deckId" element={<StudyPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/community" element={<CommunityPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
