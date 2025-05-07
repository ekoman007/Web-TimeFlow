// AddRoleModal.tsx
'use client';

import { Modal, Box, TextField, Button } from '@mui/material';
import { useState } from 'react';
import axios from 'axios'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

interface AddRoleModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // rifreskon të dhënat pas suksesit
}

export default function AddRoleModal({ open, onClose, onSuccess }: AddRoleModalProps) {
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    try {
      await axios.post('/api/Roles/create', {
        roleName,
        description,
      });
      toast.success('Roli u shtua me sukses!');
      setRoleName('');
      setDescription('');
      onClose();
      onSuccess(); // për të rifreskuar listën
    } catch (error) {
      toast.error('Gabim gjatë shtimit të rolit!');
      console.error(error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <h2>Shto Rol të Ri</h2>
        <TextField
          label="Role Name"
          fullWidth
          margin="normal"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          Shto
        </Button>
      </Box>
    </Modal>
  );
}
