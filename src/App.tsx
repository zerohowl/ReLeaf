import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Upload from "./pages/Upload";
import History from "./pages/History";
import Leaderboard from "./pages/Leaderboard";
import Streaks from "./pages/Streaks";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
// Temporarily disabled due to React hook context issues
// import ChatAssistant from "./components/assistant/ChatAssistant";
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/history" element={<History />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/streaks" element={<Streaks />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
          {/* ChatAssistant temporarily disabled due to React hook issues */}
          {/* <ChatAssistant /> */}
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
