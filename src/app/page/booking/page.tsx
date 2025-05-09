'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import BookingFlow from '@/components/booking/BookingFlow';
import ThemeToggle from '@/components/ThemeToggle';
import axios from 'axios';

export default function BookingPage() {
  const { authState } = useAuth();
  const { user, isAuthenticated, isLoading } = authState;
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [businesses, setBusinesses] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get('/api/businesses');
        setBusinesses(response.data.result || []);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      } finally {
        setLoadingBusinesses(false);
      }
    };

    if (isAuthenticated) {
      fetchBusinesses();
    }
  }, [isAuthenticated]);

  if (isLoading || loadingBusinesses) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    window.location.href = '/page/login';
    return null;
  }

  const handleBookingComplete = () => {
    // Redirect to dashboard after successful booking
    window.location.href = '/page/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Book an Appointment</h1>
          <div className="flex items-center space-x-4">
            <a href="/page/dashboard" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              Back to Dashboard
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {selectedBusinessId ? (
          <BookingFlow />
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Select a Business</h2>
            
            {businesses.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No businesses available.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {businesses.map((business) => (
                  <div 
                    key={business.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedBusinessId(business.id)}
                  >
                    <h3 className="font-medium text-lg">{business.name}</h3>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
} 