import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Alert,
  Snackbar,
  Grid,
  IconButton,
  InputAdornment,
  Divider,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon
} from '@mui/icons-material';

const API_BASE_URL = 'http://localhost:8081/prof';

const ProfessorProfile = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [profileData, setProfileData] = useState({
    nom: '',
    prenom: '',
    email: '',
    specialite: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const profId = localStorage.getItem('profId');
      const response = await fetch(`${API_BASE_URL}/profile/${profId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch profile data');
      
      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      showSnackbar('Error loading profile: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };


  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateProfileData = () => {
    if (!profileData.nom?.trim()) return false;
    if (!profileData.email?.trim()) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) return false;
    return true;
  };

  const validatePasswordData = () => {
    if (!passwordData.currentPassword) return false;
    if (!passwordData.newPassword) return false;
    if (passwordData.newPassword !== passwordData.confirmPassword) return false;
    if (passwordData.newPassword.length < 8) return false;
    return true;
  };

  

  const handleUpdatePassword = async () => {
    if (!validatePasswordData()) {
      showSnackbar('Please check your password entries', 'error');
      return;
    }

    setLoading(true);
    try {
      const profId = localStorage.getItem('profId');
      const response = await fetch(`${API_BASE_URL}/profile/update-password/${profId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (!response.ok) throw new Error('Failed to update password');

      showSnackbar('Password updated successfully', 'success');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateProfile = async () => {
    if (!validateProfileData()) {
      showSnackbar('Please fill all required fields correctly', 'error');
      return;
    }

    setLoading(true);
    try {
      const profId = localStorage.getItem('profId');
      const response = await fetch(`${API_BASE_URL}/profile/update-data/${profId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(profileData)
      });

      if (!response.ok) throw new Error('Failed to update profile');

      showSnackbar('Profile updated successfully', 'success');
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Mon Profil
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Informations Personnelles
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nom"
                    name="nom"
                    value={profileData.nom}
                    onChange={handleProfileChange}
                    sx={{
                        '& .MuiInputBase-input': {
                          color: 'blue', 
                        },
                        '& input': {
                            backgroundColor:'transparent'
                          },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'blue',
                          },
                          '&:hover fieldset': {
                            borderColor: 'darkblue', 
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'blue', 
                          },
                        },
                      }}
                    required
                    InputProps={{
                        style: {color:'black' },
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Prénom"
                    name="prenom"
                    value={profileData.prenom}
                    sx={{
                        '& .MuiInputBase-input': {
                          color: 'blue', 
                        },
                        '& input': {
                            backgroundColor:'transparent'
                          },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'blue',
                          },
                          '&:hover fieldset': {
                            borderColor: 'darkblue', 
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'blue', 
                          },
                        },
                      }}
                    InputProps={{
                        style: {color:'black' },
                    }}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    sx={{
                        '& .MuiInputBase-input': {
                          color: 'blue', 
                        },
                        '& input': {
                            backgroundColor:'transparent'
                          },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'blue',
                          },
                          '&:hover fieldset': {
                            borderColor: 'darkblue', 
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'blue', 
                          },
                        },
                      }}
                    required
                    InputProps={{
                        style: {color:'black' },
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
               
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Spécialité"
                    name="specialite"
                    InputProps={{
                        style: {color:'black' },
                    }}
                    value={profileData.specialite}
                    onChange={handleProfileChange}
                    sx={{
                        '& .MuiInputBase-input': {
                          color: 'blue', 
                        },
                        '& input': {
                            backgroundColor:'transparent'
                          },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'blue',
                          },
                          '&:hover fieldset': {
                            borderColor: 'darkblue', 
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'blue', 
                          },
                        },
                      }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                >
                  Sauvegarder
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Password Change Card */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Changer le mot de passe
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Mot de passe actuel"
                  name="currentPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  sx={{
                    '& .MuiInputBase-input': {
                      color: 'blue', 
                    },
                    '& input': {
                        backgroundColor:'transparent'
                      },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'blue',
                      },
                      '&:hover fieldset': {
                        borderColor: 'darkblue', 
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'blue', 
                      },
                    },
                  }}
                  InputProps={{
                    style: {color:'black' },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Nouveau mot de passe"
                  name="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  helperText="Minimum 8 caractères"
                  sx={{
                    '& .MuiInputBase-input': {
                      color: 'blue', 
                    },
                    '& input': {
                        backgroundColor:'transparent'
                      },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'blue',
                      },
                      '&:hover fieldset': {
                        borderColor: 'darkblue', 
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'blue', 
                      },
                    },
                  }}
                  InputProps={{
                    style: {color:'black' },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Confirmer le nouveau mot de passe"
                  name="confirmPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  sx={{
                    '& .MuiInputBase-input': {
                      color: 'blue', 
                    },
                    '& input': {
                        backgroundColor:'transparent'
                      },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'blue',
                      },
                      '&:hover fieldset': {
                        borderColor: 'darkblue', 
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'blue', 
                      },
                    },
                  }}
                  InputProps={{
                    style: {color:'black' },
                }}
                  error={passwordData.newPassword !== passwordData.confirmPassword}
                  helperText={
                    passwordData.newPassword !== passwordData.confirmPassword
                      ? "Les mots de passe ne correspondent pas"
                      : ""
                  }
                />
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleUpdatePassword}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  sx={{ mt: 2 }}
                >
                  Mettre à jour le mot de passe
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default ProfessorProfile;