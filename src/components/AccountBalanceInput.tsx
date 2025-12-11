'use client';

import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { parseCurrency } from '@/lib/formatters';

interface AccountBalanceInputProps {
  initialBalance: number;
  onSave: (balance: number) => Promise<void>;
  loading?: boolean;
}

export default function AccountBalanceInput({
  initialBalance,
  onSave,
  loading = false,
}: AccountBalanceInputProps) {
  const [balance, setBalance] = useState(initialBalance.toFixed(2));
  const [error, setError] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsed = parseCurrency(balance);
    if (parsed === null) {
      setError('Veuillez entrer un montant valide');
      return;
    }

    try {
      setSaving(true);
      await onSave(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de l\'enregistrement du solde');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBalance(e.target.value);
    if (error) setError('');
  };

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
        >
          Solde du Compte Courant
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1.5, sm: 2 },
            alignItems: { xs: 'stretch', sm: 'flex-start' }
          }}>
            <TextField
              label="Solde"
              value={balance}
              onChange={handleChange}
              error={!!error}
              helperText={error || 'Entrez le solde actuel de votre compte courant'}
              disabled={loading || saving}
              fullWidth
              inputProps={{
                inputMode: 'decimal',
                pattern: '[0-9]*[.]?[0-9]*',
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading || saving}
              sx={{
                mt: { xs: 0, sm: 0.5 },
                minWidth: { xs: '100%', sm: 'auto' },
                whiteSpace: 'nowrap'
              }}
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </Box>
          {error && !saving && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
