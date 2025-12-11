'use client';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

interface DeleteConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteConfirmDialog({
  open,
  title = 'Confirmer la suppression',
  message,
  itemName,
  onConfirm,
  onCancel,
  loading = false,
}: DeleteConfirmDialogProps) {
  const displayMessage =
    message || (itemName ? `Êtes-vous sûr de vouloir supprimer "${itemName}" ?` : 'Êtes-vous sûr de vouloir supprimer cet élément ?');

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{displayMessage}</DialogContentText>
        <DialogContentText sx={{ mt: 1 }} color="error">
          Cette action est irréversible.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>
          Annuler
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}>
          {loading ? 'Suppression...' : 'Supprimer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
