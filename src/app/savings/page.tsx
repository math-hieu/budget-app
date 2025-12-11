'use client';

import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import SavingsList from '@/components/SavingsList';
import ItemForm from '@/components/ItemForm';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Saving {
  id: string;
  name: string;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function SavingsPage() {
  const [loading, setLoading] = useState(true);
  const [savings, setSavings] = useState<Saving[]>([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSaving, setEditingSaving] = useState<Saving | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchSavings = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/savings');
      if (!response.ok) {
        throw new Error('Failed to fetch savings');
      }

      const data = await response.json();
      setSavings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load savings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavings();
  }, [fetchSavings]);

  const handleAdd = () => {
    setEditingSaving(null);
    setShowForm(true);
  };

  const handleEdit = (saving: Saving) => {
    setEditingSaving(saving);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSaving(null);
  };

  const handleSubmit = async (data: { name: string; amount: number }) => {
    try {
      if (editingSaving) {
        // Update existing saving
        const response = await fetch(`/api/savings/${editingSaving.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Failed to update saving');
        }
      } else {
        // Create new saving
        const response = await fetch('/api/savings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Failed to create saving');
        }
      }

      // Refresh list
      await fetchSavings();
      handleCancel();
    } catch (err) {
      throw err; // Let ItemForm handle the error display
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/savings/${deleteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to delete saving');
      }

      // Refresh list
      await fetchSavings();
      setDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete saving');
      setDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);
  };

  if (loading && savings.length === 0) {
    return <LoadingSpinner message="Loading savings..." />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Économies Virtuelles
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          disabled={showForm}
        >
          Ajouter une Économie
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        {showForm && (
          <Box>
            <ItemForm
              nameLabel="Nom de la Catégorie"
              amountLabel="Montant"
              initialName={editingSaving?.name}
              initialAmount={editingSaving?.amount}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              submitLabel={editingSaving ? 'Mettre à jour' : 'Créer'}
            />
          </Box>
        )}

        <SavingsList
          savings={savings}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          loading={loading}
        />
      </Stack>

      <DeleteConfirmDialog
        open={!!deleteId}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        title="Supprimer la Catégorie d'Économie"
        message="Êtes-vous sûr de vouloir supprimer cette catégorie d'économie ? Cette action est irréversible."
      />
    </Box>
  );
}
