import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Tooltip,
  Paper
} from '@mui/material';
import { 
  Brightness4 as LightModeIcon, 
  Brightness2 as DarkModeIcon,
  Schedule as ClockIcon
} from '@mui/icons-material';

const LogicDashboardHeader = ({ onModeChange }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (onModeChange) {
      onModeChange(newMode);
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%',
        py: 1
      }}
    >
      <Paper 
        elevation={4}
        sx={{ 
          width: 'fit-content',
          maxWidth: '95%',
          borderRadius: 3,
          overflow: 'hidden',
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          p: 3,
          gap: 3,
          background: isDarkMode 
            ? 'linear-gradient(135deg,rgb(46, 46, 66), #34495e)' 
            : 'linear-gradient(135deg,rgb(135, 182, 228),rgb(193, 220, 237))',
          color: isDarkMode ? 'white' : 'black',
          transition: 'all 0.5s ease'
        }}
      >
        {/* Date et Heure */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ClockIcon 
            sx={{ 
              color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
              fontSize: 32 
            }} 
          />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              letterSpacing: 0.5,
              textShadow: isDarkMode ? '1px 1px 3px rgba(0,0,0,0.3)' : 'none' 
            }}
          >
            {currentDateTime.toLocaleDateString()} - {currentDateTime.toLocaleTimeString()}
          </Typography>
        </Box>

        {/* Mode Indication */}
        <Typography 
          variant="body1" 
          sx={{ 
            fontStyle: 'italic', 
            opacity: 0.8,
            textShadow: isDarkMode ? '1px 1px 2px rgba(0,0,0,0.3)' : 'none',
            display: { xs: 'none', sm: 'block' }
          }}
        >
          {isDarkMode ? 'Mode sombre activé' : 'Mode clair activé'}
        </Typography>

        {/* Bouton pour changer le mode */}
        <Tooltip title={`Passer en ${isDarkMode ? 'Mode clair' : 'Mode sombre'}`}>
          <IconButton 
            onClick={toggleMode} 
            sx={{
              color: isDarkMode ? 'white' : 'black',
              bgcolor: isDarkMode 
                ? 'rgba(255,255,255,0.1)' 
                : 'rgba(0,0,0,0.05)',
              '&:hover': {
                transform: 'scale(1.1)',
                bgcolor: isDarkMode 
                  ? 'rgba(255,255,255,0.2)' 
                  : 'rgba(0,0,0,0.1)'
              },
              transition: 'all 0.3s ease',
              p: 1,
              borderRadius: 2
            }}
          >
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
      </Paper>
    </Box>
  );
};

export default LogicDashboardHeader;