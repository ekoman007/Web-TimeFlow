// userFunctions.ts
import axios from 'axios';
import { toast } from 'react-toastify';

export const fetchUsers = async (page: number, pageSize: number, filters: any) => {
  try {
    const response = await axios.get('/api/ApplicationUser', {
      params: {
        PageNumber: page + 1,
        PageSize: pageSize,
        Username: filters.username || undefined,
        Email: filters.email || undefined,
        IsActive: filters.isActive !== '' ? filters.isActive === 'true' : undefined,
        RoleId: filters.roleId || undefined,
      },
    });
    return { users: response.data.result.items, total: response.data.result.totalCount };
  } catch (error) {
    console.error('Gabim gjatë marrjes së përdoruesve:', error);
    throw error;
  }
};

export const handleActivateUser = async (userId: number, currentIsActive: boolean, fetchUsers: Function) => {
  try {
    const response = await axios.put(`/api/ApplicationUser/activete/${userId}`);
    if (response.status === 200 && response.data.success) {
      if (!currentIsActive) {
        toast.success('Përdoruesi u aktivizua me sukses!');
      } else {
        toast.info('Përdoruesi u deaktivizua me sukses!');
      }
      fetchUsers();
    } else {
      toast.error('Gabim gjatë aktivizimit të përdoruesit!');
    }
  } catch (error) {
    console.error('Gabim gjatë aktivizimit të përdoruesit:', error);
    toast.error('Gabim gjatë aktivizimit të përdoruesit!');
  }
};

export const handleCreateUserDetails = async (newDetails: any, selectedUserId: number, fetchUsers: Function) => {
  try {
    const payload = { ...newDetails, userId: selectedUserId };
    const response = await axios.post('/api/ApplicationUserDetails/create', payload);
    if (response.status === 200 || response.data.success) {
      toast.success('Detajet u shtuan me sukses!');
      fetchUsers();
    } else {
      toast.error('Gabim gjatë shtimit të detajeve!');
    }
  } catch (error) {
    console.error('Gabim:', error);
    toast.error('Gabim gjatë shtimit të detajeve!');
  }
};
