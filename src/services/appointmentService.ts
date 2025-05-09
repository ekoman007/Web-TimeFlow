import axios from 'axios';
import { Appointment, TimeSlot, AppointmentStatus } from '../types';

const API_BASE_URL = '/api/appointments';

export const appointmentService = {
  // Get all appointments for the current user
  getUserAppointments: async (startDate?: Date, endDate?: Date): Promise<Appointment[]> => {
    try {
      let url = `${API_BASE_URL}/user`;
      const params = new URLSearchParams();
      
      if (startDate) {
        params.append('startDate', startDate.toISOString());
      }
      
      if (endDate) {
        params.append('endDate', endDate.toISOString());
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      return response.data.result || [];
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      throw error;
    }
  },

  // Get appointments for a specific staff member
  getStaffAppointments: async (staffId: string, startDate?: Date, endDate?: Date): Promise<Appointment[]> => {
    try {
      let url = `${API_BASE_URL}/staff/${staffId}`;
      const params = new URLSearchParams();
      
      if (startDate) {
        params.append('startDate', startDate.toISOString());
      }
      
      if (endDate) {
        params.append('endDate', endDate.toISOString());
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      return response.data.result || [];
    } catch (error) {
      console.error('Error fetching staff appointments:', error);
      throw error;
    }
  },

  // Get a specific appointment by ID
  getAppointmentById: async (id: string): Promise<Appointment> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data.result;
    } catch (error) {
      console.error(`Error fetching appointment with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new appointment
  createAppointment: async (appointmentData: {
    customerId: string;
    serviceId: string;
    staffMemberId: string;
    startTime: string;
    endTime: string;
    notes?: string;
  }): Promise<Appointment> => {
    try {
      const response = await axios.post(API_BASE_URL, appointmentData);
      return response.data.result;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  // Cancel an appointment
  cancelAppointment: async (id: string): Promise<Appointment> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}/cancel`);
      return response.data.result;
    } catch (error) {
      console.error(`Error cancelling appointment with ID ${id}:`, error);
      throw error;
    }
  },

  // Complete an appointment
  completeAppointment: async (id: string): Promise<Appointment> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}/complete`);
      return response.data.result;
    } catch (error) {
      console.error(`Error completing appointment with ID ${id}:`, error);
      throw error;
    }
  },

  // Reschedule an appointment
  rescheduleAppointment: async (
    id: string, 
    startTime: string, 
    endTime: string
  ): Promise<Appointment> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}/reschedule`, {
        startTime,
        endTime
      });
      return response.data.result;
    } catch (error) {
      console.error(`Error rescheduling appointment with ID ${id}:`, error);
      throw error;
    }
  },

  // Get available time slots for booking
  getAvailableTimeSlots: async (
    serviceId: string, 
    staffId: string, 
    date: Date
  ): Promise<TimeSlot[]> => {
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const response = await axios.get(
        `${API_BASE_URL}/available-slots?serviceId=${serviceId}&staffId=${staffId}&date=${formattedDate}`
      );
      return response.data.result || [];
    } catch (error) {
      console.error('Error fetching available time slots:', error);
      throw error;
    }
  },

  // Get all appointments
  getAllAppointments: async (): Promise<Appointment[]> => {
    try {
      const response = await axios.get<Appointment[]>(`${API_BASE_URL}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch appointments');
      }
      throw new Error('Network error. Please try again later.');
    }
  },

  // Get appointments for a specific user (customer or staff)
  getUserAppointmentsByUser: async (userId: string): Promise<Appointment[]> => {
    try {
      const response = await axios.get<Appointment[]>(`${API_BASE_URL}/user/${userId}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch user appointments');
      }
      throw new Error('Network error. Please try again later.');
    }
  },

  // Update an existing appointment
  updateAppointment: async (id: string, appointmentData: Partial<Appointment>): Promise<Appointment> => {
    try {
      const response = await axios.put<Appointment>(`${API_BASE_URL}/${id}`, appointmentData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to update appointment');
      }
      throw new Error('Network error. Please try again later.');
    }
  },

  // Change appointment status
  changeAppointmentStatus: async (id: string, status: AppointmentStatus): Promise<Appointment> => {
    try {
      const response = await axios.patch<Appointment>(`${API_BASE_URL}/${id}/status`, { status });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to update appointment status');
      }
      throw new Error('Network error. Please try again later.');
    }
  },

  // Check staff availability for a specific date and service
  checkAvailability: async (
    staffId: string, 
    serviceId: string, 
    date: string
  ): Promise<{ available: boolean; availableSlots: string[] }> => {
    try {
      const response = await axios.get<{ available: boolean; availableSlots: string[] }>(
        `${API_BASE_URL}/availability?staffId=${staffId}&serviceId=${serviceId}&date=${date}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to check availability');
      }
      throw new Error('Network error. Please try again later.');
    }
  }
}; 