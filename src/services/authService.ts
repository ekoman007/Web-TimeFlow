import { LoginRequest, LoginResponse, User, UserRole } from '@/types';

// Mock user for demo purposes
const mockUser: User = {
  id: 'user-123',
  email: 'demo@timeflow.com',
  firstName: 'Demo',
  lastName: 'User',
  role: UserRole.Customer,
  isActive: true,
  createdAt: new Date().toISOString(),
  phoneNumber: '+1234567890'
};

// Login the user
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  // For demo purposes, we'll accept any credentials
  return {
    token: 'mock-jwt-token',
    user: mockUser
  };
};

// Register a new user
export const register = async (userData: any): Promise<void> => {
  // Do nothing for demo
  console.log('Register called with:', userData);
  return Promise.resolve();
};

// Logout the user
export const logout = async (): Promise<void> => {
  // Clear local storage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('roleName');
  return Promise.resolve();
};

// Get current user profile
export const getCurrentUser = async (): Promise<User> => {
  return Promise.resolve(mockUser);
};

// Update user profile
export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  return Promise.resolve({ ...mockUser, ...userData });
};

// Password reset request
export const requestPasswordReset = async (email: string): Promise<void> => {
  console.log('Password reset requested for:', email);
  return Promise.resolve();
};

// Reset password with token
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  console.log('Password reset with token:', token);
  return Promise.resolve();
}; 