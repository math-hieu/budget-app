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
      <Paper sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          Aucun paiement en attente. Ajoutez des factures à venir ou des achats prévus !
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <List sx={{ p: { xs: 0, sm: 1 } }}>
        {payments.map((payment, index) => (
          <React.Fragment key={payment.id}>
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
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                    >
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
                  fontWeight: 600,
                  sx: { fontSize: { xs: '0.875rem', sm: '0.875rem' } }
                }}
              />
              <IconButton
                edge="end"
                aria-label={`delete ${payment.description}`}
                onClick={() => onDelete(payment.id)}
                color="error"
                size="small"
                sx={{
                  p: { xs: 0.5, sm: 1 },
                  alignSelf: { xs: 'flex-end', sm: 'center' }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ListItem>
          </React.Fragment>
        ))}
      </List>

      {payments.length > 0 && (
        <>
          <Divider />
          <Box sx={{
            p: { xs: 1.5, sm: 2 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              Total à Payer :
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="error.main"
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              {formatCurrency(totalUnpaid)}
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
}
