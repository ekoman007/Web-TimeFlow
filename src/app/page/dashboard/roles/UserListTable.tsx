import { useState } from 'react';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Box, TextField, Typography, Grid, IconButton } from '@mui/material';
import { Eye, Pencil } from 'lucide-react'; 
import AddIcon from '@mui/icons-material/Add';
import EditRoleModal from './EditRoleModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import useUsers from "./useUsers";
import ViewRoleModal from './ViewRoleModal';
import DelteRoleModal from './DeleteRoleModal';

interface UserListTableProps {
  users: any[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  roleName: string; 
  onPageChange: (model: GridPaginationModel) => void;
  onRoleChange: (value: string) => void; 
  onAddNew: () => void; 
  fetchUsers: () => void;
   
}

export default function UserListTable({
  users,
  total,
  page,
  pageSize,
  loading,
  roleName, 
  onPageChange,
  onRoleChange, 
  onAddNew , 
  fetchUsers,
}: UserListTableProps) {

  const [editRoleId, setEditRoleId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [viewRoleId, setEViewRoleId] = useState<number | null>(null);
  const [modalViewOpen, setViewOpen] = useState(false);

  const [deleteRoleId, setDeleteRoleId] = useState<number | null>(null);
  const [modalDeleteOpen, setDeleteOpen] = useState(false);

  const handleEditClick = (id: number) => {
    setEditRoleId(id);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditRoleId(null);
  };

  const handleViewClick = (id: number) => {
    setEViewRoleId(id);
    setViewOpen(true);
  };
  const handleViewCloseModal = () => {
    setViewOpen(false);
    setEViewRoleId(null);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteRoleId(id);
    setDeleteOpen(true);
  };
  const handleDeleteCloseModal = () => {
    setDeleteOpen(false);
    setDeleteRoleId(null);
  };
  

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'roleName', headerName: 'Username', flex: 2 },
    { field: 'description', headerName: 'Description', flex: 3 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => {
        const user = params.row;
        return (
          <div>
            <button
              onClick={() => handleEditClick(user.id)}
              aria-label={`Edito rolin me ID ${user.id}`}
              style={{ marginRight: '8px', border: 'none', background: 'transparent', cursor: 'pointer' }}
            >
              <Pencil />
            </button>
            <button
              onClick={() => handleViewClick(user.id)}
              aria-label={`Shiko detaje për rolin me ID ${user.id}`}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
            >
              <Eye />
            </button> 
            <button
              onClick={() => handleDeleteClick(user.id)}
              aria-label={`Shiko detaje për rolin me ID ${user.id}`}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
            >
              <Eye />
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Lista e roleve</Typography>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="RoleName" value={roleName} onChange={(e) => onRoleChange(e.target.value)} />
        </Grid> 
        <Grid item>
          <IconButton onClick={onAddNew} color="primary">
            <AddIcon />
          </IconButton>
        </Grid> 
      </Grid>

      <DataGrid
        rows={users}
        columns={columns}
        rowCount={total}
        pageSizeOptions={[5, 10, 20]}
        paginationMode="server"
        paginationModel={{ pageSize, page }}
        onPaginationModelChange={onPageChange}
        loading={loading}
        rowHeight={60}
        style={{ height: 'calc(100vh - 100px)' }}
      />

      {/* Modal për editim */}
      {editRoleId !== null && (
        <EditRoleModal
          open={modalOpen}
          onClose={handleCloseModal}
          roleId={editRoleId}
          
          onSuccess={() => {
            fetchUsers(); // ✅ rifresko të dhënat
          }}
        />
      )}

      {/* Modal për editim */}
      {viewRoleId !== null && (
        <ViewRoleModal
          open={modalViewOpen}
          onClose={handleViewCloseModal}
          viewId={viewRoleId}
          
          onSuccess={() => {
            fetchUsers(); // ✅ rifresko të dhënat
          }}
        />
      )}
      
       {/* Modal për editim */}
       {deleteRoleId !== null && (
        <DelteRoleModal
          open={modalDeleteOpen}
          onClose={handleDeleteCloseModal}
          deleteId={deleteRoleId}
          
          onSuccess={() => {
            fetchUsers(); // ✅ rifresko të dhënat
          }}
        />
      )}


      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
    
  );
}

