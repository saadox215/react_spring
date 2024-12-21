import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  TextField,
  IconButton,
  DialogContent,
  DialogTitle,
  DialogActions,
  Snackbar,
  Alert,
  Grow,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  PersonAdd as PersonAddIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

// Custom styled components
const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '5px',
    background: 'linear-gradient(90deg, #2196F3 0%, #00BCD4 50%, #3F51B5 100%)',
  },
}));

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledGrid = styled(Grid)({
  animation: `${fadeIn} 0.5s ease-out`,
});

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 10px 4px rgba(33, 203, 243, .3)',
  },
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    transition: 'all 0.3s ease',
    '&:hover': {
      '& fieldset': {
        borderColor: '#2196F3',
      },
    },
    '&.Mui-focused': {
      '& fieldset': {
        borderColor: '#2196F3',
      },
    },
  },
}));

const ProfesseurManagement = () => {
  const [professeurs, setProfesseurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('nom');
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProfesseur, setSelectedProfesseur] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [professorToDelete, setProfessorToDelete] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    specialite: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchProfesseurs();
  }, []);

  const fetchProfesseurs = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/admin/professeurs');
      const data = await response.json();
      setProfesseurs(data);
    } catch (error) {
      showSnackbar('Erreur de chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const url = selectedProfesseur
        ? `http://localhost:8081/admin/professeurs/update/${selectedProfesseur.id}`
        : 'http://localhost:8081/admin/professeurs/add';
      
      const response = await fetch(url, {
        method: selectedProfesseur ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showSnackbar(selectedProfesseur ? 'Professeur modifié ✨' : 'Nouveau professeur ajouté ✨', 'success');
        handleCloseDialog();
        fetchProfesseurs();
      }
    } catch (error) {
      showSnackbar('Une erreur est survenue', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!professorToDelete) return;
    setLoading(true);
    try {
      await fetch(`http://localhost:8081/admin/professeurs/delete/${professorToDelete.id}`, {
        method: 'DELETE'
      });
      showSnackbar('Professeur supprimé ✨', 'success');
      setOpenDeleteDialog(false);
      setProfessorToDelete(null);
      fetchProfesseurs();
    } catch (error) {
      showSnackbar('Erreur lors de la suppression', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProfesseur(null);
    setFormData({ nom: '', prenom: '', specialite: '' });
  };

  const filteredProfesseurs = professeurs.filter(prof => {
    const searchValue = prof[searchCriteria].toLowerCase();
    return searchValue.includes(searchTerm.toLowerCase());
  });

  return (
    <Box sx={{ p: 4, background: 'transparent', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SchoolIcon sx={{ fontSize: 40, color: '#2196F3' }} />
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold', 
              background: 'linear-gradient(45deg, #2196F3, #21CBF3)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}>
              Gestion des Professeurs
            </Typography>
          </Box>
          <GradientButton
            startIcon={<PersonAddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Nouveau Professeur
          </GradientButton>
        </Box>

        {/* Search Section */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <Select
              value={searchCriteria}
              onChange={(e) => setSearchCriteria(e.target.value)}
              size="small"
              sx={{ height: '48px' }}
            >
              <MenuItem value="nom">Nom</MenuItem>
              <MenuItem value="prenom">Prénom</MenuItem>
              <MenuItem value="specialite">Spécialité</MenuItem>
            </Select>
          </FormControl>
          <SearchTextField
            fullWidth
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
            }}
            sx={{
              flex: 1 ,
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
          <GradientButton
            startIcon={<RefreshIcon />}
            onClick={fetchProfesseurs}
          >
            Actualiser
          </GradientButton>
        </Box>
      </Box>

      {/* Professors Grid */}
      <Grid container spacing={3}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          filteredProfesseurs.map((professeur, index) => (
            <Grow in={true} timeout={index * 200} key={professeur.id}>
              <StyledGrid item xs={12} sm={6} md={4}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 'bold' }}>
                      Prof. {professeur.nom} {professeur.prenom}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Spécialité:</strong> {professeur.specialite}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                      <strong>Code:</strong> {professeur.id}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton 
                        color="primary" 
                        onClick={() => {
                          setSelectedProfesseur(professeur);
                          setFormData(professeur);
                          setOpenDialog(true);
                        }}
                        sx={{ '&:hover': { transform: 'scale(1.1)' } }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => {
                          setProfessorToDelete(professeur);
                          setOpenDeleteDialog(true);
                        }}
                        sx={{ '&:hover': { transform: 'scale(1.1)' } }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </StyledCard>
              </StyledGrid>
            </Grow>
          ))
        )}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white'
        }}>
          {selectedProfesseur ? 'Modifier le professeur' : 'Ajouter un professeur'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2, minWidth: 400 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Nom"
              name="nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              sx={{
                marginBottom: 2,
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
              fullWidth
            />
            <TextField
              label="Prénom"
              name="prenom"
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              sx={{
                marginBottom: 2,
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
              fullWidth
            />
            <TextField
              label="Spécialité"
              name="specialite"
              value={formData.specialite}
              onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
              sx={{
                marginBottom: 2,
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
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Annuler
          </Button>
          <GradientButton onClick={handleSubmit} disabled={loading}>
            {selectedProfesseur ? 'Modifier' : 'Ajouter'}
          </GradientButton>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer le professeur {professorToDelete?.nom} {professorToDelete?.prenom} ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="inherit">
            Annuler
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfesseurManagement;