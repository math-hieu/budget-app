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
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatCurrency } from '@/lib/formatters';

interface Reimbursement {
  id: string;
  description: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ReimbursementsListProps {
  reimbursements: Reimbursement[];
  onDelete: (id: string) => void;
}

export default function ReimbursementsList({ reimbursements, onDelete }: ReimbursementsListProps) {
  // Calculate total reimbursements
  const total = reimbursements.reduce((sum, reimbursement) => sum + reimbursement.amount, 0);

  if (reimbursements.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Aucun remboursement en attente. Ajoutez les remboursements que vous attendez !
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <List>
        {reimbursements.map((reimbursement, index) => (
          <React.Fragment key={reimbursement.id}>
            {index > 0 && <Divider />}
            <ListItem
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label={`delete ${reimbursement.description}`}
                  onClick={() => onDelete(reimbursement.id)}
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
                      {reimbursement.description}
                    </Typography>
                  </Box>
                }
                secondary={formatCurrency(reimbursement.amount)}
                primaryTypographyProps={{
                  variant: 'body1',
                  fontWeight: 500
                }}
                secondaryTypographyProps={{
                  variant: 'body2',
                  color: 'success.main',
                  fontWeight: 600
                }}
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>

      {reimbursements.length > 0 && (
        <>
          <Divider />
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              Total Remboursements :
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="success.main">
              {formatCurrency(total)}
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
}
