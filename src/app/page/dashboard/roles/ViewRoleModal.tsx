// components/EditRoleModal.tsx
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Typography } from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  viewId: number | null;  // Role ID which can be null when creating a new role
  onSuccess: () => void;
}

export default function ViewRoleModal({ open, onClose, viewId, onSuccess }: Props) {
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for fetching data

  useEffect(() => {
    // Verifikoni vlerën e roleId dhe open
    debugger
    console.log("Role ID:", viewId); 
    console.log("Modal open state:", open);
  
    const fetchRoleDetails = async () => {
      if (viewId === null || viewId === undefined) {
        setRoleName('');
        setDescription('');
        return;
      }
  
      console.log("Fetching details for roleId:", viewId); // Debugging: Kontrolloni vlerën e roleId
  
      setLoading(true);  // Start loading
      try {
        debugger
        const { data } = await axios.get(`/api/Roles/${viewId}`);
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
  
    if (open && viewId !== null && viewId !== undefined) {
      fetchRoleDetails(); // Fetch role details only when modal is open and roleId is valid
    }
  }, [viewId, open]);  // Trigger when roleId or open state changes // Trigger when roleId or open state changes
  

   

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>View Role</DialogTitle>
      <DialogContent>
            <Typography variant="subtitle2" color="text.secondary">
                Role Name:
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                {roleName || '—'}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
                Description:
            </Typography>
            <Typography variant="body1">
                {description || '—'}
            </Typography>
        </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Close</Button> 
      </DialogActions>
    </Dialog>
  );
}
