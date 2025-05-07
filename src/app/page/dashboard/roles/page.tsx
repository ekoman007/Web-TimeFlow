'use client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useUsers from '@/app/page/dashboard/roles/useUsers';
import UserListTable from '@/app/page/dashboard/roles/UserListTable';

export default function UserListsPage() {
  const {
    users,
    loading,
    page,
    pageSize,
    total,
    roleName,
    description,
    setPage,
    setPageSize,
    setRole,
    setDescription,
  } = useUsers();

  const handlePaginationChange = (model: { page: number; pageSize: number }) => {
    setPage(model.page);
    setPageSize(model.pageSize);
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
        description={description}
        onPageChange={handlePaginationChange}
        onRoleChange={setRole}
        onDescriptionChange={setDescription}
      />
      <ToastContainer />
    </>
  );
}
