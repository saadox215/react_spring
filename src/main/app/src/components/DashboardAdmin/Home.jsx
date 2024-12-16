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
    topPerformers: [
      { 
        name: 'AMINE NAIMA', 
        role: 'Professeur', 
        module: 'Développement Web', 
        performance: 95, 
        specialty: 'Frontend Expert',
        achievements: 3
      },
      { 
        name: 'AFIFI SAAD', 
        role: 'Professeur', 
        module: 'Machine Learning', 
        performance: 88, 
        specialty: 'AI Researcher',
        achievements: 5
      },
      { 
        name: 'Sophie Laurent', 
        role: 'Professeur', 
        module: 'Cybersécurité', 
        performance: 92, 
        specialty: 'Network Security',
        achievements: 4
      }
    ],
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

  // Composant de Statistiques Globales
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

  // Graphique de Distribution des Étudiants
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

  const TopPerformersShowcase = () => (
    <Card 
      sx={{ 
        height: '100%', 
        background: 'transparant',
        boxShadow: 3,
        borderRadius: 3
      }}
    >
      <CardContent>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            color: '#3f51b5',
            fontWeight: 'bold'
          }}
        >
          <StarsIcon sx={{ mr: 2, color: '#ffc107' }} />
          🏆 Top Performers Académiques
        </Typography>
        
        {dashboardData.topPerformers.map((performer, index) => (
          <Card 
            key={index} 
            sx={{ 
              mb: 2, 
              p: 2, 
              backgroundColor: 'transparant', 
              boxShadow: 1,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.02)' }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    width: 56, 
                    height: 56, 
                    mr: 2, 
                    bgcolor: `primary.light` 
                  }}
                >
                  {performer.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {performer.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {performer.module} | {performer.specialty}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ textAlign: 'right' }}>
                <MUITooltip title="Performance Score">
                  <Chip 
                    label={`${performer.performance}%`} 
                    color={
                      performer.performance > 90 ? 'success' : 
                      performer.performance > 80 ? 'primary' : 'warning'
                    }
                    icon={<FireIcon />}
                  />
                </MUITooltip>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  🏅 {performer.achievements} Achievements
                </Typography>
              </Box>
            </Box>
            
            <LinearProgress 
              variant="determinate" 
              value={performer.performance} 
              sx={{ mt: 2, height: 8, borderRadius: 4 }}
              color={
                performer.performance > 90 ? 'success' : 
                performer.performance > 80 ? 'primary' : 'warning'
              }
            />
          </Card>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: 'transparent' }}>
      <Typography 
        variant="h3" 
        gutterBottom 
        sx={{ 
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
        🌟 Intelligence Académique 🎓
      </Typography>

      <Grid container spacing={3}>
        {/* Statistiques Globales */}
        <Grid item xs={12}>
          <GlobalStatistics />
        </Grid>

        {/* Graphiques Avancés */}
        <Grid item xs={12} md={6}>
          <StudentDistributionChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <ModulePerformanceChart />
        </Grid>

        {/* Top Performers */}
        <Grid item xs={12}>
          <TopPerformersShowcase />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardEnhanced;