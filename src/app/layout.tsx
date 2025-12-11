'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from 'next/link';
import { theme } from '@/styles/theme';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <AppBar position="static">
                <Toolbar>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Gestionnaire de Budget
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
                      Tableau de Bord
                    </Link>
                    <Link href="/savings" style={{ color: 'white', textDecoration: 'none' }}>
                      Économies
                    </Link>
                    <Link href="/expenses" style={{ color: 'white', textDecoration: 'none' }}>
                      Dépenses
                    </Link>
                    <Link href="/payments" style={{ color: 'white', textDecoration: 'none' }}>
                      Paiements
                    </Link>
                    <Link href="/reimbursements" style={{ color: 'white', textDecoration: 'none' }}>
                      Remboursements
                    </Link>
                  </Box>
                </Toolbar>
              </AppBar>
              <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
                {children}
              </Container>
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
