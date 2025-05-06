// userFunctions.ts
import axiosClient from '@/services/axiosClient'; // Use the interceptor-configured client
import { toast } from 'react-toastify';

// Define necessary types directly here
interface ApplicationUserModel {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  lastLogin: string | null;
  roleId: number;
}

interface PagedResult<T> {
  items: T[];
  totalCount: number;
}

// Raw API response structure (adjust based on actual backend output)
interface FetchUsersApiResponse {
  result: PagedResult<ApplicationUserModel>;
  success: boolean; 
  message?: string; 
}

export const fetchUsers = async (page: number, pageSize: number, filters: any) => {
  try {
    // Use axiosClient directly, interceptors handle auth
    const response = await axiosClient.get<FetchUsersApiResponse>('/api/ApplicationUser', {
      params: {
        PageNumber: page + 1,
        PageSize: pageSize,
        Username: filters.username || undefined,
        Email: filters.email || undefined,
        IsActive: filters.isActive !== '' ? filters.isActive === 'true' : undefined,
        RoleId: filters.roleId || undefined,
      },
    });
    // Access data via response.data
    if (response.data.success && response.data.result) {
        return { users: response.data.result.items, total: response.data.result.totalCount };
    } else {
        throw new Error(response.data.message || 'Failed to fetch users or data missing');
    }
  } catch (error: any) {
    console.error('Gabim gjatë marrjes së përdoruesve:', error);
    toast.error(error.message || 'Gabim gjatë marrjes së përdoruesve!'); 
    throw error; 
  }
};

// Define expected response type for activate/deactivate
interface ActivateUserApiResponse {
    success: boolean;
    message?: string;
}

export const handleActivateUser = async (userId: number, currentIsActive: boolean, fetchUsersCallback: Function) => {
  try {
    // Use axiosClient directly
    const response = await axiosClient.put<ActivateUserApiResponse>(`/api/ApplicationUser/activete/${userId}`);

    if (response.data.success) {
      if (!currentIsActive) {
        toast.success('Përdoruesi u aktivizua me sukses!');
      } else {
        toast.info('Përdoruesi u deaktivizua me sukses!');
      }
      fetchUsersCallback();
    } else {
      toast.error(response.data.message || 'Gabim gjatë aktivizimit të përdoruesit!');
    }
  } catch (error: any) {
    console.error('Gabim gjatë aktivizimit të përdoruesit:', error);
    toast.error(error.message || 'Gabim gjatë aktivizimit të përdoruesit!');
  }
};

// Define expected response type for create details
interface CreateDetailsApiResponse {
    success: boolean;
    message?: string;
}

export const handleCreateUserDetails = async (newDetails: any, selectedUserId: number, fetchUsersCallback: Function) => {
  try {
    const payload = { ...newDetails, userId: selectedUserId };
    // Use axiosClient directly
    const response = await axiosClient.post<CreateDetailsApiResponse>('/api/ApplicationUserDetails/create', payload); // POST sends payload as data

    if (response.data.success) {
      toast.success('Detajet u shtuan me sukses!');
      fetchUsersCallback();
    } else {
      toast.error(response.data.message || 'Gabim gjatë shtimit të detajeve!');
    }
  } catch (error: any) {
    console.error('Gabim:', error);
    toast.error(error.message || 'Gabim gjatë shtimit të detajeve!');
  }
};
