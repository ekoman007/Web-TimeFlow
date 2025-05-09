'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import AvailabilityEditor from '@/components/staff/AvailabilityEditor';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

export default function AvailabilityPage() {
  const { authState } = useAuth();
  const { user, isAuthenticated, isLoading } = authState;

  if (isLoading) {
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

  // Only staff and admin can access this page
  if (user && user.role !== UserRole.Staff && user.role !== UserRole.Admin) {
    window.location.href = '/page/dashboard';
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Availability</h1>
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          {user && <AvailabilityEditor staffId={user.id} />}
        </div>
      </main>
    </div>
  );
} 