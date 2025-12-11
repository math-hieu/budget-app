'use client';

import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Paper,
  Divider,
  Chip,
  Checkbox
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatCurrency } from '@/lib/formatters';

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

interface ExpensesListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onTogglePaid?: (id: string, isPaid: boolean) => void;
}

export default function ExpensesList({ expenses, onEdit, onDelete, onTogglePaid }: ExpensesListProps) {
  // Calculate total unpaid expenses
  const totalUnpaid = expenses
    .filter(expense => !expense.currentMonthPayment?.isPaid)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const totalPaid = expenses
    .filter(expense => expense.currentMonthPayment?.isPaid)
    .reduce((sum, expense) => sum + expense.amount, 0);

  if (expenses.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Aucune dépense récurrente pour le moment. Ajoutez-en une pour commencer !
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <List sx={{ p: { xs: 0, sm: 1 } }}>
        {expenses.map((expense, index) => (
          <React.Fragment key={expense.id}>
            {index > 0 && <Divider />}
            <ListItem
              sx={{
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                py: { xs: 1.5, sm: 2 },
                px: { xs: 1.5, sm: 2 },
                gap: { xs: 1, sm: 0 }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                {onTogglePaid && (
                  <Checkbox
                    checked={expense.currentMonthPayment?.isPaid || false}
                    onChange={(e) => onTogglePaid(expense.id, e.target.checked)}
                    sx={{ mr: { xs: 1, sm: 2 } }}
                    aria-label={`mark ${expense.description} as ${expense.currentMonthPayment?.isPaid ? 'unpaid' : 'paid'}`}
                  />
                )}
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                      >
                        {expense.description}
                      </Typography>
                      {expense.currentMonthPayment?.isPaid && (
                        <Chip
                          label="Payé"
                          size="small"
                          color="success"
                          sx={{ height: { xs: 18, sm: 20 } }}
                        />
                      )}
                    </Box>
                  }
                  secondary={formatCurrency(expense.amount)}
                  secondaryTypographyProps={{
                    variant: 'body2',
                    color: expense.currentMonthPayment?.isPaid ? 'text.secondary' : 'text.primary',
                    fontWeight: 600,
                    sx: {
                      textDecoration: expense.currentMonthPayment?.isPaid ? 'line-through' : 'none',
                      fontSize: { xs: '0.875rem', sm: '0.875rem' }
                    }
                  }}
                />
              </Box>
              <Box sx={{
                display: 'flex',
                gap: 0.5,
                justifyContent: { xs: 'flex-end', sm: 'flex-start' },
                ml: { xs: 0, sm: 'auto' }
              }}>
                <IconButton
                  edge="end"
                  aria-label={`edit ${expense.description}`}
                  onClick={() => onEdit(expense)}
                  size="small"
                  sx={{ p: { xs: 0.5, sm: 1 } }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label={`delete ${expense.description}`}
                  onClick={() => onDelete(expense.id)}
                  color="error"
                  size="small"
                  sx={{ p: { xs: 0.5, sm: 1 } }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </ListItem>
          </React.Fragment>
        ))}
      </List>

      {expenses.length > 0 && (
        <>
          <Divider />
          <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Impayé :
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="error.main"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                {formatCurrency(totalUnpaid)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Payé :
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="success.main"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                {formatCurrency(totalPaid)}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                Total :
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                {formatCurrency(totalUnpaid + totalPaid)}
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Paper>
  );
}
