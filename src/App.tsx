import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ResourcesProvider } from "@/contexts/ResourcesContext";
import { AuthProvider } from "@/contexts/auth/AuthContext";
import { ThemeProvider } from "next-themes";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import PWAInstallBanner from "./components/PWAInstallBanner";

// Lazy load components for code splitting
const SearchResults = lazy(() => import("./pages/SearchResults"));
const ResourceDetail = lazy(() => import("./pages/ResourceDetail"));
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const UploadResource = lazy(() => import("./pages/UploadResource"));
const MyResources = lazy(() => import("./pages/MyResources"));

const queryClient = new QueryClient();

const App = () => {
  // Loading component for lazy loaded routes
  const LoadingComponent = () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ResourcesProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/search" element={
                  <Suspense fallback={<LoadingComponent />}>
                    <SearchResults />
                  </Suspense>
                } />
                <Route path="/category/:category" element={
                  <Suspense fallback={<LoadingComponent />}>
                    <SearchResults />
                  </Suspense>
                } />
                <Route path="/resource/:id" element={
                  <Suspense fallback={<LoadingComponent />}>
                    <ResourceDetail />
                  </Suspense>
                } />
                <Route path="/auth/login" element={
                  <Suspense fallback={<LoadingComponent />}>
                    <Login />
                  </Suspense>
                } />
                <Route path="/auth/signup" element={
                  <Suspense fallback={<LoadingComponent />}>
                    <Signup />
                  </Suspense>
                } />
                <Route path="/auth/forgot-password" element={
                  <Suspense fallback={<LoadingComponent />}>
                    <ForgotPassword />
                  </Suspense>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingComponent />}>
                      <Profile />
                    </Suspense>
                  </ProtectedRoute>
                } />
                <Route path="/upload" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingComponent />}>
                      <UploadResource />
                    </Suspense>
                  </ProtectedRoute>
                } />
                <Route path="/my-resources" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingComponent />}>
                      <MyResources />
                    </Suspense>
                  </ProtectedRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <PWAInstallBanner />
            </BrowserRouter>
          </TooltipProvider>
        </ResourcesProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
  );
};

export default App;
