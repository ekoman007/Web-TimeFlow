import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [roleName, setRole] = useState(''); 

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/Roles', {
        params: {
          PageNumber: page + 1,
          PageSize: pageSize,
          RoleName: roleName || undefined, 
        },
      });
      setUsers(response.data.result.items);
      setTotal(response.data.result.totalCount);
    } catch (error) {
      console.error('Gabim gjatë marrjes së përdoruesve:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize, roleName]);

  return {
    users,
    loading,
    page,
    pageSize,
    total,
    roleName, 
    setPage,
    setPageSize,
    setRole,   
    fetchUsers,
  };
}
