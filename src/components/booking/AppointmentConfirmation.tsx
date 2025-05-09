import React, { useState } from 'react';
import axios from 'axios';
import { Service, StaffMember, Appointment } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface AppointmentConfirmationProps {
  service: Service;
  staffMember: StaffMember;
  date: string;
  time: string;
  onConfirm: () => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

const AppointmentConfirmation: React.FC<AppointmentConfirmationProps> = ({
  service,
  staffMember,
  date,
  time,
  onConfirm,
  onBack,
  isLoading
}) => {
  const [notes, setNotes] = useState('');
  const { authState } = useAuth();

  const handleConfirmAppointment = async () => {
    if (!authState.user) {
      console.error('User not authenticated');
      return;
    }

    try {
      await onConfirm();
    } catch (err) {
      console.error('Error creating appointment:', err);
      console.error('Error details:', err instanceof Error ? err.message : err);
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time for display (24h to 12h)
  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Format price
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Format duration
  const formatDuration = (duration: string): string => {
    // Parse ISO 8601 duration format (e.g., PT1H30M)
    const hourMatch = duration.match(/(\d+)H/);
    const minuteMatch = duration.match(/(\d+)M/);
    
    let result = '';
    if (hourMatch) {
      result += `${hourMatch[1]} hr${hourMatch[1] !== '1' ? 's' : ''} `;
    }
    if (minuteMatch) {
      result += `${minuteMatch[1]} min`;
    }
    
    return result.trim();
  };

  // Calculate end time
  const calculateEndTime = (): string => {
    const durationMinutes = parseDuration(service.duration);
    const [hours, minutes] = time.split(':').map(Number);
    
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    const endHours = endDate.getHours();
    const endMinutes = endDate.getMinutes();
    
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  };

  // Parse ISO 8601 duration format to minutes
  const parseDuration = (duration: string): number => {
    let minutes = 0;
    
    const hourMatch = duration.match(/(\d+)H/);
    if (hourMatch) {
      minutes += parseInt(hourMatch[1]) * 60;
    }
    
    const minuteMatch = duration.match(/(\d+)M/);
    if (minuteMatch) {
      minutes += parseInt(minuteMatch[1]);
    }
    
    return minutes;
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <button
          onClick={onBack}
          className="mr-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold">Confirm Your Appointment</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Appointment Details</h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Service:</span>
            <span className="font-medium">{service.name}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Price:</span>
            <span className="font-medium">${formatPrice(service.price)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Staff:</span>
            <span className="font-medium">
              {staffMember.user?.firstName} {staffMember.user?.lastName}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Date:</span>
            <span className="font-medium">{formatDate(date)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Time:</span>
            <span className="font-medium">
              {formatTime(time)} - {formatTime(calculateEndTime())}
            </span>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <span className="text-gray-500 dark:text-gray-400">Additional Notes:</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              placeholder="Add any special requests or notes (optional)"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleConfirmAppointment}
          disabled={isLoading}
          className={`
            px-4 py-2 rounded-md text-white font-medium
            ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
          `}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Confirm Appointment'
          )}
        </button>
      </div>
    </div>
  );
};

export default AppointmentConfirmation; 