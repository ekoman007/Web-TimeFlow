"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { UserRole } from '@/types';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { authState } = useAuth();
  const { user, isAuthenticated, isLoading } = authState;
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

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Wait for both context auth and local auth check to complete
  // Only redirect if we're sure the user is not authenticated
  if (!isLoading && !isAuthenticated && !localAuth) {
    // Use router for consistent navigation
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Book Appointment Card */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Book Appointment</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Schedule a new appointment with your preferred service provider.
            </p>
            <Link href="/page/booking" className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
              Book Now
            </Link>
          </div>
          
          {/* My Appointments Card */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">My Appointments</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              View and manage your upcoming appointments.
            </p>
            <Link href="/page/appointments" className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
              View Appointments
            </Link>
          </div>
          
          {/* Staff Availability Card - Only shown to staff */}
          {(user?.role === UserRole.Staff || user?.role === UserRole.Admin) && (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Manage Availability</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Set your weekly working hours and manage your availability.
              </p>
              <Link href="/page/availability" className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
                Set Availability
              </Link>
            </div>
          )}
          
          {/* Profile Settings Card */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Update your profile information and preferences.
            </p>
            <Link href="/page/profile" className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
              Edit Profile
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
