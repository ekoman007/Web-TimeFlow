'use client';

import React from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import axiosClient from '@/services/axiosClient';

const Header: React.FC = () => {
  const { authState } = useAuth();
  const { isAuthenticated } = authState;
  const router = useRouter();

  // Use the same logout logic as in Sidebar.tsx
  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint
      await axiosClient.post("/Login/logout"); 
    } catch (error) {
      console.error("Logout API call failed:", error); 
      // Optionally notify the user, but proceed with logout anyway
    } finally {
      // Clear local storage regardless of API call success/failure
      localStorage.removeItem("accessToken");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("roleName");

      // Redirect to home page instead of login using router
      router.push("/");
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl text-primary">
              TimeFlow
            </Link>
            
            {isAuthenticated && (
              <nav className="ml-8">
                <ul className="flex space-x-6">
                  <li>
                    <Link href="/page/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/page/booking" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
                      Book Appointment
                    </Link>
                  </li>
                  <li>
                    <Link href="/page/appointments" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
                      My Appointments
                    </Link>
                  </li>
                </ul>
              </nav>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link href="/page/login" className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 