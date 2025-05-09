import React, { useState, useEffect } from 'react';
import { StaffAvailability } from '@/types';
import axios from '@/services/axiosClient';

interface AvailabilityEditorProps {
  staffId: string;
}

const DAYS_OF_WEEK = [
  { id: 0, name: 'Sunday' },
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' },
];

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', 
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
];

interface TimeRange {
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  dayOfWeek: number;
  timeRanges: TimeRange[];
}

const AvailabilityEditor: React.FC<AvailabilityEditorProps> = ({ staffId }) => {
  const [availabilities, setAvailabilities] = useState<StaffAvailability[]>([]);
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize schedule with empty ranges for each day
  useEffect(() => {
    const initialSchedule: DaySchedule[] = DAYS_OF_WEEK.map(day => ({
      dayOfWeek: day.id,
      timeRanges: [],
    }));
    setSchedule(initialSchedule);
  }, []);

  // Fetch availabilities for the staff member
  useEffect(() => {
    const fetchAvailabilities = async () => {
      if (!staffId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get<StaffAvailability[]>(`/api/staff/${staffId}/availabilities`);
        setAvailabilities(response.data);
        
        // Convert API data to schedule format
        convertAvailabilitiesToSchedule(response.data);
      } catch (err: any) {
        setError('Failed to load availability settings. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailabilities();
  }, [staffId]);

  // Convert API availabilities to schedule format
  const convertAvailabilitiesToSchedule = (availabilities: StaffAvailability[]) => {
    const newSchedule: DaySchedule[] = DAYS_OF_WEEK.map(day => ({
      dayOfWeek: day.id,
      timeRanges: [],
    }));
    
    // Group availabilities by day of week
    availabilities.forEach(availability => {
      if (availability.isRecurring) {
        const dayIndex = newSchedule.findIndex(d => d.dayOfWeek === availability.dayOfWeek);
        if (dayIndex !== -1) {
          newSchedule[dayIndex].timeRanges.push({
            startTime: availability.startTime,
            endTime: availability.endTime,
          });
        }
      }
    });
    
    setSchedule(newSchedule);
  };

  // Add a new time range to a day
  const addTimeRange = (dayOfWeek: number) => {
    setSchedule(prev =>
      prev.map(day =>
        day.dayOfWeek === dayOfWeek
          ? {
              ...day,
              timeRanges: [...day.timeRanges, { startTime: '09:00', endTime: '17:00' }],
            }
          : day
      )
    );
  };

  // Remove a time range from a day
  const removeTimeRange = (dayOfWeek: number, index: number) => {
    setSchedule(prev =>
      prev.map(day =>
        day.dayOfWeek === dayOfWeek
          ? {
              ...day,
              timeRanges: day.timeRanges.filter((_, i) => i !== index),
            }
          : day
      )
    );
  };

  // Update a time range
  const updateTimeRange = (dayOfWeek: number, index: number, field: 'startTime' | 'endTime', value: string) => {
    setSchedule(prev =>
      prev.map(day =>
        day.dayOfWeek === dayOfWeek
          ? {
              ...day,
              timeRanges: day.timeRanges.map((range, i) =>
                i === index ? { ...range, [field]: value } : range
              ),
            }
          : day
      )
    );
  };

  // Copy schedule from one day to another
  const copySchedule = (fromDay: number, toDay: number) => {
    const fromDaySchedule = schedule.find(day => day.dayOfWeek === fromDay);
    if (!fromDaySchedule) return;
    
    setSchedule(prev =>
      prev.map(day =>
        day.dayOfWeek === toDay
          ? { ...day, timeRanges: [...fromDaySchedule.timeRanges] }
          : day
      )
    );
  };

  // Copy schedule to all weekdays
  const copyToWeekdays = (fromDay: number) => {
    const fromDaySchedule = schedule.find(day => day.dayOfWeek === fromDay);
    if (!fromDaySchedule) return;
    
    setSchedule(prev =>
      prev.map(day =>
        day.dayOfWeek >= 1 && day.dayOfWeek <= 5
          ? { ...day, timeRanges: [...fromDaySchedule.timeRanges] }
          : day
      )
    );
  };

  // Save schedule to API
  const saveSchedule = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Convert schedule to API format
      const apiAvailabilities: Partial<StaffAvailability>[] = [];
      
      schedule.forEach(day => {
        day.timeRanges.forEach(range => {
          apiAvailabilities.push({
            staffMemberId: staffId,
            dayOfWeek: day.dayOfWeek,
            startTime: range.startTime,
            endTime: range.endTime,
            isRecurring: true,
          });
        });
      });
      
      // Send to API
      await axios.post(`/api/staff/${staffId}/availabilities`, apiAvailabilities);
      
      setSuccessMessage('Availability settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      setError('Failed to save availability settings. Please try again.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Check if end time is after start time
  const isValidTimeRange = (startTime: string, endTime: string): boolean => {
    const start = startTime.split(':').map(Number);
    const end = endTime.split(':').map(Number);
    
    // Convert to minutes for comparison
    const startMinutes = start[0] * 60 + start[1];
    const endMinutes = end[0] * 60 + end[1];
    
    return endMinutes > startMinutes;
  };

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-6">Weekly Availability</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Set your weekly availability schedule. You can add multiple time ranges for each day.
        </p>
        
        {/* Day by day schedule */}
        {schedule.map((day) => {
          const dayOfWeek = DAYS_OF_WEEK.find(d => d.id === day.dayOfWeek);
          
          return (
            <div key={day.dayOfWeek} className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{dayOfWeek?.name}</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => addTimeRange(day.dayOfWeek)}
                    className="text-sm text-primary hover:text-primary-dark"
                  >
                    + Add Time Range
                  </button>
                  
                  {day.dayOfWeek === 1 && (
                    <button
                      type="button"
                      onClick={() => copyToWeekdays(day.dayOfWeek)}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      Copy to All Weekdays
                    </button>
                  )}
                </div>
              </div>
              
              {day.timeRanges.length === 0 ? (
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  Not available
                </div>
              ) : (
                day.timeRanges.map((range, index) => (
                  <div key={index} className="flex flex-wrap items-center gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm">From:</label>
                      <select
                        value={range.startTime}
                        onChange={(e) => updateTimeRange(day.dayOfWeek, index, 'startTime', e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm bg-white dark:bg-gray-700"
                      >
                        {TIME_SLOTS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <label className="text-sm">To:</label>
                      <select
                        value={range.endTime}
                        onChange={(e) => updateTimeRange(day.dayOfWeek, index, 'endTime', e.target.value)}
                        className={`border rounded-md p-2 text-sm bg-white dark:bg-gray-700 ${
                          isValidTimeRange(range.startTime, range.endTime)
                            ? 'border-gray-300 dark:border-gray-600'
                            : 'border-red-500 dark:border-red-500'
                        }`}
                      >
                        {TIME_SLOTS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeTimeRange(day.dayOfWeek, index)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                    
                    {!isValidTimeRange(range.startTime, range.endTime) && (
                      <div className="text-red-500 text-xs w-full mt-1">
                        End time must be after start time
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={saveSchedule}
          disabled={isSaving}
          className={`px-6 py-3 bg-primary text-white rounded-md ${
            isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-dark'
          }`}
        >
          {isSaving ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            'Save Availability'
          )}
        </button>
      </div>
    </div>
  );
};

export default AvailabilityEditor; 