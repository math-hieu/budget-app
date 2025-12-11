'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { formatCurrency } from '@/lib/formatters';
import LoadingSpinner from './LoadingSpinner';

interface BudgetSummaryProps {
  remainingBudget: number;
  accountBalance: number;
  totalSavings: number;
  totalExpenses: number;
  totalPayments: number;
  totalReimbursements: number;
  loading?: boolean;
}

export default function BudgetSummary({
  remainingBudget,
  accountBalance,
  totalSavings,
  totalExpenses,
  totalPayments,
  totalReimbursements,
  loading = false
}: BudgetSummaryProps) {
  if (loading) {
    return <LoadingSpinner message="Calculating budget..." />;
  }

  const isNegative = remainingBudget < 0;
  const isZero = remainingBudget === 0;

  const color = isNegative ? 'error.main' : isZero ? 'text.secondary' : 'success.main';

  return (
    <Card elevation={3}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h6"
          gutterBottom
          color="text.secondary"
          sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
        >
          Budget Restant
        </Typography>

        {/* Calculation Details */}
        <Box sx={{ my: { xs: 1.5, sm: 2 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Solde bancaire
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, fontWeight: 500 }}
            >
              {formatCurrency(accountBalance)}
            </Typography>
          </Box>

          {totalSavings > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
              <Typography
                variant="body2"
                color="error.main"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                - Économies virtuelles
              </Typography>
              <Typography
                variant="body2"
                color="error.main"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, fontWeight: 500 }}
              >
                {formatCurrency(totalSavings)}
              </Typography>
            </Box>
          )}

          {totalExpenses > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
              <Typography
                variant="body2"
                color="error.main"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                - Dépenses impayées
              </Typography>
              <Typography
                variant="body2"
                color="error.main"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, fontWeight: 500 }}
              >
                {formatCurrency(totalExpenses)}
              </Typography>
            </Box>
          )}

          {totalPayments > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
              <Typography
                variant="body2"
                color="error.main"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                - Paiements en attente
              </Typography>
              <Typography
                variant="body2"
                color="error.main"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, fontWeight: 500 }}
              >
                {formatCurrency(totalPayments)}
              </Typography>
            </Box>
          )}

          {totalReimbursements > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
              <Typography
                variant="body2"
                color="success.main"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                + Remboursements en attente
              </Typography>
              <Typography
                variant="body2"
                color="success.main"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, fontWeight: 500 }}
              >
                {formatCurrency(totalReimbursements)}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />

        {/* Final Result */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography
            variant="h3"
            component="div"
            sx={{
              color,
              fontWeight: 'bold',
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            {formatCurrency(remainingBudget)}
          </Typography>
        </Box>
        {isNegative && (
          <Typography
            variant="body2"
            color="error"
            sx={{ mt: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Votre compte est à découvert
          </Typography>
        )}
        {isZero && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Votre budget est entièrement alloué
          </Typography>
        )}
        {!isNegative && !isZero && (
          <Typography
            variant="body2"
            color="success.main"
            sx={{ mt: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Disponible à dépenser
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
