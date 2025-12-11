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
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
        >
          Économies Virtuelles
        </Typography>
        {savings.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              py: 3,
              textAlign: 'center',
              fontSize: { xs: '0.875rem', sm: '0.875rem' }
            }}
          >
            Aucune catégorie d'économie virtuelle pour le moment. Ajoutez-en une pour commencer !
          </Typography>
        ) : (
          <>
            <List sx={{ p: { xs: 0, sm: 0 } }}>
              {savings.map((saving) => (
                <Box key={saving.id}>
                  <ListItem
                    sx={{
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'stretch', sm: 'center' },
                      py: { xs: 1.5, sm: 2 },
                      px: { xs: 0, sm: 2 },
                      gap: { xs: 1, sm: 0 }
                    }}
                  >
                    <ListItemText
                      primary={saving.name}
                      secondary={formatCurrency(saving.amount)}
                      primaryTypographyProps={{
                        fontWeight: 'medium',
                        sx: { fontSize: { xs: '0.875rem', sm: '1rem' } }
                      }}
                      secondaryTypographyProps={{
                        fontSize: { xs: '0.875rem', sm: '1.1rem' },
                        color: 'primary.main'
                      }}
                    />
                    <Box sx={{
                      display: 'flex',
                      gap: 0.5,
                      justifyContent: { xs: 'flex-end', sm: 'flex-start' },
                      ml: { xs: 0, sm: 'auto' }
                    }}>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => onEdit(saving)}
                        disabled={loading}
                        size="small"
                        sx={{ p: { xs: 0.5, sm: 1 } }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => onDelete(saving.id)}
                        disabled={loading}
                        size="small"
                        sx={{ p: { xs: 0.5, sm: 1 } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItem>
                  <Divider />
                </Box>
              ))}
            </List>
            <Box
              sx={{
                mt: { xs: 1.5, sm: 2 },
                pt: { xs: 1.5, sm: 2 },
                borderTop: 2,
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                Total :
              </Typography>
              <Typography
                variant="h6"
                color="primary.main"
                fontWeight="bold"
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                {formatCurrency(total)}
              </Typography>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}
