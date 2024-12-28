import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Avatar,
  Box
} from '@mui/material';
import { 
  Class as ClassIcon,
  Groups as StudentsIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const ProfessorDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    professorName: "Dr. Mohammed", // À remplacer par les données réelles du professeur
    totalModules: 4,
    totalStudents: 120
  });

  useEffect(() => {
    // Ici vous pouvez ajouter la logique pour récupérer les données du professeur
    // fetchProfessorData();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: 'transparent' }}>
      {/* En-tête avec salutation */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Avatar 
          sx={{ 
            width: 80, 
            height: 80, 
            margin: '0 auto',
            bgcolor: 'primary.main',
            mb: 2
          }}
        >
          <PersonIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #3f51b5, #00bcd4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textTransform: 'uppercase',
            letterSpacing: 2
          }}
        >
          Tableau de bord
        </Typography>
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'text.secondary',
            mb: 4
          }}
        >
          Bienvenue, {dashboardData.professorName} 👋
        </Typography>
      </Box>

      {/* Statistiques */}
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between'
            }}>
              <Box>
                <Typography variant="h6">Mes Modules</Typography>
                <Typography variant="h4" color="primary.main">
                  {dashboardData.totalModules}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'primary.light' }}>
                <ClassIcon />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between'
            }}>
              <Box>
                <Typography variant="h6">Mes Étudiants</Typography>
                <Typography variant="h4" color="secondary.main">
                  {dashboardData.totalStudents}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'secondary.light' }}>
                <StudentsIcon />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfessorDashboard;