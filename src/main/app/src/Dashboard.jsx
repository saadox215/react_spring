import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import AppNavbar from './components/DashboardAdmin/AppNavbar';
import Filiere from './components/DashboardAdmin/Filiere';
import Home from './components/DashboardAdmin/Home';  
import NavbarBreadcrumbs from './components/DashboardAdmin/NavbarBreadcrumbs';
import Search from './components/DashboardAdmin/Search';
import CustomDatePicker from './components/DashboardAdmin/CustomDatePicker';
import { styled } from '@mui/material/styles';
import logoAdmin from './assets/logoadmin.jpg';
import MuiDrawer from '@mui/material/Drawer';
import { Box, useTheme, Button, Typography, Avatar, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuContent from './components/DashboardAdmin/MenuContent'; 
import CreativeAdminHeader from './components/DashboardAdmin/Header';
import ModuleManagementPage from './components/DashboardAdmin/ModuleManagement';
import ProfesseurManagement from './components/DashboardAdmin/ProfManagement';

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('home');
  const [openDialog, setOpenDialog] = useState(false); // State for dialog visibility
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  const drawerWidth = 240;

  // Open confirmation dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Close confirmation dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Confirm logout
  const handleLogout = () => {
    localStorage.removeItem('login');  
    navigate('/admin/login');  
    handleCloseDialog(); // Close dialog after logout
  };

  const Drawer = styled(MuiDrawer)(() => ({
    width: drawerWidth,
    flexShrink: 0,
    boxSizing: 'border-box',
    mt: 10,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
    },
  }));

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('login');
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#121212' : '#f4f4f4',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#000000',
      },
      primary: {
        main: darkMode ? '#bb86fc' : '#6200ea',
      },
    },
  });

  function renderSelectedMenu(selectedMenu) {
    switch (selectedMenu) {
      case 'filiere':
        return <Filiere />;
      case 'home':
        return <Home />;
      case 'professeur':
        return <ProfesseurManagement />;
      case 'modules':
        return <ModuleManagementPage />;
      default:
        return <Home />;
    }
  }

  const handleMenuClick = (menu) => {
    console.log('Selected Menu:', menu);  
    setSelectedMenu(menu);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' }, 
            '& .MuiDrawer-paper': {
              backgroundColor: 'background.paper',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4,
              px: 2,
              background: darkMode
                ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' 
                : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              borderBottom: `2px solid ${theme.palette.primary.main}`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: darkMode
                  ? 'radial-gradient(circle, rgba(32,38,57,0.3) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)',
                animation: 'pulse 5s infinite alternate',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(0.95)' },
                  '100%': { transform: 'scale(1.05)' },
                },
              }}
            />

            <Avatar
              src={logoAdmin}
              sx={{
                width: 80,
                height: 80,
                mb: 2,
                border: `3px solid ${theme.palette.primary.main}`,
                boxShadow: `0 0 20px ${theme.palette.primary.main}`,
                transform: 'perspective(500px) rotateY(10deg)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'perspective(500px) rotateY(-10deg) scale(1.05)',
                  boxShadow: `0 0 30px ${theme.palette.primary.main}`,
                },
              }}
            />

            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 500, 
                color: theme.palette.text.primary,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                textShadow: darkMode 
                  ? '2px 2px 4px rgba(6, 89, 255, 0.5)' 
                  : '2px 2px 4px rgba(80, 77, 255, 0.2)',
                mb: 1,
              }}
            >
              Admin Hub
            </Typography>
          </Box>
          <Divider />
          <MenuContent onMenuClick={handleMenuClick} selectedMenu={selectedMenu} />
          <Stack
            direction="row"
            sx={{
              p: 2,
              gap: 1,
              alignItems: 'center',
              borderTop: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              borderRadius: 1,
            }}
          >
            <Button
              onClick={handleOpenDialog} // Open the confirmation dialog
              startIcon={<LogoutRoundedIcon />}
              variant="text"
              sx={{
                textTransform: 'none',
                color: 'error.main',
                '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.1)' },
              }}
            >
              Logout
            </Button>
          </Stack>
        </Drawer>
        <AppNavbar />
        <Box component="main" sx={{ flexGrow: 1, backgroundColor: theme.palette.background.default, overflow: 'auto', color: theme.palette.text.primary }}>
          <Stack spacing={2} sx={{ alignItems: 'center', mx: 3, pb: 5, mt: { xs: 8, md: 0 } }}>
            <Stack direction="row" sx={{ display: { xs: 'none', md: 'flex' }, width: '100%', alignItems: 'center', justifyContent: 'space-between', pt: 1.5 }} spacing={2}>
              <NavbarBreadcrumbs />
              <CreativeAdminHeader onModeChange={toggleDarkMode} />
            </Stack>

            {renderSelectedMenu(selectedMenu)} 
          </Stack>
        </Box>
      </Box>

      {/* Logout confirmation dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to log out?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
