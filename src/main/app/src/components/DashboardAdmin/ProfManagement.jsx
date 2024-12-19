import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  DialogContentText,
  Alert, 
  IconButton,
  Box,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from '@mui/icons-material';

const ProfesseurManagement = () => {
  const [professeurs, setProfesseurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('nom');
  const [selectedProfesseur, setSelectedProfesseur] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [professorToDelete, setProfessorToDelete] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    specialite: ''
  });
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    fetchProfesseurs();
  }, []);

  const fetchProfesseurs = async () => {
    try {
      const response = await fetch('http://localhost:8081/admin/professeurs');
      if (!response.ok) {
        throw new Error('Erreur de chargement');
      }
      const data = await response.json();
      setProfesseurs(data);
    } catch (error) {
      showAlert('Erreur de chargement', 'error');
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlertMessage({ message, type });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredProfesseurs = professeurs.filter(prof => {
    const searchValue = prof[searchCriteria].toLowerCase();
    return searchValue.includes(searchTerm.toLowerCase());
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProfesseur = async () => {
    try {
      const response = await fetch('http://localhost:8081/admin/professeurs/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout');
      }

      fetchProfesseurs();
      setIsModalOpen(false);
      showAlert('Professeur ajouté avec succès');
      resetForm();
    } catch (error) {
      showAlert('Erreur lors de l\'ajout', 'error');
    }
  };

  const handleUpdateProfesseur = async () => {
    try {
      const response = await fetch(`http://localhost:8081/admin/professeurs/update/${selectedProfesseur.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      fetchProfesseurs();
      setIsModalOpen(false);
      showAlert('Professeur mis à jour avec succès');
      resetForm();
    } catch (error) {
      showAlert('Erreur lors de la mise à jour', 'error');
    }
  };

  const handleDeleteProfesseur = async () => {
    if (!professorToDelete) return;

    try {
      const response = await fetch(`http://localhost:8081/admin/professeurs/delete/${professorToDelete.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      fetchProfesseurs();
      showAlert('Professeur supprimé avec succès');
      setIsDeleteConfirmOpen(false);
      setProfessorToDelete(null);
    } catch (error) {
      showAlert('Erreur lors de la suppression', 'error');
    }
  };

  const openDeleteConfirmation = (professeur) => {
    setProfessorToDelete(professeur);
    setIsDeleteConfirmOpen(true);
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      specialite: ''
    });
    setSelectedProfesseur(null);
  };

  const openEditModal = (professeur) => {
    setSelectedProfesseur(professeur);
    setFormData({
      nom: professeur.nom,
      prenom: professeur.prenom,
      specialite: professeur.specialite
    });
    setIsModalOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center" 
          color="primary"
        >
          Gestion des Professeurs
        </Typography>

        {alertMessage && (
          <Alert 
            severity={alertMessage.type === 'error' ? 'error' : 'success'}
            sx={{ mb: 2 }}
          >
            {alertMessage.message}
          </Alert>
        )}

        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            mb: 2 
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexGrow: 1, 
              mr: 2 
            }}
          >
            <FormControl sx={{ width: 200, mr: 1 }}>
              <Select
                value={searchCriteria}
                onChange={(e) => setSearchCriteria(e.target.value)}
                size="small"
                displayEmpty
              >
                <MenuItem value="nom">Nom</MenuItem>
                <MenuItem value="prenom">Prénom</MenuItem>
                <MenuItem value="specialite">Spécialité</MenuItem>
              </Select>
            </FormControl>

            <TextField
              variant="outlined"
              placeholder="Rechercher"
              value={searchTerm}
              size="small"
              sx={{
                flexGrow: 1,
                '& .MuiOutlinedInput-root': {
                  height: '40px',
                  '& input': {
                    padding: '10px',
                    backgroundColor:'transparent'
                  }
                },
                '& .MuiInputBase-input': {
                  color: 'blue', 
                },
              }}
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1, fontSize: 20 }} />
              }}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ height: '40px' }}
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
          >
            Ajouter
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Prénom</TableCell>
                <TableCell>Spécialité</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProfesseurs.map((professeur) => (
                <TableRow key={professeur.id}>
                  <TableCell>{professeur.id}</TableCell>
                  <TableCell>{professeur.nom}</TableCell>
                  <TableCell>{professeur.prenom}</TableCell>
                  <TableCell>{professeur.specialite}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      color="primary" 
                      onClick={() => openEditModal(professeur)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => openDeleteConfirmation(professeur)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredProfesseurs.length === 0 && (
          <Typography 
            variant="body1" 
            color="textSecondary" 
            align="center" 
            sx={{ mt: 4 }}
          >
            Aucun professeur trouvé
          </Typography>
        )}

        {/* Boîte de dialogue de confirmation de suppression */}
        <Dialog
          open={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirmer la suppression"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Êtes-vous sûr de vouloir supprimer le professeur {professorToDelete?.nom} {professorToDelete?.prenom} ?
              Cette action est irréversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setIsDeleteConfirmOpen(false)} 
              color="secondary"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleDeleteProfesseur} 
              color="error" 
              variant="contained" 
              autoFocus
            >
              Confirmer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Boîte de dialogue d'ajout/modification */}
        <Dialog 
          open={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>
            {selectedProfesseur ? 'Modifier' : 'Ajouter'} un Professeur
          </DialogTitle>
          <DialogContent>
            <TextField
              name="nom"
              label="Nom"
              fullWidth
              margin="normal"
              value={formData.nom}
              sx={{
                marginBottom: 2,
                '& .MuiInputBase-input': {
                  color: 'blue', 
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
            />
            <TextField
              name="prenom"
              label="Prénom"
              fullWidth
              margin="normal"
              value={formData.prenom}
              sx={{
                marginBottom: 2,
                '& .MuiInputBase-input': {
                  color: 'blue', 
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
            />
            <TextField
              name="specialite"
              label="Spécialité"
              fullWidth
              margin="normal"
              value={formData.specialite}
              sx={{
                marginBottom: 2,
                '& .MuiInputBase-input': {
                  color: 'blue', 
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
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setIsModalOpen(false)}
              color="secondary"
            >
              Annuler
            </Button>
            <Button 
              onClick={selectedProfesseur ? handleUpdateProfesseur : handleAddProfesseur}
              color="primary"
              variant="contained"
            >
              {selectedProfesseur ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default ProfesseurManagement;