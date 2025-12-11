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
      <Paper sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          Aucun remboursement en attente. Ajoutez les remboursements que vous attendez !
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <List sx={{ p: { xs: 0, sm: 1 } }}>
        {reimbursements.map((reimbursement, index) => (
          <React.Fragment key={reimbursement.id}>
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
                  fontWeight: 600,
                  sx: { fontSize: { xs: '0.875rem', sm: '0.875rem' } }
                }}
              />
              <IconButton
                edge="end"
                aria-label={`delete ${reimbursement.description}`}
                onClick={() => onDelete(reimbursement.id)}
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

      {reimbursements.length > 0 && (
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
              Total Remboursements :
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="success.main"
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              {formatCurrency(total)}
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
}
