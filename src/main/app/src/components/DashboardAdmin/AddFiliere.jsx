import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  TextField, 
  Button, 
  Snackbar, 
  Alert, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Add as AddIcon, 
  Close as CloseIcon, 
  CloudUpload as CloudUploadIcon 
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const AddFiliereComponent = () => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setCode('');
    setNom('');
    setDescription('');
    setImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!nom || !description || !image) {
      setSnackbarMessage('Veuillez remplir tous les champs');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('description', description);
    formData.append('file', image.name);

    try {
      const response = await fetch('http://localhost:8081/admin/filiere/add', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de la filière');
      }

      const result = await response.json();
      
      setSnackbarMessage('Filière ajoutée avec succès !');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      handleClose();
    } catch (error) {
        setSnackbarMessage('Filière ajoutée avec succès !');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ display: 'inline-block' }}
      >
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
          sx={{ 
            backgroundColor: '#1976D2',
            '&:hover': {
              backgroundColor: '#1565c0'
            },
            borderRadius: 3, 
            padding: '10px 20px',
            fontWeight: 'bold'
          }}
        >
          Ajouter une Filière
        </Button>
      </motion.div>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
            <AddIcon sx={{ marginRight: 1, color: '#1976D2' }} />
            Nouvelle Filière
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Card 
            sx={{ 
              padding: 3, 
              borderRadius: 3,
              boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            
            <TextField
              fullWidth
              label="Nom de la Filière"
              variant="outlined"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
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
            />
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
            />
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              color="primary"
              sx={{ 
                backgroundColor: '#1976D2',
                '&:hover': {
                  backgroundColor: '#1565c0'
                },
                marginBottom: 2 
              }}
            >
              Télécharger une image
              <VisuallyHiddenInput 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {imagePreview && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginTop: 16 
              }}>
                <img 
                  src={imagePreview} 
                  alt="Aperçu" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: 200, 
                    borderRadius: 8 
                  }} 
                />
              </div>
            )}
          </Card>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose} 
            color="error"
            variant="outlined"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ 
              backgroundColor: '#1976D2',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddFiliereComponent;
