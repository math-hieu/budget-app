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
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { formatCurrency } from '@/lib/formatters';

interface Payment {
  id: string;
  description: string;
  amount: number;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface PaymentsListProps {
  payments: Payment[];
  onDelete: (id: string) => void;
}

export default function PaymentsList({ payments, onDelete }: PaymentsListProps) {
  // Calculate total unpaid payments
  const totalUnpaid = payments
    .filter(payment => !payment.isPaid)
    .reduce((sum, payment) => sum + payment.amount, 0);

  if (payments.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Aucun paiement en attente. Ajoutez des factures à venir ou des achats prévus !
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <List>
        {payments.map((payment, index) => (
          <React.Fragment key={payment.id}>
            {index > 0 && <Divider />}
            <ListItem
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label={`delete ${payment.description}`}
                  onClick={() => onDelete(payment.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" fontWeight={500}>
                      {payment.description}
                    </Typography>
                  </Box>
                }
                secondary={formatCurrency(payment.amount)}
                primaryTypographyProps={{
                  variant: 'body1',
                  fontWeight: 500
                }}
                secondaryTypographyProps={{
                  variant: 'body2',
                  color: 'error.main',
                  fontWeight: 600
                }}
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>

      {payments.length > 0 && (
        <>
          <Divider />
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              Total à Payer :
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="error.main">
              {formatCurrency(totalUnpaid)}
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
}
