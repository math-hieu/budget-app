'use client';

import { useState, FormEvent } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { parseCurrency } from '@/lib/formatters';

interface ItemFormProps {
  nameLabel: string;
  amountLabel: string;
  initialName?: string;
  initialAmount?: number;
  onSubmit: (data: { name: string; amount: number }) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export default function ItemForm({
  nameLabel,
  amountLabel,
  initialName = '',
  initialAmount,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}: ItemFormProps) {
  const [name, setName] = useState(initialName);
  const [amount, setAmount] = useState(
    initialAmount !== undefined ? initialAmount.toFixed(2) : ''
  );
  const [errors, setErrors] = useState<{ name?: string; amount?: string }>({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors: { name?: string; amount?: string } = {};

    const trimmedName = name.trim();
    if (!trimmedName) {
      newErrors.name = 'Le nom est requis';
    }

    const parsedAmount = parseCurrency(amount);
    if (parsedAmount === null) {
      newErrors.amount = 'Le montant est requis';
    }
    // Note: Negative amounts are allowed for virtual savings (withdrawals)

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);
      const parsedAmount = parseCurrency(amount);
      await onSubmit({
        name: name.trim(),
        amount: parsedAmount!,
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Échec de l\'enregistrement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  return (
    <Card>
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              id="item-name"
              label={nameLabel}
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              disabled={submitting}
              fullWidth
              required
            />
            <TextField
              id="item-amount"
              label={amountLabel}
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              error={!!errors.amount}
              helperText={errors.amount}
              disabled={submitting}
              fullWidth
              required
              inputProps={{
                inputMode: 'decimal',
                pattern: '[0-9]*[.]?[0-9]*',
              }}
            />
            {submitError && (
              <Alert severity="error">{submitError}</Alert>
            )}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={submitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
              >
                {submitting ? 'Enregistrement...' : submitLabel}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
