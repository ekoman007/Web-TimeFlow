'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Modal, TextField, FormControl, InputLabel, Select, MenuItem, Grid, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Eye, Pencil, Trash2 } from 'lucide-react'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  lastLogin: string | null;
  roleId: number;
}

interface RoleOption {
  id: number;
  roleName: string;
}

export default function UserListsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  // Filters
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('');
  const [isActive, setIsActive] = useState('');

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('/api/Roles/select-list');
        setRoles(response.data);
      } catch (error) {
        console.error('Gabim gjatë marrjes së roleve:', error);
      }
    };

    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get('/api/ApplicationUser', {
        params: {
          PageNumber: page + 1,
          PageSize: pageSize,
          Username: username || undefined,
          Email: email || undefined,
          IsActive: isActive !== '' ? isActive === 'true' : undefined,
          RoleId: roleId || undefined,
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
  }, [page, pageSize, username, email, roleId, isActive]);

  const handlePaginationChange = (model: GridPaginationModel) => {
    setPage(model.page);
    setPageSize(model.pageSize);
  };

  // Add new column for action buttons
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'username', headerName: 'Username', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'isActive',
      headerName: 'Aktiv',
      width: 100,
      valueFormatter: (params) => {
        return params ? 'Po' : 'Jo';
      },
    },
    { field: 'roleName', headerName: 'Role Name', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => {
        const user = params.row;
        return (
          <div>
            <button
              onClick={() => handleActivate(user.id)}
              aria-label={`Aktivizo përdoruesin me ID ${user.id}`}
              style={{ marginRight: '8px' }}
            >
              <Pencil />
            </button>
          </div>
        );
      },
    },
  ];

  const handleView = (id: number) => {
    alert(`Viewing user with ID: ${id}`);
  };

  const handleEdit = async (id: number) => {
    try {
      const response = await axios.put(`/api/ApplicationUser/activete/${id}`);
  
      console.log(response); // Debug response
      if (response.status === 200 && response.data.success) {
        toast.success('Përdoruesi u aktivizua me sukses!');
        fetchUsers();
      } else {
        toast.error('Gabim gjatë aktivizimit të përdoruesit!');
      }
    } catch (error) {
      console.error('Gabim gjatë aktivizimit të përdoruesit:', error);
      toast.error('Gabim gjatë aktivizimit të përdoruesit!');
    }
  };

  const handleDelete = (id: number) => {
    alert(`Deleting user with ID: ${id}`);
  };

  const handleActivate = (id: number) => {
    setSelectedUserId(id);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedUserId(null);
  };

  const handleActivateConfirm = async () => {
    if (selectedUserId !== null) {
      // Gjejmë përdoruesin përkatës nga lista (users)
      const selectedUser = users.find(user => user.id === selectedUserId);
  
      // Kontrollo nëse përdoruesi u gjet
      if (selectedUser) {
        const currentIsActive = selectedUser.isActive; // Gjendja aktuale e isActive për këtë përdorues
  debugger
        try {
          const response = await axios.put(`/api/ApplicationUser/activete/${selectedUserId}`); // Përdorim PUT dhe kalojmë id në URL
  
          if (response.status === 200 && response.data.success) {
            // Ndryshoni mesazhin në bazë të gjendjes
            if (!currentIsActive) {
              toast.success('Përdoruesi u aktivizua me sukses!');
            } else {
              toast.info('Përdoruesi u deaktivizua me sukses!');
            }
            
            fetchUsers(); // Rifresko listën e përdoruesve
          } else {
            toast.error('Gabim gjatë aktivizimit të përdoruesit!');
          }
        } catch (error) {
          console.error('Gabim gjatë aktivizimit të përdoruesit:', error);
          toast.error('Gabim gjatë aktivizimit të përdoruesit!');
        }
      } else {
        toast.error('Përdoruesi nuk u gjet!');
      }
    } 
    handleModalClose();
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Lista e Përdoruesve
      </Typography>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => {
              setPage(0);
              setUsername(e.target.value);
            }}
            aria-label="Filtroni për username"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => {
              setPage(0);
              setEmail(e.target.value);
            }}
            aria-label="Filtroni për email"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <Select
              displayEmpty
              value={roleId}
              onChange={(e) => {
                setPage(0);
                setRoleId(e.target.value);
              }}
              aria-label="Zgjedh rolin"
            >
              <MenuItem value="">Të gjithë</MenuItem>
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.roleName ? role.roleName : `⛔ Emër mungon për rolin me ID ${role.id}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Aktiv</InputLabel>
            <Select
              value={isActive}
              label="Aktiv"
              onChange={(e) => {
                setPage(0);
                setIsActive(e.target.value);
              }}
              aria-label="Filtroni për statusin aktiv"
            >
              <MenuItem value="">Të gjithë</MenuItem>
              <MenuItem value="true">Po</MenuItem>
              <MenuItem value="false">Jo</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <DataGrid
        rows={users}
        columns={columns}
        rowCount={total}
        pageSizeOptions={[5, 10, 20]}
        paginationMode="server"
        paginationModel={{ pageSize, page }}
        onPaginationModelChange={handlePaginationChange}
        loading={loading}
        autoHeight
      />

      {/* Modal for confirmation */}
      <Dialog open={openModal} onClose={handleModalClose} aria-labelledby="dialog-title">
        <DialogTitle id="dialog-title">Aktivizo përdoruesin</DialogTitle>
        <DialogContent>
          <Typography>Jeni të sigurt që dëshironi të aktivizoni këtë përdorues?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary" aria-label="Mbyll modalin">Jo</Button>
          <Button onClick={handleActivateConfirm} color="primary" aria-label="Aktivizo përdoruesin">Po</Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
}
