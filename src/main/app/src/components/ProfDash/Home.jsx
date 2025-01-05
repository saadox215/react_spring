import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Paper,
  IconButton,
  Divider,
  useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  Class as ClassIcon,
  Groups as StudentsIcon,
  Notifications as NotificationsIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

const ProfessorDashboard = () => {
  const theme = useTheme();
  const [dashboardData, setDashboardData] = useState({
    professorName: '',
    totalModules: 0,
    totalStudents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        setLoading(true);
        const professorId = localStorage.getItem("profId");

        const [profRes, modulesRes, studentsRes] = await Promise.all([
          fetch(`http://localhost:8081/prof/profile/${professorId}`),
          fetch(`http://localhost:8081/prof/modules/${professorId}`),
          fetch(`http://localhost:8081/prof/students/${professorId}`),
        ]);

        const professor = await profRes.json();
        const modules = await modulesRes.json();
        const students = await studentsRes.json();

        setDashboardData({
          professorName: professor.nom ? `Dr. ${professor.nom}` : 'Professeur',
          totalModules: modules.length,
          totalStudents: students.length,
        });
      } catch (error) {
        console.error('Error fetching professor dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfessorData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        background:'transparent',
        minHeight: '100vh'
      }}
    >
      {/* Header Section */}
      <Paper 
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          textAlign: 'center',
          background: 'transparent',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Avatar
          sx={{
            width: 100,
            height: 100,
            margin: '0 auto',
            mb: 2,
            border: `4px solid ${theme.palette.primary.main}`,
            background: theme.palette.primary.light
          }}
        >
          <PersonIcon sx={{ fontSize: 50 }} />
        </Avatar>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(45deg, #1a237e, #0d47a1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textTransform: 'uppercase',
            letterSpacing: 2
          }}
        >
          Home
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: theme.palette.text.secondary,
            mb: 2,
            fontWeight: 500
          }}
        >
          Bienvenue, {dashboardData.professorName} 👋
        </Typography>
      </Paper>

      {/* Stats Grid */}
      <Grid container spacing={4}>
        {/* Modules Card */}
        <Grid item xs={12} md={6} lg={4}>
          <Card 
            sx={{
              height: '100%',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows[10]
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 56,
                    height: 56
                  }}
                >
                  <ClassIcon />
                </Avatar>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Mes Modules
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {dashboardData.totalModules}
                  </Typography>
                </Box>
              </Box>
              <Divider />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Progression
                </Typography>
                <Typography variant="body2" color="primary">
                  75%
                </Typography>
              </Box>
              <Box
                sx={{
                  mt: 1,
                  width: '100%',
                  height: 8,
                  bgcolor: theme.palette.grey[200],
                  borderRadius: 4,
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    width: '75%',
                    height: '100%',
                    bgcolor: theme.palette.primary.main,
                    borderRadius: 4
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Students Card */}
        <Grid item xs={12} md={6} lg={4}>
          <Card 
            sx={{
              height: '100%',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows[10]
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.secondary.main,
                    width: 56,
                    height: 56
                  }}
                >
                  <StudentsIcon />
                </Avatar>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Mes Étudiants
                  </Typography>
                  <Typography variant="h4" color="secondary">
                    {dashboardData.totalStudents}
                  </Typography>
                </Box>
              </Box>
              <Divider />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Taux de réussite
                </Typography>
                <Typography variant="body2" color="secondary">
                  88%
                </Typography>
              </Box>
              <Box
                sx={{
                  mt: 1,
                  width: '100%',
                  height: 8,
                  bgcolor: theme.palette.grey[200],
                  borderRadius: 4,
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    width: '88%',
                    height: '100%',
                    bgcolor: theme.palette.secondary.main,
                    borderRadius: 4
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Card */}
        <Grid item xs={12} md={6} lg={4}>
          <Card 
            sx={{
              height: '100%',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows[10]
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.success.main,
                    width: 56,
                    height: 56
                  }}
                >
                  <BarChartIcon />
                </Avatar>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Performance
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    92%
                  </Typography>
                </Box>
              </Box>
              <Divider />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Objectifs atteints
                </Typography>
                <Typography variant="body2" color="success.main">
                  92%
                </Typography>
              </Box>
              <Box
                sx={{
                  mt: 1,
                  width: '100%',
                  height: 8,
                  bgcolor: theme.palette.grey[200],
                  borderRadius: 4,
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    width: '92%',
                    height: '100%',
                    bgcolor: theme.palette.success.main,
                    borderRadius: 4
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfessorDashboard;