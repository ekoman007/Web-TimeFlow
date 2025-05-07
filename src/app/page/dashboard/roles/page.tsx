'use client';

import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useUsers from '@/app/page/dashboard/roles/useUsers';
import UserListTable from '@/app/page/dashboard/roles/UserListTable';
import AddRoleModal from '@/app/page/dashboard/roles/AddRoleModal'; 

export default function UserListsPage() {
  const {
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
  } = useUsers();

  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const handlePaginationChange = (model: { page: number; pageSize: number }) => {
    setPage(model.page);
    setPageSize(model.pageSize);
  };

  const handleAddRoleClick = () => {
    setAddModalOpen(true);
  };

  return (
    <>
      <UserListTable
        users={users}
        total={total}
        page={page}
        pageSize={pageSize}
        loading={loading}
        roleName={roleName}
        onPageChange={handlePaginationChange}
        onRoleChange={setRole}
        onAddNew={handleAddRoleClick}
        fetchUsers={fetchUsers}
      />


      <AddRoleModal
        open={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => window.location.reload()} 
        
      />

      <ToastContainer />
    </>
  );
}
