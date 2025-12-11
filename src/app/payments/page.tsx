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
import PaymentsList from '@/components/PaymentsList';
import ItemForm from '@/components/ItemForm';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';

interface Payment {
  id: string;
  description: string;
  amount: number;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    try {
      const response = await fetch('/api/payments');
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      const data = await response.json();
      setPayments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

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
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: data.name,
          amount: data.amount
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create payment');
      }

      // Refresh list and close form
      await fetchPayments();
      setShowForm(false);
    } catch (err) {
      throw err; // Let ItemForm handle the error display
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/payments/${deleteId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to delete payment');
      }

      // Refresh list
      await fetchPayments();
      setDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete payment');
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Paiements en Attente
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            disabled={showForm}
          >
            Ajouter un Paiement
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Suivez les factures à venir et les achats prévus. Supprimez-les une fois payés.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {showForm && (
        <Box sx={{ mb: 3 }}>
          <ItemForm
            nameLabel="Description"
            amountLabel="Montant"
            onSubmit={handleSubmitForm}
            onCancel={handleCancelForm}
            submitLabel="Ajouter"
          />
        </Box>
      )}

      <PaymentsList
        payments={payments}
        onDelete={handleDelete}
      />

      <DeleteConfirmDialog
        open={deleteId !== null}
        title="Supprimer le Paiement"
        message="Êtes-vous sûr de vouloir supprimer ce paiement en attente ? Cette action est irréversible."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Container>
  );
}
