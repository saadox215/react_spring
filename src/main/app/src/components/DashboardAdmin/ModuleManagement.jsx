import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
  Fade,
  IconButton,
  Divider,
  useTheme
} from '@mui/material';
import {
  Edit,
  Delete,
  School,
  Add as AddIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  BookmarkBorder as ModuleIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  borderRadius: '15px',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  transition: 'transform 0.3s ease-in-out',
  marginBottom: theme.spacing(3),
  '&:hover': {
    transform: 'translateY(-5px)',
  }
}));
const SEMESTER_TYPES = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '15px',
  overflow: 'hidden',
  '& .MuiTableHead-root': {
    backgroundColor: theme.palette.primary.main,
    '& .MuiTableCell-head': {
      color: theme.palette.common.white,
      fontWeight: 'bold',
      fontSize: '1rem'
    }
  },
  '& .MuiTableRow-root': {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.selected,
    }
  },
  '& .MuiTableCell-root': {
    padding: theme.spacing(2),
  }
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  transition: 'all 0.3s ease-in-out',
  borderRadius: '8px',
  textTransform: 'none',
  padding: '8px 16px',
  '&:hover': {
    transform: 'scale(1.05)',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      }
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: '2px',
      }
    }
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary
  }
}));

const LoadingOverlay = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
}));

const ModuleManagementPage = () => {
  const theme = useTheme();
  const [modules, setModules] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    nom: '',
    filiere: '',
    semesterType: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);
  const [loading, setLoading] = useState({
    modules: false,
    filieres: false
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchModules();
    fetchFilieres();
  }, []);

  const fetchModules = async () => {
    setLoading(prev => ({ ...prev, modules: true }));
    try {
      const response = await fetch('http://localhost:8081/admin/modules');
      const data = await response.json();
      setModules(Array.isArray(data) ? data : data.content || data.data || []);
      showSnackbar('Modules chargés avec succès', 'success');
    } catch (error) {
      showSnackbar('Échec de la récupération des modules', 'error');
    } finally {
      setLoading(prev => ({ ...prev, modules: false }));
    }
  };

  const fetchFilieres = async () => {
    setLoading(prev => ({ ...prev, filieres: true }));
    try {
      const response = await fetch('http://localhost:8081/admin/filiere');
      const data = await response.json();
      setFilieres(Array.isArray(data) ? data : data.content || data.data || []);
    } catch (error) {
      showSnackbar('Échec de la récupération des filières', 'error');
    } finally {
      setLoading(prev => ({ ...prev, filieres: false }));
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8081/admin/modules/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: formData.nom,
          filiere: {
            id: formData.filiere
          },
          semesterType: formData.semesterType
        })
      });
      if (response.ok) {
        showSnackbar('Module ajouté avec succès');
        fetchModules();
        resetForm();
      } else {
        showSnackbar('Échec de l\'ajout du module', 'error');
      }
    } catch (error) {
      showSnackbar('Erreur lors de l\'ajout du module', 'error');
    }
  };

  const handleUpdateModule = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8081/admin/modules/update/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: formData.id,
          nom: formData.nom,
          filiere: {
            id: formData.filiere
          },
          semesterType: formData.semesterType
        })
      });

      if (response.ok) {
        showSnackbar('Module mis à jour avec succès');
        fetchModules();
        resetForm();
      } else {
        showSnackbar('Échec de la mise à jour du module', 'error');
      }
    } catch (error) {
      showSnackbar('Erreur lors de la mise à jour du module', 'error');
    }
  };

  const handleDeleteModule = async () => {
    if (!moduleToDelete) return;

    try {
      const response = await fetch(`http://localhost:8081/admin/modules/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: moduleToDelete
        })
      });

      if (response.ok) {
        showSnackbar('Module supprimé avec succès');
        fetchModules();
      } else {
        showSnackbar('Échec de la suppression du module', 'error');
      }
    } catch (error) {
      showSnackbar('Erreur lors de la suppression du module', 'error');
    } finally {
      setDeleteConfirmOpen(false);
      setModuleToDelete(null);
    }
  };

  const prepareEdit = (module) => {
    setFormData({
      id: module.id,
      nom: module.nom,
      filiere: module.filiere?.id || ''
    });
    setIsEditing(true);
  };

  const prepareDelete = (module) => {
    setModuleToDelete(module.id);
    setDeleteConfirmOpen(true);
  };

  const resetForm = () => {
    setFormData({
      id: null,
      nom: '',
      filiere: ''
    });
    setIsEditing(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <StyledCard>
        <CardHeader
          avatar={
            <ModuleIcon color="primary" sx={{ fontSize: 40 }} />
          }
          title={
            <Typography variant="h5" color="primary" fontWeight="bold">
              {isEditing ? 'Modifier un Module' : 'Ajouter un Module'}
            </Typography>
          }
          action={
            <IconButton 
              onClick={fetchModules} 
              color="primary"
              sx={{ 
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.15)',
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          }
        />
        <Divider sx={{ mx: 2 }} />
        <CardContent>
          <form onSubmit={isEditing ? handleUpdateModule : handleAddModule}>
            <Grid container spacing={3} >
              <Grid item xs={12} md={6}>
              <StyledTextField
  fullWidth
  name="nom"
  label="Nom du Module"
  value={formData.nom}
  onChange={handleInputChange}
  sx={{
    flexGrow: 1,
    '& .MuiInputBase-input': {
      color: '#7A4DFF',  // Couleur violet froid pour le texte
    },
    '& input': {
      backgroundColor: 'transparent'
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#7A4DFF',  // Couleur violet froid pour la bordure
      },
      '&:hover fieldset': {
        borderColor: '#6A40E3',  // Un violet légèrement plus foncé au survol
      },
      '&.Mui-focused fieldset': {
        borderColor: '#7A4DFF',  // Maintien du violet froid en focus
      },
    },
    '& .MuiInputLabel-root': {
      color: '#7A4DFF',  // Couleur violet froid pour le label
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#6A40E3',  // Couleur violet plus foncé lorsque le label est en focus
    },
  }}
/>


              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  select
                  fullWidth
                  name="filiere"
                  label="Filière"
                  value={formData.filiere}
                  onChange={handleInputChange}
                  sx={{
                    flexGrow: 1,
                    '& .MuiInputBase-input': {
                      color: '#7A4DFF',  // Couleur violet froid pour le texte
                    },
                    '& input': {
                      backgroundColor: 'transparent'
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#7A4DFF', 
                      },
                      '&:hover fieldset': {
                        borderColor: '#6A40E3',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#7A4DFF',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#7A4DFF',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#6A40E3', 
                    },
                  }}
                  required
                  variant="outlined"
                  disabled={loading.filieres}
                >
                  {loading.filieres ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} /> Chargement...
                    </MenuItem>
                  ) : filieres.map((filiere) => (
                    <MenuItem key={filiere.id} value={filiere.id}>
                      {filiere.nom}
                    </MenuItem>
                  ))}
                </StyledTextField>
              </Grid>
              <Grid item xs={12} md={4}>
    <StyledTextField
      select
      fullWidth
      name="semesterType"
      label="Semestre"
      value={formData.semesterType}
      onChange={handleInputChange}
      sx={{
        flexGrow: 1,
        '& .MuiInputBase-input': {
          color: '#7A4DFF',
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#7A4DFF',
          },
          '&:hover fieldset': {
            borderColor: '#6A40E3',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#7A4DFF',
          },
        },
        '& .MuiInputLabel-root': {
          color: '#7A4DFF',
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#6A40E3',
        },
      }}
      required
      variant="outlined"
    >
      {SEMESTER_TYPES.map((semester) => (
        <MenuItem key={semester} value={semester}>
          {semester}
        </MenuItem>
      ))}
    </StyledTextField>
  </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <AnimatedButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading.modules || loading.filieres}
                    startIcon={isEditing ? <SaveIcon /> : <AddIcon />}
                  >
                    {isEditing ? 'Mettre à jour' : 'Ajouter'}
                  </AnimatedButton>
                  {isEditing && (
                    <AnimatedButton
                      variant="outlined"
                      color="secondary"
                      onClick={resetForm}
                      startIcon={<CancelIcon />}
                    >
                      Annuler
                    </AnimatedButton>
                  )}
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </StyledCard>

      <StyledCard backgroundColor='transparent'>
        <CardHeader
          title={
            <Typography variant="h5" color="primary" fontWeight="bold">
              Liste des Modules
            </Typography>
          }
        />
        <Divider sx={{ mx: 2 }} />
        <CardContent>
          {loading.modules ? (
            <LoadingOverlay>
              <CircularProgress />
            </LoadingOverlay>
          ) : (
            <Fade in={!loading.modules}>
              <StyledTableContainer component={Paper}>
                <Table>
                <TableHead>
  <TableRow>
    <TableCell>ID</TableCell>
    <TableCell>Nom</TableCell>
    <TableCell>Filière</TableCell>
    <TableCell>Semestre</TableCell>
    <TableCell align="center">Actions</TableCell>
  </TableRow>
</TableHead>
                  <TableBody>
                    {modules.length > 0 ? (
                      modules.map((module) => (
                        <TableRow key={module.id}>
                          <TableCell>{module.id}</TableCell>
                          <TableCell>{module.nom}</TableCell>
                          <TableCell>{module.filiereNom || module.filiere?.nom || 'N/A'}</TableCell>
                          <TableCell>{module.semesterType}</TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <AnimatedButton
                                startIcon={<Edit />}
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={() => prepareEdit(module)}
                              >
                                Modifier
                              </AnimatedButton>
                              <AnimatedButton
                                startIcon={<Delete />}
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => prepareDelete(module)}
                              >
                                Supprimer
                              </AnimatedButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body1" color="textSecondary">
                            Aucun module trouvé
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            </Fade>
          )}
          
        </CardContent>
      </StyledCard>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '8px'
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: theme.palette.error.light,
          color: theme.palette.error.contrastText,
          borderRadius: '8px 8px 0 0'
        }}>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer ce module ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <AnimatedButton
            onClick={() => setDeleteConfirmOpen(false)}
            color="primary"
            variant="outlined"
          >
            Annuler
          </AnimatedButton>
          <AnimatedButton
            onClick={handleDeleteModule}
            color="error"
            variant="contained"
            startIcon={<Delete />}
            autoFocus
          >
            Supprimer
          </AnimatedButton>
        </DialogActions>
      </Dialog>

      {/* Loading Backdrop for full-page loading states */}
      <Dialog
        open={loading.modules && loading.filieres}
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'hidden'
          }
        }}
      >
        <CircularProgress />
      </Dialog>
    </Container>
  );
};

// Custom hook for handling API calls (optional enhancement)
const useAPI = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8081/admin/${endpoint}`);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return { data, loading, error, refetch: fetchData };
};

export default ModuleManagementPage;