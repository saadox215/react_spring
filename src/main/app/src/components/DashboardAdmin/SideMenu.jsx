import React from 'react';
import { styled } from '@mui/material/styles';
import logoAdmin from '../../assets/logoadmin.jpg'
import Avatar from '@mui/material/Avatar';
import MuiDrawer from '@mui/material/Drawer';
import { Box, useTheme } from '@mui/material';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SelectContent from './SelectContent';
import MenuContent from './MenuContent';
import CardAlert from './CardAlert';
import OptionsMenu from './OptionsMenu';



export default function SideMenu() {
  const drawerWidth = 240;
const theme = useTheme();
const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': {
          backgroundColor: 'background.paper',
        },
      }}
    >
     <Box
            sx={{
                display: 'flex',
                mt: 'calc(var(--template-frame-height, 0px) + 4px)',
                p: 1,
                alignItems: 'center',
                justifyContent: 'center',
                height: '100px',
            }}
        >
            <img
                src={logoAdmin}
                alt="Admin Logo"
                style={{
                    maxWidth: '80px', // Limiter la largeur de l'image
                    maxHeight: '100%',
                    objectFit: 'contain',
                    marginRight: '16px', // Espacement entre l'image et le texte
                }}
            />
            <span
                style={{
                    fontSize: '24px', // Taille du texte
                    fontWeight: 'bold',
                    color: theme.palette.text.primary, // Couleur adaptative selon le mode
                }}
            >
                ADMIN
            </span>
        </Box>
      <Divider />
      <MenuContent />
      <CardAlert />
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sizes="small"
          alt="Riley Carter"
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            Riley Carter
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            riley@email.com
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}