'use client';

import { useEffect, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Link from 'next/link';
import BudgetSummary from '@/components/BudgetSummary';
import AccountBalanceInput from '@/components/AccountBalanceInput';
import LoadingSpinner from '@/components/LoadingSpinner';
import { calculateRemainingBudget } from '@/lib/calculations';
import { formatCurrency } from '@/lib/formatters';
import { BudgetData } from '@/types';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [accountId, setAccountId] = useState<string>('');
  const [accountBalance, setAccountBalance] = useState(0);
  const [budgetData, setBudgetData] = useState<BudgetData>({
    accountBalance: 0,
    virtualSavings: [],
    recurringExpenses: [],
    pendingPayments: [],
    pendingReimbursements: [],
  });

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [accountRes, savingsRes, expensesRes, paymentsRes, reimbursementsRes] = await Promise.all([
        fetch('/api/account'),
        fetch('/api/savings'),
        fetch('/api/expenses'),
        fetch('/api/payments'),
        fetch('/api/reimbursements'),
      ]);

      if (!accountRes.ok) throw new Error('Failed to fetch account');

      const account = await accountRes.json();
      const savings = savingsRes.ok ? await savingsRes.json() : [];
      const expenses = expensesRes.ok ? await expensesRes.json() : [];
      const payments = paymentsRes.ok ? await paymentsRes.json() : [];
      const reimbursements = reimbursementsRes.ok ? await reimbursementsRes.json() : [];

      setAccountId(account.id);
      setAccountBalance(account.balance);

      setBudgetData({
        accountBalance: account.balance,
        virtualSavings: savings.map((s: any) => ({ amount: s.amount })),
        recurringExpenses: expenses.map((e: any) => ({
          amount: e.amount,
          isPaid: e.currentMonthPayment?.isPaid || false
        })),
        pendingPayments: payments.map((p: any) => ({
          amount: p.amount,
          isPaid: p.isPaid,
        })),
        pendingReimbursements: reimbursements.map((r: any) => ({
          amount: r.amount,
        })),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleSaveBalance = async (balance: number) => {
    const response = await fetch('/api/account', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ balance }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to save balance');
    }

    // Update local state
    setAccountBalance(balance);
    setBudgetData((prev) => ({
      ...prev,
      accountBalance: balance,
    }));
  };

  const remainingBudget = calculateRemainingBudget(budgetData);

  // Calculate totals for chips
  const totalSavings = budgetData.virtualSavings.reduce((sum, s) => sum + s.amount, 0);
  const totalUnpaidExpenses = budgetData.recurringExpenses
    .filter((e) => !e.isPaid)
    .reduce((sum, e) => sum + e.amount, 0);
  const totalPendingPayments = budgetData.pendingPayments
    .filter((p) => !p.isPaid)
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPendingReimbursements = budgetData.pendingReimbursements.reduce((sum, r) => sum + r.amount, 0);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}
      >
        Tableau de Bord
      </Typography>

      {/* Summary Chips */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2 }}
        sx={{ mb: { xs: 2, sm: 3 }, flexWrap: 'wrap' }}
      >
        <Link href="/savings" style={{ textDecoration: 'none' }}>
          <Chip
            label={`Économies : ${formatCurrency(totalSavings)}`}
            color="success"
            clickable
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              py: { xs: 1.5, sm: 2 },
              px: { xs: 0.5, sm: 1 },
              fontWeight: 600,
              width: { xs: '100%', sm: 'auto' },
              '&:hover': {
                backgroundColor: 'success.dark',
              }
            }}
          />
        </Link>
        <Link href="/expenses" style={{ textDecoration: 'none' }}>
          <Chip
            label={`Dépenses Impayées : ${formatCurrency(totalUnpaidExpenses)}`}
            color="error"
            clickable
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              py: { xs: 1.5, sm: 2 },
              px: { xs: 0.5, sm: 1 },
              fontWeight: 600,
              width: { xs: '100%', sm: 'auto' },
              '&:hover': {
                backgroundColor: 'error.dark',
              }
            }}
          />
        </Link>
        <Link href="/payments" style={{ textDecoration: 'none' }}>
          <Chip
            label={`Paiements en Attente : ${formatCurrency(totalPendingPayments)}`}
            color="warning"
            clickable
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              py: { xs: 1.5, sm: 2 },
              px: { xs: 0.5, sm: 1 },
              fontWeight: 600,
              width: { xs: '100%', sm: 'auto' },
              '&:hover': {
                backgroundColor: 'warning.dark',
              }
            }}
          />
        </Link>
        <Link href="/reimbursements" style={{ textDecoration: 'none' }}>
          <Chip
            label={`Remboursements en Attente : ${formatCurrency(totalPendingReimbursements)}`}
            color="info"
            clickable
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              py: { xs: 1.5, sm: 2 },
              px: { xs: 0.5, sm: 1 },
              fontWeight: 600,
              width: { xs: '100%', sm: 'auto' },
              '&:hover': {
                backgroundColor: 'info.dark',
              }
            }}
          />
        </Link>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: { xs: 2, sm: 3 } }}>
          {error}
        </Alert>
      )}

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 2, sm: 3 }}
        sx={{ width: '100%' }}
      >
        <Box sx={{ flex: 1 }}>
          <BudgetSummary
            remainingBudget={remainingBudget}
            accountBalance={accountBalance}
            totalSavings={totalSavings}
            totalExpenses={totalUnpaidExpenses}
            totalPayments={totalPendingPayments}
            totalReimbursements={totalPendingReimbursements}
            loading={false}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <AccountBalanceInput initialBalance={accountBalance} onSave={handleSaveBalance} />
        </Box>
      </Stack>

      <Box sx={{ mt: { xs: 3, sm: 4 } }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
        >
          Votre budget restant est calculé en soustrayant les économies virtuelles, les dépenses récurrentes impayées
          et les paiements en attente de votre solde bancaire, puis en ajoutant les remboursements en attente.
        </Typography>
      </Box>
    </Box>
  );
}
