'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import AppointmentList from '@/components/appointments/AppointmentList';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AppointmentsPage() {
  const { authState } = useAuth();
  const { user, isAuthenticated, isLoading } = authState;
  const [showPastAppointments, setShowPastAppointments] = useState(false);
  const [localAuth, setLocalAuth] = useState(false);
  const router = useRouter();
  
  // Direct localStorage check for auth as a fallback
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        setLocalAuth(true);
      } else if (!token) {
        // If no token found, redirect to home page
        router.push('/');
      }
    };
    
    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Wait for both context auth and local auth check to complete
  if (!isLoading && !isAuthenticated && !localAuth) {
    // Use router for consistent navigation
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Appointments</h1>
          
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setShowPastAppointments(!showPastAppointments)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              {showPastAppointments ? 'Show Upcoming' : 'Show Past'}
            </button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <AppointmentList 
            userId={user?.id} 
            showPastAppointments={showPastAppointments} 
          />
        </div>
      </main>
    </div>
  );
} 