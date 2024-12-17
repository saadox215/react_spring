import React, { useState } from 'react';
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  LinearProgress, 
  Chip, 
  Avatar,
  Box,
  Tooltip as MUITooltip
} from '@mui/material';
import { 
  PieChart, 
  BarChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Bar,
  Pie,
  Cell
} from 'recharts';
import { 
  People as UsersIcon, 
  School as GraduationCapIcon, 
  Book as BookOpenIcon, 
  Analytics as AnalyticsIcon,
  AutoGraph as AutoGraphIcon,
  PersonAdd as StudentIcon,
  LocalFireDepartment as FireIcon,
  Stars as StarsIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

const AdminDashboardEnhanced = () => {
  
  const [dashboardData] = useState({
    professeurs: 58,
    filieres: 12,
    modules: 45,
    etudiants: 1200,
    
    distributionEtudiants: [
      { name: 'Informatique', value: 450, color: '#0088FE' },
      { name: 'Réseaux', value: 300, color: '#00C49F' },
      { name: 'Cybersécurité', value: 250, color: '#FFBB28' },
      { name: 'Data Science', value: 200, color: '#FF8042' }
    ],
    performanceModules: [
      { name: 'Développement Web', performance: 85 },
      { name: 'Machine Learning', performance: 72 },
      { name: 'Réseaux', performance: 65 },
      { name: 'Cybersécurité', performance: 60 },
      { name: 'Data Science', performance: 78 }
    ]
  });

  const GlobalStatistics = () => (
    <Grid container spacing={3}>
      {[
        { label: 'Professeurs', value: dashboardData.professeurs, icon: <UsersIcon />, color: 'primary' },
        { label: 'Filières', value: dashboardData.filieres, icon: <GraduationCapIcon />, color: 'success' },
        { label: 'Modules', value: dashboardData.modules, icon: <BookOpenIcon />, color: 'secondary' },
        { label: 'Étudiants', value: dashboardData.etudiants, icon: <StudentIcon />, color: 'info' }
      ].map((stat, index) => (
        <Grid item xs={12} md={3} key={index}>
          <Card>
            <CardContent sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <Box>
                <Typography variant="h6">{stat.label}</Typography>
                <Typography variant="h4" color={`${stat.color}.main`}>
                  {stat.value}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: `${stat.color}.light` }}>
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
        <Typography variant="h6" gutterBottom>
          <AnalyticsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Distribution des Étudiants par Filière
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
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
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const ModulePerformanceChart = () => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <AnalyticsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Performance Comparative des Modules
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dashboardData.performanceModules}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="performance" fill="#8884d8">
              {dashboardData.performanceModules.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={
                    entry.performance > 80 ? '#00C49F' : 
                    entry.performance > 70 ? '#FFBB28' : 
                    '#FF8042'
                  } 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: 'transparent' }}>
      <Typography 
        variant="h3" 
        gutterBottom 
        sx={{ 
          marginBottom: '5px',
          fontWeight: 'bold', 
          mb: 4, 
          textAlign: 'center', 
          background: 'linear-gradient(45deg, #3f51b5, #00bcd4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textTransform: 'uppercase',
          letterSpacing: 2
        }}
      >
        🌟 Tableau de bord Admin 🎓
      </Typography>

      <Grid container spacing={4}>
        
        <Grid item xs={20} >
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