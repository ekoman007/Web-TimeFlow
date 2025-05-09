import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TimeSlot, Service, StaffMember } from '../../types';

interface DateTimeSelectionProps {
  serviceId: string;
  staffId: string;
  onSelectDateTime: (date: Date, startTime: string, endTime: string) => void;
  onBack: () => void;
}

export const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  serviceId,
  staffId,
  onSelectDateTime,
  onBack
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate a range of dates (today + 14 days)
  const dateRange = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  useEffect(() => {
    // When selectedDate changes, fetch available time slots
    const fetchTimeSlots = async () => {
      try {
        setLoading(true);
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const response = await axios.get<TimeSlot[]>(
          `/api/appointments/available-slots?serviceId=${serviceId}&staffId=${staffId}&date=${formattedDate}`
        );
        setTimeSlots(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching time slots:', err);
        setError('Failed to load available time slots. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, [serviceId, staffId, selectedDate]);

  const formatDateForDisplay = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (slot: TimeSlot) => {
    onSelectDateTime(selectedDate, slot.startTime, slot.endTime);
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
        <h2 className="text-xl font-semibold">Select Date & Time</h2>
      </div>

      {/* Date selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Select a date</h3>
        <div className="flex overflow-x-auto pb-2 space-x-2">
          {dateRange.map((date) => (
            <button
              key={date.toISOString()}
              onClick={() => handleDateSelect(date)}
              className={`
                px-4 py-2 rounded-full flex flex-col items-center min-w-[80px] whitespace-nowrap
                ${
                  selectedDate.toDateString() === date.toDateString()
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              <span className="text-xs">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <span className="font-medium">{date.getDate()}</span>
              <span className="text-xs">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Time selection */}
      <div>
        <h3 className="text-lg font-medium mb-2">Select a time slot</h3>
        
        {loading ? (
          <div className="flex justify-center items-center h-36">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center p-4 text-red-500">
            <p>{error}</p>
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={() => setSelectedDate(new Date(selectedDate))} // Re-trigger fetch
            >
              Retry
            </button>
          </div>
        ) : timeSlots.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No available time slots for the selected date. Please select another date.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => handleTimeSelect(slot)}
                disabled={!slot.isAvailable}
                className={`
                  py-2 px-4 rounded-lg text-center
                  ${
                    slot.isAvailable
                      ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  }
                `}
              >
                {new Date(slot.startTime).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 