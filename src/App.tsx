import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "@/components/ui/Login"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App: React.FC = () => {
  useEffect(() => {
    const trackUserLocation = async () => {
      const storedEmail = localStorage.getItem('email');
      
      if (!storedEmail) {
        console.log('No email stored. Skipping location tracking.');
        return;
      }

      if (!navigator.geolocation) {
        console.error('Geolocation is not supported by this browser.');
        return;
      }

      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });

        const { latitude, longitude } = position.coords;

        const response = await fetch('http://35.171.153.248/insert_tracker', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email_id: storedEmail,
            lat: latitude,
            lng: longitude,
            radius: 100
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to send location data: ${response.status}`);
        }

        console.log('Location tracked successfully');
      } catch (error) {
        console.error('Error tracking location:', error);
      }
    };

    // Initial tracking
    trackUserLocation();

    // Periodic tracking
    const intervalId = setInterval(trackUserLocation, 2 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const storedEmail = localStorage.getItem('email');
    return storedEmail ? <>{children}</> : <Navigate to="/" replace />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
