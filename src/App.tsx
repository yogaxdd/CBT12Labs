import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TestsPage from "./pages/TestsPage";
import TestPage from "./pages/TestPage";
import ResultsPage from "./pages/Results";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode;
  requiredRole?: 'admin' | 'student';
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  // Show loading or redirect if not authenticated
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If role is required and user doesn't have it, redirect
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<Login />} />
    
    {/* Admin routes */}
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute requiredRole="admin">
          <Dashboard />
        </ProtectedRoute>
      } 
    />
    
    {/* Student routes */}
    <Route 
      path="/tests" 
      element={
        <ProtectedRoute>
          <TestsPage />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/test/:id" 
      element={
        <ProtectedRoute>
          <TestPage />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/results" 
      element={
        <ProtectedRoute>
          <ResultsPage />
        </ProtectedRoute>
      } 
    />
    
    {/* Catch-all route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
          <Sonner />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;