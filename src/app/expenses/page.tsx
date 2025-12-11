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
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ExpensesList from '@/components/ExpensesList';
import ItemForm from '@/components/ItemForm';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';

interface ExpensePayment {
  id: string;
  recurringExpenseId: string;
  month: number;
  year: number;
  isPaid: boolean;
  paidAt: Date | null;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  created_at: Date;
  updated_at: Date;
  currentMonthPayment?: ExpensePayment | null;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    try {
      const response = await fetch('/api/expenses');
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAdd = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  const handleSubmitForm = async (data: { name: string; amount: number }) => {
    try {
      if (editingExpense) {
        // Update existing expense
        const response = await fetch(`/api/expenses/${editingExpense.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description: data.name,
            amount: data.amount
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to update expense');
        }
      } else {
        // Create new expense
        const response = await fetch('/api/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description: data.name,
            amount: data.amount
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to create expense');
        }
      }

      // Refresh list and close form
      await fetchExpenses();
      setShowForm(false);
      setEditingExpense(null);
    } catch (err) {
      throw err; // Let ItemForm handle the error display
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/expenses/${deleteId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to delete expense');
      }

      // Refresh list
      await fetchExpenses();
      setDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete expense');
      setDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteId(null);
  };

  const handleTogglePaid = async (id: string, isPaid: boolean) => {
    try {
      const response = await fetch(`/api/expenses/${id}/pay`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPaid })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update payment status');
      }

      // Refresh list
      await fetchExpenses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update payment status');
    }
  };

  const handleResetPayments = async () => {
    try {
      const response = await fetch('/api/expenses/reset-payments', {
        method: 'POST'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to reset payments');
      }

      // Refresh list
      await fetchExpenses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset payments');
    }
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
            Dépenses Récurrentes Mensuelles
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RestartAltIcon />}
              onClick={handleResetPayments}
              disabled={showForm}
            >
              Réinitialiser le Mois
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              disabled={showForm}
            >
              Ajouter une Dépense
            </Button>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Cochez la case à côté de chaque dépense lorsque vous la payez. Utilisez "Réinitialiser le Mois" au début de chaque mois pour tout marquer comme impayé.
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
            amountLabel="Montant Mensuel"
            initialName={editingExpense?.description}
            initialAmount={editingExpense?.amount}
            onSubmit={handleSubmitForm}
            onCancel={handleCancelForm}
            submitLabel={editingExpense ? 'Mettre à jour' : 'Ajouter'}
          />
        </Box>
      )}

      <ExpensesList
        expenses={expenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onTogglePaid={handleTogglePaid}
      />

      <DeleteConfirmDialog
        open={deleteId !== null}
        title="Supprimer la Dépense"
        message="Êtes-vous sûr de vouloir supprimer cette dépense récurrente ? Cette action est irréversible."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Container>
  );
}
