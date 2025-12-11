'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ReimbursementsList from '@/components/ReimbursementsList';
import ItemForm from '@/components/ItemForm';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';

interface Reimbursement {
  id: string;
  description: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function ReimbursementsPage() {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchReimbursements = useCallback(async () => {
    try {
      const response = await fetch('/api/reimbursements');
      if (!response.ok) {
        throw new Error('Failed to fetch reimbursements');
      }
      const data = await response.json();
      setReimbursements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reimbursements');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReimbursements();
  }, [fetchReimbursements]);

  const handleAdd = () => {
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const handleSubmitForm = async (data: { name: string; amount: number }) => {
    try {
      const response = await fetch('/api/reimbursements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: data.name,
          amount: data.amount
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create reimbursement');
      }

      // Refresh list and close form
      await fetchReimbursements();
      setShowForm(false);
    } catch (err) {
      throw err; // Let ItemForm handle the error display
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/reimbursements/${deleteId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to delete reimbursement');
      }

      // Refresh list
      await fetchReimbursements();
      setDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete reimbursement');
      setDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteId(null);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: 2,
          gap: { xs: 1.5, sm: 0 }
        }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}
          >
            Remboursements en Attente
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            disabled={showForm}
            sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}
          >
            Ajouter un Remboursement
          </Button>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
        >
          Suivez les remboursements que vous attendez. Supprimez-les une fois reçus.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: { xs: 2, sm: 3 } }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {showForm && (
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <ItemForm
            nameLabel="Description"
            amountLabel="Montant"
            onSubmit={handleSubmitForm}
            onCancel={handleCancelForm}
            submitLabel="Ajouter"
          />
        </Box>
      )}

      <ReimbursementsList
        reimbursements={reimbursements}
        onDelete={handleDelete}
      />

      <DeleteConfirmDialog
        open={deleteId !== null}
        title="Supprimer le Remboursement"
        message="Êtes-vous sûr de vouloir supprimer ce remboursement en attente ? Cette action est irréversible."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Container>
  );
}
