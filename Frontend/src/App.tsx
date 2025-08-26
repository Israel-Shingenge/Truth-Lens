import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/components/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import YouthVoicesHub from "./pages/YouthVoicesHub";
import CriticalThinkingZone from "./pages/CriticalThinkingZone";
import Resources from "./pages/Resources";
import InsightDashboard from "./pages/InsightDashboard";
import Account from "./pages/Account";
import Auth from "./pages/Auth";
import AdminPanel from "./pages/AdminPanel";
import CaseFiles from "./pages/CaseFiles";
import Quizzes from "./pages/Quizzes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
            <Route path="/youth-voices" element={<YouthVoicesHub />} />
            <Route path="/critical-thinking" element={<CriticalThinkingZone />} />
            <Route path="/case-files" element={<CaseFiles />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/resources" element={<Resources />} />
              <Route path="/insight-dashboard" element={<InsightDashboard />} />
              <Route path="/account" element={<Account />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<AdminPanel />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
