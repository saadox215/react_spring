import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { alpha, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import IconButton from '@mui/material/IconButton';
import { ThemeProvider } from '@mui/material/styles';
import SideMenu from './components/DashboardAdmin/SideMenu';
import AppNavbar from './components/DashboardAdmin/AppNavbar';
import MainGrid from './components/DashboardAdmin/MainGrid';
import CustomDatePicker from './components/DashboardAdmin/CustomDatePicker';
import NavbarBreadcrumbs from './components/DashboardAdmin/NavbarBreadcrumbs';
import MenuButton from './components/DashboardAdmin/MenuButton';
import Search from './components/DashboardAdmin/Search';

export default function Dashboard() {
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

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
                primary: darkMode ? '#ffffff' : '#000000', // Texte blanc en mode sombre, noir en mode clair
            },
            primary: {
                main: darkMode ? '#bb86fc' : '#6200ea', // Exemple de couleur de base
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex' }}>
                <SideMenu />
                <AppNavbar />
                <Box
                    component="main"
                    sx={(theme) => ({
                        flexGrow: 1,
                        backgroundColor: theme.palette.background.default, // Utilisation dynamique de la couleur de fond
                        overflow: 'auto',
                        color: theme.palette.text.primary, // Application dynamique de la couleur du texte
                    })}
                >
                    <Stack
                        spacing={2}
                        sx={{
                            alignItems: 'center',
                            mx: 3,
                            pb: 5,
                            mt: { xs: 8, md: 0 },
                        }}
                    >
                        <Stack
                            direction="row"
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                width: '100%',
                                alignItems: { xs: 'flex-start', md: 'center' },
                                justifyContent: 'space-between',
                                maxWidth: { sm: '100%', md: '1700px' },
                                pt: 1.5,
                            }}
                            spacing={2}
                        >
                            <NavbarBreadcrumbs />
                            <Stack direction="row" sx={{ gap: 1 }}>
                                <Search />
                                <CustomDatePicker />
                                <IconButton onClick={toggleDarkMode} color="inherit" aria-label="toggle dark mode">
                                    {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                                </IconButton>
                            </Stack>
                        </Stack>

                        <MainGrid />
                    </Stack>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
