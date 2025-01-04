import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Avatar,
  Box,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { 
  People as UsersIcon, 
  School as GraduationCapIcon, 
  Book as BookOpenIcon,
  PersonAdd as StudentIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const AdminDashboardEnhanced = () => {
  const [dashboardData, setDashboardData] = useState({
    professeurs: 0,
    filieres: 0,
    modules: 0,
    etudiants: 0,
    distributionEtudiants: [],
    performanceModules: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [professeursRes, filieresRes, modulesRes, etudiantsRes] = await Promise.all([
          fetch('http://localhost:8081/admin/professeurs'),
          fetch('http://localhost:8081/admin/filiere'),
          fetch('http://localhost:8081/admin/modules'),
          fetch('http://localhost:8081/admin/etudiants')
        ]);

        const professeurs = await professeursRes.json();
        const filieres = await filieresRes.json();
        const modules = await modulesRes.json();
        const etudiants = await etudiantsRes.json();

        const distribution = filieres.map(filiere => ({
          name: filiere.nom,
          value: etudiants.filter(e => e.filiereId === filiere.id).length,
          color: getRandomColor()
        }));

        const modulePerformance = modules.map(module => ({
          name: module.nom,
          performance: Math.random() * 40 + 60 
        }));

        setDashboardData({
          professeurs: professeurs.length,
          filieres: filieres.length,
          modules: modules.length,
          etudiants: etudiants.length,
          distributionEtudiants: distribution,
          performanceModules: modulePerformance
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRandomColor = () => {
    const colors = [
      '#0088FE',
      '#00C49F',
      '#FFBB28',
      '#FF8042',
      '#AF19FF',
      '#19D3FF',
      '#FF4D4D',
      '#A2FF19',
      '#FFD700',
      '#4B0082',
      '#9400D3',
      '#FF1493',
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const GlobalStatistics = () => (
    <Grid container spacing={3}>
      {[
        { label: 'Professeurs', value: dashboardData.professeurs, icon: <UsersIcon />, color: '#1976d2' },
        { label: 'Filières', value: dashboardData.filieres, icon: <GraduationCapIcon />, color: '#2e7d32' },
        { label: 'Modules', value: dashboardData.modules, icon: <BookOpenIcon />, color: '#9c27b0' },
        { label: 'Étudiants', value: dashboardData.etudiants, icon: <StudentIcon />, color: '#ed6c02' }
      ].map((stat, index) => (
        <Grid item xs={12} md={3} key={index}>
          <Card>
            <CardContent sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              '&:last-child': { paddingBottom: '16px' }
            }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  {stat.label}
                </Typography>
                <Typography variant="h4" sx={{ color: stat.color, fontWeight: 'bold' }}>
                  {stat.value}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: `${stat.color}20`, color: stat.color }}>
                {stat.icon}
              </Avatar>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const StudentDistributionChart = () => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <AnalyticsIcon sx={{ mr: 1 }} />
          Distribution des Étudiants par Filière
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={dashboardData.distributionEtudiants}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {dashboardData.distributionEtudiants.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );

  const ModulePerformanceChart = () => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <AnalyticsIcon sx={{ mr: 1 }} />
          Performance des Modules
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={dashboardData.performanceModules}>
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="performance" fill="#8884d8">
                {dashboardData.performanceModules.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={
                      entry.performance > 80 ? '#2e7d32' : 
                      entry.performance > 70 ? '#ed6c02' : 
                      '#d32f2f'
                    } 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
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
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography 
        variant="h3" 
        gutterBottom 
        sx={{ 
          mb: 4, 
          textAlign: 'center',
          background: 'linear-gradient(45deg, #1976d2, #00bcd4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 2
        }}
      >
        🌟 Tableau de bord Admin 🎓
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <GlobalStatistics />
        </Grid>

        <Grid item xs={12} md={6}>
          <StudentDistributionChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <ModulePerformanceChart />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardEnhanced;