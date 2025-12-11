'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatCurrency } from '@/lib/formatters';
import LoadingSpinner from './LoadingSpinner';

interface Saving {
  id: string;
  name: string;
  amount: number;
}

interface SavingsListProps {
  savings: Saving[];
  onEdit: (saving: Saving) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export default function SavingsList({
  savings,
  onEdit,
  onDelete,
  loading = false,
}: SavingsListProps) {
  const total = savings.reduce((sum, s) => sum + s.amount, 0);

  if (loading) {
    return <LoadingSpinner message="Chargement des économies..." />;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Économies Virtuelles
        </Typography>
        {savings.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
            Aucune catégorie d'économie virtuelle pour le moment. Ajoutez-en une pour commencer !
          </Typography>
        ) : (
          <>
            <List>
              {savings.map((saving) => (
                <Box key={saving.id}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => onEdit(saving)}
                          disabled={loading}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => onDelete(saving.id)}
                          disabled={loading}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={saving.name}
                      secondary={formatCurrency(saving.amount)}
                      primaryTypographyProps={{ fontWeight: 'medium' }}
                      secondaryTypographyProps={{ fontSize: '1.1rem', color: 'primary.main' }}
                    />
                  </ListItem>
                  <Divider />
                </Box>
              ))}
            </List>
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: 2,
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Total :
              </Typography>
              <Typography variant="h6" color="primary.main" fontWeight="bold">
                {formatCurrency(total)}
              </Typography>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}
