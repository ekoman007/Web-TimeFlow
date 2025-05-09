export enum UserRole {
  Admin = 'Admin',
  Staff = 'Staff',
  Customer = 'Customer'
}

export enum BusinessCategory {
  BeautyAndWellness = 'BeautyAndWellness',
  Healthcare = 'Healthcare',
  Fitness = 'Fitness',
  Services = 'Services',
  LeisureAndEntertainment = 'LeisureAndEntertainment',
  Education = 'Education',
  Pets = 'Pets',
  Rentals = 'Rentals',
  Hospitality = 'Hospitality',
  Automotive = 'Automotive'
}

export enum AppointmentStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  NoShow = 'NoShow'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  category: BusinessCategory;
  address: string;
  city: string;
  country: string;
  logoUrl?: string;
  website?: string;
  phoneNumber?: string;
  timeZone: string;
  isActive: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string; // ISO 8601 duration
  businessId: string;
  isActive: boolean;
}

export interface StaffService {
  id: string;
  staffMemberId: string;
  serviceId: string;
  service?: Service;
}

export interface StaffAvailability {
  id: string;
  staffMemberId: string;
  dayOfWeek: number; // 0-6 for Sunday-Saturday
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isRecurring: boolean;
  specificDate?: string; // ISO date string
}

export interface StaffMember {
  id: string;
  userId: string;
  businessId: string;
  title: string;
  bio?: string;
  profileImageUrl?: string;
  isActive: boolean;
  user?: User;
  services?: StaffService[];
  availabilities?: StaffAvailability[];
}

export interface Appointment {
  id: string;
  customerId: string;
  serviceId: string;
  staffMemberId: string;
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  status: AppointmentStatus;
  notes?: string;
  createdAt: string; // ISO datetime
  updatedAt?: string; // ISO datetime
  customer?: User;
  service?: Service;
  staffMember?: StaffMember;
}

export interface TimeSlot {
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  isAvailable: boolean;
}

export interface AuthResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  refreshToken: string;
  expiration: string; // ISO datetime
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role?: UserRole;
} 