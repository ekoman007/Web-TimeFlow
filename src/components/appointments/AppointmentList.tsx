import React, { useState, useEffect } from 'react';
import { Appointment, AppointmentStatus } from '@/types';
import { appointmentService } from '@/services/appointmentService';
import { useAuth } from '@/context/AuthContext';

interface AppointmentListProps {
  userId?: string;
  isStaffView?: boolean;
  showPastAppointments?: boolean;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ 
  userId, 
  isStaffView = false,
  showPastAppointments = false
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'All'>('All');
  const { authState } = useAuth();

  // Fetch appointments
  useEffect(() => {
    const fetchAppointmentsData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await appointmentService.getAllAppointments();
        setAppointments(data);
      } catch (err: any) {
        setError('Failed to load appointments. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointmentsData();
  }, [userId]);

  // Filter appointments based on criteria
  useEffect(() => {
    let filtered = [...appointments];
    
    // Filter by user if specified
    if (userId) {
      filtered = filtered.filter(appointment => 
        isStaffView 
          ? appointment.staffMemberId === userId 
          : appointment.customerId === userId
      );
    }
    
    // Filter by status
    if (statusFilter !== 'All') {
      filtered = filtered.filter(appointment => appointment.status === statusFilter);
    }
    
    // Filter past/upcoming appointments
    if (!showPastAppointments) {
      const now = new Date();
      filtered = filtered.filter(appointment => new Date(appointment.startTime) >= now);
    }
    
    // Sort by date (most recent first for past appointments, soonest first for upcoming)
    filtered.sort((a, b) => {
      const dateA = new Date(a.startTime);
      const dateB = new Date(b.startTime);
      
      if (showPastAppointments) {
        return dateB.getTime() - dateA.getTime(); // Most recent first
      } else {
        return dateA.getTime() - dateB.getTime(); // Soonest first
      }
    });
    
    setFilteredAppointments(filtered);
  }, [appointments, statusFilter, userId, isStaffView, showPastAppointments]);

  // Handle appointment cancellation
  const handleCancel = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }
    
    try {
      await appointmentService.cancelAppointment(appointmentId);
      
      // Update local state
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.id === appointmentId
            ? { ...appointment, status: AppointmentStatus.Cancelled }
            : appointment
        )
      );
    } catch (err: any) {
      alert('Failed to cancel appointment. Please try again.');
      console.error(err);
    }
  };

  // Handle status change (for staff view)
  const handleStatusChange = async (appointmentId: string, newStatus: AppointmentStatus) => {
    try {
      await appointmentService.changeAppointmentStatus(appointmentId, newStatus);
      
      // Update local state
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
    } catch (err: any) {
      alert('Failed to update appointment status. Please try again.');
      console.error(err);
    }
  };

  // Format date and time
  const formatDateTime = (dateTimeString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    
    return new Date(dateTimeString).toLocaleString('en-US', options);
  };

  // Get status class for styling
  const getStatusClass = (status: AppointmentStatus): string => {
    switch (status) {
      case AppointmentStatus.Confirmed:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case AppointmentStatus.Pending:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case AppointmentStatus.Completed:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case AppointmentStatus.Cancelled:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case AppointmentStatus.NoShow:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error}
        <button 
          className="ml-2 underline"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h2 className="text-xl font-semibold mb-4 sm:mb-0">
          {showPastAppointments ? 'Past Appointments' : 'Upcoming Appointments'}
        </h2>
        
        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              statusFilter === 'All'
                ? 'bg-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            onClick={() => setStatusFilter('All')}
          >
            All
          </button>
          
          {Object.values(AppointmentStatus).map((status) => (
            <button
              key={status}
              className={`px-3 py-1 rounded-full text-sm ${
                statusFilter === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      
      {filteredAppointments.length === 0 ? (
        <div className="text-center p-8 text-gray-500 dark:text-gray-400">
          No appointments found. 
          {statusFilter !== 'All' && (
            <span> Try changing the status filter.</span>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Service
                </th>
                {isStaffView ? (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                ) : (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Staff
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {appointment.service?.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {appointment.service?.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {isStaffView ? (
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {appointment.customer?.firstName} {appointment.customer?.lastName}
                      </div>
                    ) : (
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {appointment.staffMember?.user?.firstName} {appointment.staffMember?.user?.lastName}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {formatDateTime(appointment.startTime)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    {isStaffView ? (
                      // Staff actions
                      appointment.status === AppointmentStatus.Pending && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleStatusChange(appointment.id, AppointmentStatus.Confirmed)}
                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleStatusChange(appointment.id, AppointmentStatus.Cancelled)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Cancel
                          </button>
                        </div>
                      )
                    ) : (
                      // Customer actions
                      (appointment.status === AppointmentStatus.Pending || 
                       appointment.status === AppointmentStatus.Confirmed) && (
                        <button
                          onClick={() => handleCancel(appointment.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Cancel
                        </button>
                      )
                    )}
                    
                    {isStaffView && appointment.status === AppointmentStatus.Confirmed && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleStatusChange(appointment.id, AppointmentStatus.Completed)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleStatusChange(appointment.id, AppointmentStatus.NoShow)}
                          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          No Show
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentList; 