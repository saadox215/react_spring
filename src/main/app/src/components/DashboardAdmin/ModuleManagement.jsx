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
  CircularProgress
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const ModuleManagementPage = () => {
  const [modules, setModules] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    nom: '',
    filiere: ''
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

  // Fetch modules and filières on component mount
  useEffect(() => {
    fetchModules();
    fetchFilieres();
  }, []);

  // Fetch all modules
  const fetchModules = async () => {
    setLoading(prev => ({ ...prev, modules: true }));
    try {
      const response = await fetch('http://localhost:8081/admin/modules');
      const data = await response.json();
      
      // Defensive check for modules array
      const moduleArray = Array.isArray(data) ? data : 
                          data.content ? data.content : 
                          data.data ? data.data : 
                          [];
      
      setModules(moduleArray);
    } catch (error) {
      handleError('Échec de la récupération des modules');
    } finally {
      setLoading(prev => ({ ...prev, modules: false }));
    }
  };

  // Fetch all filières
  const fetchFilieres = async () => {
    setLoading(prev => ({ ...prev, filieres: true }));
    try {
      const response = await fetch('http://localhost:8081/admin/filiere');
      const data = await response.json();
      
      // Defensive check for filieres array
      const filiereArray = Array.isArray(data) ? data : 
                           data.content ? data.content : 
                           data.data ? data.data : 
                           [];
      
      setFilieres(filiereArray);
    } catch (error) {
      handleError('Échec de la récupération des filières');
    } finally {
      setLoading(prev => ({ ...prev, filieres: false }));
    }
  };

  // Error handling with Snackbar
  const handleError = (message) => {
    console.error(message);
    setSnackbar({
      open: true,
      message,
      severity: 'error'
    });
  };

  // Close Snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add a new module
  const handleAddModule = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8081/admin/modules/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: null,
          nom: formData.nom,
          filiere: {
            id: formData.filiere
          }
        })
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Module ajouté avec succès',
          severity: 'success'
        });
        fetchModules();
        resetForm();
      } else {
        handleError('Échec de l\'ajout du module');
      }
    } catch (error) {
      handleError('Erreur lors de l\'ajout du module');
    }
  };

  // Update an existing module
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
          }
        })
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Module mis à jour avec succès',
          severity: 'success'
        });
        fetchModules();
        resetForm();
      } else {
        handleError('Échec de la mise à jour du module');
      }
    } catch (error) {
      handleError('Erreur lors de la mise à jour du module');
    }
  };

  // Prepare for delete with explicit ID handling
  const prepareDelete = (module) => {
    // Safely extract the module ID
    const moduleId = module?.id;
    if (moduleId) {
      setModuleToDelete(moduleId);
      setDeleteConfirmOpen(true);
    } else {
      handleError('Impossible de préparer la suppression : ID manquant');
    }
  };

  // Delete module with explicit ID usage
  const handleDeleteModule = async () => {
    if (!moduleToDelete) {
      handleError('Aucun module sélectionné pour la suppression');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/admin/modules/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: moduleToDelete // Send ID in request body
        })
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Module supprimé avec succès',
          severity: 'success'
        });
        fetchModules();
        setDeleteConfirmOpen(false);
        setModuleToDelete(null);
      } else {
        handleError('Échec de la suppression du module');
      }
    } catch (error) {
      handleError('Erreur lors de la suppression du module');
    }
  };

  // Prepare module for editing with robust error handling
  const prepareEdit = (module) => {
    // Validate module object structure
    if (!module) {
      handleError('Aucun module sélectionné pour modification');
      return;
    }

    try {
      // Use optional chaining and provide fallback values
      setFormData({
        id: module.id ?? null,
        nom: module.nom ?? '',
        // Handle nested filiere with additional safety
        filiere: module.filiere?.id ?? 
                 (module.filiereId ?? 
                  (module.filiere ?? ''))
      });
      setIsEditing(true);
    } catch (error) {
      handleError('Erreur lors de la préparation de la modification');
      console.error('Edit preparation error:', error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: null,
      nom: '',
      filiere: ''
    });
    setIsEditing(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Card>
        <CardHeader 
          title={
            <Typography variant="h6" component="div">
              {isEditing ? 'Modifier un Module' : 'Ajouter un Module'}
            </Typography>
          }
        />
        <CardContent>
          <form onSubmit={isEditing ? handleUpdateModule : handleAddModule}>
            <Grid container spacing={2}>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="nom"
                  label="Nom du Module"
                  value={formData.nom}
                  onChange={handleInputChange}
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
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  name="filiere"
                  label="Filière"
                  value={formData.filiere}
                  onChange={handleInputChange}
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
                  variant="outlined"
                  required
                  disabled={loading.filieres}
                >
                  {loading.filieres ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} /> Chargement...
                    </MenuItem>
                  ) : filieres.length > 0 ? (
                    filieres.map((filiere) => (
                      <MenuItem key={filiere.id} value={filiere.id}>
                        {filiere.nom}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      Aucune filière disponible
                    </MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary"
                      disabled={loading.modules || loading.filieres}
                    >
                      {isEditing ? 'Mettre à Jour' : 'Ajouter'}
                    </Button>
                  </Grid>
                  {isEditing && (
                    <Grid item>
                      <Button 
                        variant="outlined" 
                        color="secondary"
                        onClick={resetForm}
                      >
                        Annuler
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Card sx={{ mt: 3 }}>
        <CardHeader 
          title={
            <Typography variant="h6" component="div">
              Liste des Modules
            </Typography>
          }
        />
        <CardContent>
          {loading.modules ? (
            <Grid container justifyContent="center">
              <CircularProgress />
            </Grid>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell>Filière</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {modules.length > 0 ? (
                    modules.map((module) => (
                      <TableRow key={module.id}>
                        <TableCell>{module.id}</TableCell>
                        <TableCell>{module.nom}</TableCell>
                        <TableCell>{module.filiereNom || module.filiere?.nom || 'N/A'}</TableCell>
                        <TableCell>
                          <Button 
                            startIcon={<Edit />}
                            variant="outlined" 
                            color="primary" 
                            size="small"
                            sx={{ mr: 1 }}
                            onClick={() => {
                              try {
                                prepareEdit(module);
                              } catch (error) {
                                handleError('Erreur lors de la modification du module');
                                console.error(error);
                              }
                            }}
                          >
                            Modifier
                          </Button>
                          <Button 
                            startIcon={<Delete />}
                            variant="outlined" 
                            color="error" 
                            size="small"
                            onClick={() => {
                              try {
                                prepareDelete(module);
                              } catch (error) {
                                handleError('Erreur lors de la préparation de la suppression');
                                console.error(error);
                              }
                            }}
                          >
                            Supprimer
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Aucun module trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer ce module ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDeleteModule} color="error" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ModuleManagementPage;