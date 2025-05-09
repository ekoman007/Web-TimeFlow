'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, LoginRequest, User, UserRole } from '@/types';
import { login, register, logout } from '../services/authService';
import { useRouter } from 'next/navigation';

interface AuthContextProps {
  authState: AuthState;
  loginUser: (credentials: LoginRequest) => Promise<void>;
  logoutUser: () => void;
  registerUser: (userData: any) => Promise<void>;
  isAdmin: () => boolean;
  isStaff: () => boolean;
  isCustomer: () => boolean;
  isDemoMode: boolean;
}

const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Create a demo user for demonstration purposes
const demoUser: User = {
  id: 'demo-user-123',
  email: 'demo@timeflow.com',
  firstName: 'Demo',
  lastName: 'User',
  role: UserRole.Customer,
  isActive: true,
  createdAt: new Date().toISOString(),
  phoneNumber: '+1234567890'
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        // Check both token formats - originally stored and compatibility format
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');
        
        // Remove demo mode flag if present
        localStorage.removeItem('demo-mode');
        setIsDemoMode(false);
        
        if (token && storedUser) {
          try {
            // Parse user object
            const user = JSON.parse(storedUser) as User;
            
            // Set auth state
            setAuthState({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            
            console.log('User loaded from storage:', user.email);
          } catch (err) {
            console.error('Error parsing user JSON:', err);
            setAuthState({
              ...initialAuthState,
              isLoading: false,
              error: 'Invalid user data',
            });
          }
        } else if (token) {
          // We have a token but no user, create a basic user
          const roleName = localStorage.getItem('roleName') || 'User';
          
          const basicUser: User = {
            id: 'user-local',
            email: 'user@example.com',
            firstName: 'User',
            lastName: 'Account',
            role: roleName === 'BussinesAdmin' ? UserRole.Admin : UserRole.Customer,
            isActive: true,
            createdAt: new Date().toISOString()
          };
          
          // Store the basic user info
          localStorage.setItem('user', JSON.stringify(basicUser));
          
          setAuthState({
            user: basicUser,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          // No authenticated user found
          setAuthState({
            ...initialAuthState,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Failed to load user from storage:', error);
        setAuthState({
          ...initialAuthState,
          isLoading: false,
          error: 'Failed to authenticate',
        });
      }
    };

    loadUserFromStorage();
  }, []);

  const loginUser = async (credentials: LoginRequest) => {
    setAuthState({ ...authState, isLoading: true, error: null });
    try {
      const response = await login(credentials);
      
      // Save to localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setAuthState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Redirect based on role
      if (response.user.role === UserRole.Admin) {
        router.push('/dashboard/admin');
      } else if (response.user.role === UserRole.Staff) {
        router.push('/dashboard/staff');
      } else {
        router.push('/dashboard/customer');
      }
    } catch (error: any) {
      setAuthState({
        ...initialAuthState,
        isLoading: false,
        error: error.message || 'Failed to login',
      });
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('demo-mode');
      
      setAuthState({
        ...initialAuthState,
        isLoading: false,
      });
      
      setIsDemoMode(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const registerUser = async (userData: any) => {
    setAuthState({ ...authState, isLoading: true, error: null });
    try {
      await register(userData);
      // After registration, redirect to login
      router.push('/login');
    } catch (error: any) {
      setAuthState({
        ...authState,
        isLoading: false,
        error: error.message || 'Registration failed',
      });
    }
  };

  const isAdmin = () => authState.user?.role === UserRole.Admin;
  const isStaff = () => authState.user?.role === UserRole.Staff;
  const isCustomer = () => authState.user?.role === UserRole.Customer;

  return (
    <AuthContext.Provider 
      value={{ 
        authState, 
        loginUser, 
        logoutUser, 
        registerUser, 
        isAdmin, 
        isStaff, 
        isCustomer,
        isDemoMode
      }}
    >
      {children}
      
      {/* Demo Mode Banner - Disabled */}
      {isDemoMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-primary text-white p-2 text-center text-sm">
          <strong>Demo Mode:</strong> You're viewing the application with demo data. All functionality is simulated.
          <button 
            onClick={logoutUser}
            className="ml-4 underline hover:no-underline"
          >
            Exit Demo Mode
          </button>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 