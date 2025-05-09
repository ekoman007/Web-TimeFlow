import React, { useState, useEffect } from 'react';
import { StaffMember } from '@/types';
import axios from '@/services/axiosClient';

interface StaffSelectionProps {
  serviceId: string;
  onSelect: (staff: StaffMember) => void;
  onBack: () => void;
}

const StaffSelection: React.FC<StaffSelectionProps> = ({ serviceId, onSelect, onBack }) => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch staff members who can provide the selected service
  useEffect(() => {
    const fetchStaffMembers = async () => {
      if (!serviceId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get<StaffMember[]>(`/api/staff/by-service/${serviceId}`);
        setStaffMembers(response.data);
      } catch (err: any) {
        setError('Failed to load staff members. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffMembers();
  }, [serviceId]);

  // Handle staff selection
  const handleStaffClick = (staff: StaffMember) => {
    onSelect(staff);
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
      <div className="flex items-center mb-4">
        <button 
          className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          onClick={onBack}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold">Select a Staff Member</h2>
      </div>
      
      {staffMembers.length === 0 ? (
        <div className="text-center p-8 text-gray-500 dark:text-gray-400">
          No staff members available for this service.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffMembers.map((staff) => (
            <div
              key={staff.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleStaffClick(staff)}
            >
              <div className="aspect-w-1 aspect-h-1 bg-gray-200 dark:bg-gray-700">
                {staff.profileImageUrl ? (
                  <img 
                    src={staff.profileImageUrl} 
                    alt={`${staff.user?.firstName} ${staff.user?.lastName}`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg">
                  {staff.user?.firstName} {staff.user?.lastName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{staff.title}</p>
                {staff.bio && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                    {staff.bio}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffSelection; 