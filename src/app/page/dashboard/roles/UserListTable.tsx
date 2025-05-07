// Vetëm për pamjen
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Box, TextField, Typography, Grid } from '@mui/material';
import { Eye, EyeClosed, Pencil, PencilLine, Trash2 } from 'lucide-react';

interface UserListTableProps {
  users: any[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  roleName: string;
  description: string;
  onPageChange: (model: GridPaginationModel) => void;
  onRoleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export default function UserListTable({
  users,
  total,
  page,
  pageSize,
  loading,
  roleName,
  description,
  onPageChange,
  onRoleChange,
  onDescriptionChange,
}: UserListTableProps) {
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', },
    { field: 'roleName', headerName: 'Username' },
    { field: 'description', headerName: 'Email' },
    {
          field: 'actions',
          headerName: 'Actions',
          width: 250,
          renderCell: (params) => {
            const user = params.row;
            return (
              <div>
                <button
                //  onClick={() => handleActivate(user.id)}
                  aria-label={`Aktivizo përdoruesin me ID ${user.id}`}
                  style={{ marginRight: '8px' }}
                >
                  <Pencil />
                </button>
                <button
               // onClick={() => handleOpenDetailsModal(user.id)}
                aria-label={`Shto detaje për përdoruesin me ID ${user.id}`}
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
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="Description" value={description} onChange={(e) => onDescriptionChange(e.target.value)} />
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
    </Box>
  );
}
