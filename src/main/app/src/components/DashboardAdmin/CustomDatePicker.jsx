import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function CurrentDateTime() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const theme = useTheme();

    // Mettre à jour la date et l'heure toutes les secondes
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);

        return () => clearInterval(intervalId); 
    }, []);

    // Formater la date et l'heure
    const formattedDate = currentDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const formattedTime = currentDate.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    return (
        <Box sx={{ textAlign: 'center', padding: 2 }}>
            <Typography
                variant="h6"
                sx={{
                    color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'black',
                    fontWeight: 'bold',
                    marginBottom: 1,
                }}
            >
                {formattedDate}
            </Typography>
            
        </Box>
    );
}
