'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Modal, TextField, FormControl, InputLabel, Select, MenuItem, Grid, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Eye, EyeClosed, Pencil, PencilLine, Trash2 } from 'lucide-react'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { useRouter } from 'next/navigation';  


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
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [newDetails, setNewDetails] = useState({
    fullName: '', 
    phoneNumber: '',
    dateOfBirth: '',
    profilePicture: '',
  });
  const [openUpdateModal, setOpenUpdateModal] = useState(false); 
  const [updateDetails, setUpdateDetails] = useState({
    fullName: '',
    phoneNumber: '',
    dateOfBirth: '',
    profilePicture: '',
  });
  const router = useRouter();


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
    { field: 'username', headerName: 'Username',  width: 100 },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'isActive',
      headerName: 'Aktiv',
      width: 100,
      valueFormatter: (params) => {
        return params ? 'Po' : 'Jo';
      },
    },
    { field: 'roleName', headerName: 'Role Name', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
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
            <button
            onClick={() => handleOpenDetailsModal(user.id)}
            aria-label={`Shto detaje për përdoruesin me ID ${user.id}`}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            <Eye />
          </button>
          <button
            onClick={() => handleOpenViewModal(user.id)}
            aria-label={`Shto detaje për përdoruesin me ID ${user.id}`}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            <EyeClosed />
          </button>
          <button
            onClick={() => handleOpenUpdateModal(user.id)}
            aria-label={`Përditëso detajet e përdoruesit me ID ${user.id}`}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            <PencilLine /> {/* Ose ikona që don */}
          </button> 
          <button onClick={() => navigateToBusinessProfile(user.id)}>
            Business Profile 
          </button>


          </div>
        );
      },
    },
  ];

  const navigateToBusinessProfile = (userId: number) => {
    debugger
    router.push(`/page/dashboard/users/business-profile/${userId}`);
  };

  // const navigateToCreateBusinessProfile = (userId: number) => {
  //   debugger
  //   router.push(`/dashboard/users/business-profile/${userId}`);
  // };
   

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

  const handleOpenDetailsModal = (id: number) => {
     
    setSelectedUserId(id);
    setOpenDetailsModal(true);
  };
 
  const handleOpenViewModal = async (id: number) => {
    debugger
    try {
      const response = await axios.get(`/api/ApplicationUserDetails/${id}`);
      const userDetails = response.data.result; // ose response.data.result nëse API e ka `result`
  
      setNewDetails({
        fullName: userDetails.fullName || '',
        phoneNumber: userDetails.phoneNumber || '',
        dateOfBirth: userDetails.dateOfBirth || '',
        profilePicture: userDetails.profilePicture || '',
      });
  
      setSelectedUserId(id);
      setOpenViewModal(true);
    } catch (error) { 
      toast.error('Gabim gjatë marrjes së detajeve për përdoruesin!');
    }
  }; 
  const handleCloseViewModal = () => {
     
    setOpenViewModal(false);
    setSelectedUserId(null);
    setNewDetails({
      fullName: '', 
      phoneNumber: '',
      dateOfBirth: '',
      profilePicture: '',
    });
  };
 
  const handleCloseDetailsModal = () => {
     
    setOpenDetailsModal(false);
    setSelectedUserId(null);
    setNewDetails({
      fullName: '', 
      phoneNumber: '',
      dateOfBirth: '',
      profilePicture: '',
    });
  };

  const handleCreateDetails = async () => {
    if (selectedUserId === null) {
      toast.error('Nuk u përzgjodh përdoruesi!');
      return;
    }
  
    try {
      const payload = {
        ...newDetails,
        userId: selectedUserId,
      };
  
      const response = await axios.post('/api/ApplicationUserDetails/create', payload);
      debugger
      if (response.status === 200 || response.data.success === true) {
        toast.success('Detajet u shtuan me sukses!');
        handleCloseDetailsModal();
        fetchUsers();
      } else {
        toast.error('Gabim gjatë shtimit të detajeve!');
      }
    } catch (error) {
      console.error('Gabim:', error);
      toast.error('Gabim gjatë shtimit të detajeve!');
    }
  };
     

  const handleOpenUpdateModal = async (id: number) => {
    try {

      const response = await axios.get(`/api/ApplicationUserDetails/${id}`); 
      const data = response.data.result;
  
      setUpdateDetails({
        fullName: data.fullName || '',
        phoneNumber: data.phoneNumber || '',
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
        profilePicture: data.profilePicture || '',
      });
  
      setSelectedUserId(id);
      setOpenUpdateModal(true);
    } catch (error) {
      console.error('Gabim gjatë marrjes së të dhënave të përdoruesit:', error);
      toast.error('Gabim gjatë ngarkimit të të dhënave!');
    }
  };
  
  

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    setSelectedUserId(null);
    setUpdateDetails({
      fullName: '',
      phoneNumber: '',
      dateOfBirth: '',
      profilePicture: '',
    });
  };

  const handleUpdateUser = async () => {
    if (!selectedUserId) return;
  
    const body = {
      id: selectedUserId,
      fullName: updateDetails.fullName,
      phoneNumber: updateDetails.phoneNumber,
      dateOfBirth: new Date(updateDetails.dateOfBirth).toISOString(),
      profilePicture: updateDetails.profilePicture,
    };
  
    try {
      const response = await fetch('/api/ApplicationUserDetails/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        const errorText = await response.text(); 
        toast.error('Gabim gjatë përditësimit të përdoruesit!'); // Ketu
        return;
      }
  
      toast.success('Përdoruesi u përditësua me sukses! 🎉'); // Ketu
      handleCloseUpdateModal();
      // mundesh me rifresku listen nese don: await fetchUsers();
    } catch (error) { 
      toast.error('Gabim gjatë përditësimit të përdoruesit!'); // Ketu
    }
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
        rowHeight={60}
        style={{ height: 'calc(100vh - 100px)' }}
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

      <Dialog open={openDetailsModal} onClose={handleCloseDetailsModal} aria-labelledby="details-dialog-title">
      <DialogTitle id="details-dialog-title">Shto Detajet e Përdoruesit</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Emri i plotë"
              value={newDetails.fullName}
              onChange={(e) => setNewDetails({ ...newDetails, fullName: e.target.value })}
            />
          </Grid> 
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Telefoni"
              value={newDetails.phoneNumber}
              onChange={(e) => setNewDetails({ ...newDetails, phoneNumber: e.target.value })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Datëlindja"
              type="date"
              value={newDetails.dateOfBirth}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setNewDetails({ ...newDetails, dateOfBirth: e.target.value })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Profile Picture (url)"
              value={newDetails.profilePicture}
              onChange={(e) => setNewDetails({ ...newDetails, profilePicture: e.target.value })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDetailsModal} color="primary">Anulo</Button>
        <Button onClick={handleCreateDetails} color="primary">Ruaj</Button>
      </DialogActions>
    </Dialog>

    <Dialog open={openViewModal} onClose={handleCloseViewModal} aria-labelledby="details-dialog-title">
  <DialogTitle id="details-dialog-title">Detajet e Përdoruesit</DialogTitle>
  <DialogContent>
    <Grid container spacing={2} mt={1}>
      <Grid item xs={12}>
        <strong>Emri i plotë:</strong> {newDetails.fullName || '-'}
      </Grid>
      <Grid item xs={12}>
        <strong>Telefoni:</strong> {newDetails.phoneNumber || '-'}
      </Grid>
      <Grid item xs={12}>
        <strong>Datëlindja:</strong> {newDetails.dateOfBirth || '-'}
      </Grid>
      <Grid item xs={12}>
        <strong>Profile Picture:</strong> {newDetails.profilePicture ? (
          <div>
            <img src={newDetails.profilePicture} alt="Profile" style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '8px' }} />
          </div>
        ) : (
          '-'
        )}
      </Grid>
    </Grid>
  </DialogContent>
</Dialog>


<Dialog open={openUpdateModal} onClose={handleCloseUpdateModal} aria-labelledby="update-dialog-title">
  <DialogTitle id="update-dialog-title">Përditëso Detajet e Përdoruesit</DialogTitle>
  <DialogContent>
    <Grid container spacing={2} mt={1}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Emri i plotë"
          value={updateDetails.fullName}
          onChange={(e) => setUpdateDetails({ ...updateDetails, fullName: e.target.value })}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Telefoni"
          value={updateDetails.phoneNumber}
          onChange={(e) => setUpdateDetails({ ...updateDetails, phoneNumber: e.target.value })}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Datëlindja"
          type="date"
          value={updateDetails.dateOfBirth}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setUpdateDetails({ ...updateDetails, dateOfBirth: e.target.value })}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Profile Picture (url)"
          value={updateDetails.profilePicture}
          onChange={(e) => setUpdateDetails({ ...updateDetails, profilePicture: e.target.value })}
        />
      </Grid>
    </Grid>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseUpdateModal}>Anulo</Button>
    <Button onClick={handleUpdateUser} variant="contained" color="primary">
      Përditëso
    </Button>
  </DialogActions>
</Dialog>



      <ToastContainer />
    </Box>
  );
}
