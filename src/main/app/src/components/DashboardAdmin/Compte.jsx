import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  Snackbar,
  Box,
  IconButton,
  Tooltip,
  Fade,
  Stack,
  Chip,
  InputAdornment
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';

const AccountManagement = () => {
  const [professors, setProfessors] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    role: '',
    professeur: null
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredProfessors = professors.filter(professor => {
    const searchStr = searchQuery.toLowerCase();
    const fullName = `${professor.nom} ${professor.prenom}`.toLowerCase();
    const speciality = professor.specialite.toLowerCase();
    const account = accounts.find(acc => acc.professeur?.id === professor.id);
    const login = account?.login?.toLowerCase() || '';
    
    return fullName.includes(searchStr) || 
           speciality.includes(searchStr) || 
           login.includes(searchStr);
  });

  useEffect(() => {
    fetchProfessors();
    fetchAccounts();
  }, []);


  const fetchProfessors = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/admin/professeurs');
      const data = await response.json();
      setProfessors(data);
    } catch (error) {
      showSnackbar('Erreur lors de la récupération des professeurs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await fetch('http://localhost:8081/admin/comptes');
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      showSnackbar('Erreur lors de la récupération des comptes', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8081/admin/compte/delete/${selectedAccount.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Échec de la suppression du compte');
      }

      await fetchAccounts();
      setOpenDeleteDialog(false);
      showSnackbar('Compte supprimé avec succès');
    } catch (error) {
      showSnackbar('Erreur lors de la suppression: ' + error.message, 'error');
    }
  };

  const handleOpenDialog = (professor, account = null) => {
    setSelectedProfessor(professor);
    setSelectedAccount(account);
    if (account) {
      setFormData({
        login: account.login,
        password: '',
        role: account.role,
        professeur: professor
      });
    } else {
      setFormData({
        login: '',
        password: '',
        role: 'PROFESSOR',
        professeur: professor
      });
    }
    setOpenDialog(true);
  };

  const handleOpenDeleteDialog = (account) => {
    setSelectedAccount(account);
    setOpenDeleteDialog(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleSubmit = async () => {
    if (!formData.login || !formData.password || !formData.role) {
      showSnackbar('Veuillez remplir tous les champs requis', 'error');
      return;
    }

    const accountDTO = {
      id: selectedAccount?.id,
      login: formData.login,
      password: formData.password,
      role: formData.role,
      professeur: {
        id: selectedProfessor.id,
        nom: selectedProfessor.nom,
        prenom: selectedProfessor.prenom,
        specialite: selectedProfessor.specialite
      }
    };

    try {
      let response;
      
      if (selectedAccount) {
        response = await fetch(`http://localhost:8081/admin/compte/update/${selectedAccount.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(accountDTO)
        });
      } else {
        response = await fetch('http://localhost:8081/admin/compte/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(accountDTO)
        });
      }

      if (!response.ok) {
        throw new Error('Échec de l\'enregistrement du compte');
      }

      await fetchAccounts();
      setOpenDialog(false);
      showSnackbar(selectedAccount ? 'Compte mis à jour avec succès' : 'Compte créé avec succès');
    } catch (error) {
      showSnackbar('Erreur: ' + error.message, 'error');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4,backgroundColor:'transparent' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, background: 'transparent' }}>
        <Typography variant="h4" gutterBottom sx={{ 
          mb: 4, 
          color: '#1a237e', 
          fontWeight: 600, 
          textAlign: 'center',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '4px',
            backgroundColor: 'transparent',
            borderRadius: '2px'
          }
        }}>
          Gestion des Comptes Professeurs
        </Typography>
        <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher par nom, spécialité ou identifiant..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            '& .MuiInputBase-input': {
              color: 'blue',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'blue',
                '& input': {
                    backgroundColor:'transparent'
                  },
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
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <TableContainer component={Paper} elevation={2} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1a237e' }}>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Nom Complet</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Spécialité</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Identifiant</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Rôle</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProfessors.map((professor) => {
              const account = accounts.find(acc => acc.professeur?.id === professor.id);
              return (
                <TableRow key={professor.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {`${professor.nom} ${professor.prenom}`}
                  </TableCell>
                  <TableCell>{professor.specialite}</TableCell>
                  <TableCell>
                    <Box sx={{ 
                      color: account ? 'success.main' : 'text.secondary',
                      fontStyle: account ? 'normal' : 'italic'
                    }}>
                      {account?.login || 'Pas de compte'}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {account?.role && (
                      <Chip
                        label={account.role === 'admin' ? 'Administrateur' : 'Professeur'}
                        color={account.role === 'admin' ? 'primary' : 'info'}
                        variant="filled"
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title={account ? "Modifier le compte" : "Créer un compte"} arrow>
                        <IconButton
                          onClick={() => handleOpenDialog(professor, account)}
                          color="primary"
                          size="small"
                        >
                          {account ? <EditIcon /> : <AddIcon />}
                        </IconButton>
                      </Tooltip>
                      {account && (
                        <Tooltip title="Supprimer le compte" arrow>
                          <IconButton
                            onClick={() => handleOpenDeleteDialog(account)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      </Paper>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="sm" 
        fullWidth
        TransitionComponent={Fade}
      >
        <DialogTitle sx={{ bgcolor: '#1a237e', color: 'white', py: 2, marginBottom:2 }}>
          {selectedAccount ? 'Modifier le Compte' : 'Créer un Compte'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, marginTop:2 }}>
          <Stack spacing={3}>
            <TextField
              name="login"
              label="Identifiant"
              fullWidth
              value={formData.login}
              onChange={handleInputChange}
              sx={{
                marginTop:4,
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
            />
            <TextField
              name="password"
              label="Mot de passe"
              type="password"
              fullWidth
              value={formData.password}
              sx={{
                mb:3,
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
              onChange={handleInputChange}
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Rôle</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                label="Rôle"
              >
                <MenuItem value="admin">Administrateur</MenuItem>
                <MenuItem value="professeur">Professeur</MenuItem>
              </Select>
            </FormControl>
            {selectedProfessor && (
              <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Professeur sélectionné
                </Typography>
                <Typography variant="body1">
                  {selectedProfessor.nom} {selectedProfessor.prenom}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Spécialité: {selectedProfessor.specialite}
                </Typography>
              </Paper>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, bgcolor: '#f5f5f5' }}>
          <Button onClick={() => setOpenDialog(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d1b60' } }}
          >
            {selectedAccount ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        TransitionComponent={Fade}
      >
        <DialogTitle>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer ce compte ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleDelete}
            color="error"
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AccountManagement;