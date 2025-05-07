// components/EditRoleModal.tsx
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Props {
  open: boolean;
  onClose: () => void;
  roleId: number | null;  // Role ID which can be null when creating a new role
  onSuccess: () => void;
}

export default function EditRoleModal({ open, onClose, roleId, onSuccess }: Props) {
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for fetching data

  useEffect(() => {
    // Verifikoni vlerën e roleId dhe open
    debugger
    console.log("Role ID:", roleId); 
    console.log("Modal open state:", open);
  
    const fetchRoleDetails = async () => {
      if (roleId === null || roleId === undefined) {
        setRoleName('');
        setDescription('');
        return;
      }
  
      console.log("Fetching details for roleId:", roleId); // Debugging: Kontrolloni vlerën e roleId
  
      setLoading(true);  // Start loading
      try {
        debugger
        const { data } = await axios.get(`/api/Roles/${roleId}`);
        console.log("Role data:", data); // Debugging: Kontrolloni të dhënat që vijnë nga API
        setRoleName(data.result.roleName ?? '');  // Ensure empty string if null
        setDescription(data.result.description ?? '');
        
      } catch (err) {
        console.error('Gabim në marrjen e të dhënave:', err);
        toast.error('Gabim gjatë ngarkimit të rolit ❌');
      } finally {
        setLoading(false);  // End loading
      }
    };
  
    if (open && roleId !== null && roleId !== undefined) {
      fetchRoleDetails(); // Fetch role details only when modal is open and roleId is valid
    }
  }, [roleId, open]);  // Trigger when roleId or open state changes // Trigger when roleId or open state changes
  

  const handleSave = async () => {
    if (roleId === null) {
      toast.error('ID për rolin mungon ❌');
      return;
    }

    try {
      await axios.put('/api/Roles/update', {
        id: roleId,
        roleName,
        description,
      });
      toast.success('Roli u përditësua me sukses ✅');
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Gabim në update:', error);
      toast.error('Ndodhi një gabim gjatë përditësimit ❌');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Role</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          disabled={loading}  // Disable input while loading
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}  // Disable input while loading
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={loading}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
