import React, { useState, useEffect } from 'react';
import { Service, StaffMember, Appointment } from '@/types';
import ServiceSelection from './ServiceSelection';
import StaffSelection from './StaffSelection';
import { DateTimeSelection } from './DateTimeSelection';
import AppointmentConfirmation from './AppointmentConfirmation';
import { useAuth } from '@/context/AuthContext';
import { appointmentService } from '@/services/appointmentService';
import { useRouter } from 'next/navigation';

// Define the steps in the booking process
enum BookingStep {
  SelectService,
  SelectStaff,
  SelectDateTime,
  Confirm
}

interface BookingFlowProps {
  businessId?: string;
  onComplete?: () => void;
}

const BookingFlow: React.FC<BookingFlowProps> = ({ 
  businessId,
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>(BookingStep.SelectService);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { authState } = useAuth();
  const router = useRouter();

  // Reset the flow if the user changes
  useEffect(() => {
    if (!authState.isAuthenticated) {
      router.push('/login');
    }
  }, [authState, router]);

  // Handle service selection
  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setCurrentStep(BookingStep.SelectStaff);
  };

  // Handle staff selection
  const handleStaffSelect = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setCurrentStep(BookingStep.SelectDateTime);
  };

  // Handle date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    // When a date is selected, fetch available time slots
    fetchAvailableTimeSlots(date);
  };

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setCurrentStep(BookingStep.Confirm);
  };

  // Fetch available time slots for the selected date
  const fetchAvailableTimeSlots = async (date: string) => {
    if (!selectedService || !selectedStaff) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call API to get available slots
      const response = await fetch(
        `/api/appointments/availability?staffId=${selectedStaff.id}&serviceId=${selectedService.id}&date=${date}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch available time slots');
      }
      
      const data = await response.json();
      setAvailableTimeSlots(data.availableSlots);
    } catch (err) {
      setError('Failed to load available time slots. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle appointment confirmation
  const handleConfirm = async () => {
    if (!selectedService || !selectedStaff || !selectedDate || !selectedTime || !authState.user) {
      setError('Missing required information for booking');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Construct ISO datetime string for start time
      const startDateTime = `${selectedDate}T${selectedTime}`;
      
      // Calculate end time based on service duration
      const startTime = new Date(startDateTime);
      const durationMinutes = parseDuration(selectedService.duration);
      const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
      
      // Create appointment data
      const appointmentData = {
        customerId: authState.user.id,
        serviceId: selectedService.id,
        staffMemberId: selectedStaff.id,
        startTime: startDateTime,
        endTime: endTime.toISOString(),
        notes: '', // Optional notes can be added here
      };
      
      // Call API to create appointment
      const appointment = await appointmentService.createAppointment(appointmentData);
      
      // Call onComplete if provided, otherwise redirect
      if (onComplete) {
        onComplete();
      } else {
        router.push(`/dashboard/customer/appointments/${appointment.id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to book appointment. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Parse ISO 8601 duration format (e.g., PT1H30M) to minutes
  const parseDuration = (duration: string): number => {
    // Simple implementation - expects format PT{h}H{m}M
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

  // Handle back button
  const handleBack = () => {
    if (currentStep === BookingStep.SelectStaff) {
      setCurrentStep(BookingStep.SelectService);
      setSelectedStaff(null);
    } else if (currentStep === BookingStep.SelectDateTime) {
      setCurrentStep(BookingStep.SelectStaff);
      setSelectedDate('');
      setSelectedTime('');
    } else if (currentStep === BookingStep.Confirm) {
      setCurrentStep(BookingStep.SelectDateTime);
      setSelectedTime('');
    }
  };

  // Render the appropriate step
  const renderStep = () => {
    switch (currentStep) {
      case BookingStep.SelectService:
        return <ServiceSelection onSelect={handleServiceSelect} />;
      case BookingStep.SelectStaff:
        return (
          <StaffSelection 
            onSelect={handleStaffSelect} 
            serviceId={selectedService?.id || ''} 
            onBack={handleBack} 
          />
        );
      case BookingStep.SelectDateTime:
        return (
          <DateTimeSelection 
            serviceId={selectedService?.id || ''}
            staffId={selectedStaff?.id || ''}
            onSelectDateTime={(date, startTime, endTime) => {
              setSelectedDate(date.toISOString().split('T')[0]);
              setSelectedTime(startTime);
              setCurrentStep(BookingStep.Confirm);
            }}
            onBack={handleBack}
          />
        );
      case BookingStep.Confirm:
        return (
          <AppointmentConfirmation 
            service={selectedService!}
            staffMember={selectedStaff!}
            date={selectedDate}
            time={selectedTime}
            onConfirm={handleConfirm}
            onBack={handleBack}
            isLoading={isLoading}
          />
        );
      default:
        return <ServiceSelection onSelect={handleServiceSelect} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Book an Appointment</h1>
        
        {/* Progress bar */}
        <div className="mt-4 flex justify-between">
          <div 
            className={`step ${currentStep >= BookingStep.SelectService ? 'active' : ''}`}
          >
            Service
          </div>
          <div 
            className={`step ${currentStep >= BookingStep.SelectStaff ? 'active' : ''}`}
          >
            Staff
          </div>
          <div 
            className={`step ${currentStep >= BookingStep.SelectDateTime ? 'active' : ''}`}
          >
            Date & Time
          </div>
          <div 
            className={`step ${currentStep >= BookingStep.Confirm ? 'active' : ''}`}
          >
            Confirm
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* Current step content */}
      {renderStep()}
    </div>
  );
};

export default BookingFlow; 