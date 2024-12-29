import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import GradeRoundedIcon from '@mui/icons-material/GradeRounded';
import ClassRoundedIcon from '@mui/icons-material/ClassRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

const professorMenuItems = [
  { text: 'Tableau de bord', icon: <DashboardRoundedIcon />, value: 'dashboard' },
  { text: 'Gestion des Notes', icon: <GradeRoundedIcon />, value: 'modules' },
  { text: 'Gestion des Absences', icon: <ClassRoundedIcon />, value: 'absence' },
  { text: 'Rapports', icon: <AssignmentRoundedIcon />, value: 'reports' },
  { text: 'Mon Profil', icon: <AccountCircleRoundedIcon />, value: 'profile' },
];

export default function ProfessorMenuContent({ onMenuClick, selectedMenu }) {
  if (typeof onMenuClick !== 'function') {
    console.error('onMenuClick is not a function');
  }

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {professorMenuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              onClick={() => onMenuClick(item.value)}
              selected={selectedMenu === item.value}
              sx={{
                borderRadius: 1,
                '&.Mui-selected': { backgroundColor: 'rgba(25, 118, 210, 0.1)' },
                '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}