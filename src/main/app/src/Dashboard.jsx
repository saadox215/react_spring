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
import { Box, useTheme, Button } from '@mui/material';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuContent from './components/DashboardAdmin/MenuContent';
import CreativeAdminHeader from './components/DashboardAdmin/Header'

export default function Dashboard() {
    const [darkMode, setDarkMode] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState('home');
    const navigate = useNavigate();

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };
    const drawerWidth = 240;
    const handleLogout = () => {
        localStorage.removeItem('login');
        navigate('/admin/login');
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
            default:
                return <Home />;
        }
    };


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
                            mt: 'calc(var(--template-frame-height, 0px) + 4px)',
                            p: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100px',
                        }}
                    >
                        <img
                            src={logoAdmin}
                            alt="Admin Logo"
                            style={{
                                maxWidth: '80px',
                                maxHeight: '100%',
                                objectFit: 'contain',
                                marginRight: '16px',
                            }}
                        />
                        <span
                            style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: theme.palette.text.primary,
                            }}
                        >
          ADMIN
        </span>
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
                            onClick={handleLogout}
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
        </ThemeProvider>
    );
}