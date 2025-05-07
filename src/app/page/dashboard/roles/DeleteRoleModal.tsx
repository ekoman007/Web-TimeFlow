import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Props {
  open: boolean;
  onClose: () => void;
  deleteId: number | null;
  onSuccess: () => void;
}

export default function DeleteRoleModal({
  open,
  onClose,
  deleteId,
  onSuccess,
}: Props) {
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoleDetails = async () => {
      if (deleteId === null || deleteId === undefined) return;

      setLoading(true);
      try {
        const { data } = await axios.get(`/api/Roles/${deleteId}`);
        setRoleName(data.result?.roleName ?? '');
        setDescription(data.result?.description ?? '');
      } catch (err) {
        toast.error('Gabim gjatë ngarkimit të rolit ❌');
      } finally {
        setLoading(false);
      }
    };

    if (open && deleteId !== null) {
      fetchRoleDetails();
    }
  }, [deleteId, open]);

  const handleDelete = async () => {
    if (!deleteId) return;

    setLoading(true);
    try {
      debugger
      await axios.put(`/api/Roles/delete/${deleteId}`);
      toast.success('Roli u fshi me sukses ✅');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Gabim gjatë fshirjes së rolit ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Fshij Rolin</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          A dëshironi të fshini këtë rol?
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Emri i Rol-it:
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {roleName || '—'}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Përshkrimi:
        </Typography>
        <Typography variant="body1">
          {description || '—'}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={loading}>
          JO
        </Button>
        <Button onClick={handleDelete} color="error" disabled={loading}>
          PO
        </Button>
      </DialogActions>
    </Dialog>
  );
}
