import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import ClassRoundedIcon from '@mui/icons-material/ClassRounded';
import LibraryBooksRoundedIcon from '@mui/icons-material/LibraryBooksRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

const mainListItems = [
  { text: 'Dashboard', icon: <SchoolRoundedIcon />, value: 'home' },
  { text: 'Filières', icon: <ClassRoundedIcon />, value: 'filiere' },
  { text: 'Modules', icon: <LibraryBooksRoundedIcon />, value: 'modules' },
  { text: 'Professeurs', icon: <PersonRoundedIcon />, value: 'professeurs' },
  { text: 'Étudiants', icon: <GroupRoundedIcon />, value: 'etudiants' },
  { text: 'Gestion Comptes', icon: <AccountCircleRoundedIcon />, value: 'gestion-comptes' },
];

export default function MenuContent({ onMenuClick, selectedMenu }) {
  // Check if onMenuClick is a function
  if (typeof onMenuClick !== 'function') {
    console.error('onMenuClick is not a function');
  }

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              onClick={() => onMenuClick(item.value)} // Pass value to parent
              selected={selectedMenu === item.value}  // Highlight the selected item
              sx={{
                borderRadius: 1,
                '&.Mui-selected': { backgroundColor: 'rgba(25, 118, 210, 0.1)' },
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
