import React, { useState, useEffect } from 'react';
import { 
    Card, 
    Typography, 
    Button, 
    Skeleton, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    TextField,
    Snackbar,
    Alert
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SchoolIcon from '@mui/icons-material/School';
import EditIcon from '@mui/icons-material/Edit';
import MoreIcon from '@mui/icons-material/More';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';
import AddFiliere from './AddFiliere';
import './Filiere.css';

const FilierePage = () => {
    const [filieres, setFilieres] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
    const [currentFiliere, setCurrentFiliere] = useState(null);
    
    // New state for download feedback
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchFilieres = async () => {
            try {
                const response = await fetch('http://localhost:8081/admin/filiere');
                console.log(response);
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des filières');
                }

                const data = await response.json();
                setFilieres(data);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchFilieres();
    }, []);

    const handlePdfDownload = (filiere) => {
        
            const pdfPath = `http://localhost:8081${filiere.pdfPath}`;
        
            window.open(pdfPath, '_blank');
    
            setSnackbarMessage(`Redirection vers le PDF de ${filiere.nom} réussie`);
            setSnackbarSeverity('info'); 
            setOpenSnackbar(true);
        
        
    };

    const confirmDeleteFiliere = (filiere) => {
        setCurrentFiliere(filiere);
        setOpenDeleteConfirmDialog(true);
    };

    const deleteFiliere = async () => {
        if (!currentFiliere) return;

        try {
            const response = await fetch(`http://localhost:8081/admin/filiere/delete/${currentFiliere.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression de la filière');
            }

            setFilieres((prevFilieres) => prevFilieres.filter((filiere) => filiere.id !== currentFiliere.id));
            setOpenDeleteConfirmDialog(false);
            setCurrentFiliere(null);
        } catch (err) {
            setError(err.message);
            setOpenDeleteConfirmDialog(false);
        }
    };

    const openUpdateFiliere = (filiere) => {
        setCurrentFiliere({ ...filiere });
        setOpenUpdateDialog(true);
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setCurrentFiliere(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const submitUpdateFiliere = async () => {
        try {
            const response = await fetch(`http://localhost:8081/admin/filiere/update/${currentFiliere.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nom: currentFiliere.nom,
                    description: currentFiliere.description
                })
            });
    
            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour de la filière');
            }
    
            setFilieres(prevFilieres => 
                prevFilieres.map(filiere => 
                    filiere.id === currentFiliere.id 
                        ? { ...filiere, nom: currentFiliere.nom, description: currentFiliere.description } 
                        : filiere
                )
            );
    
            setOpenUpdateDialog(false);
        } catch (err) {
            setError(err.message);
        }
    };
 
    if (isLoading) {
        return (
            <div className="loading-container">
                {[1, 2, 3].map((item) => (
                    <Skeleton 
                        key={item} 
                        variant="rectangular" 
                        width={350} 
                        height={400} 
                        sx={{ 
                            borderRadius: 3, 
                            marginBottom: 4 
                        }} 
                    />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <ErrorOutlineIcon sx={{ fontSize: 80, color: 'red', marginBottom: 2 }} />
                <Typography variant="h5" color="error" align="center">
                    {error}
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => window.location.reload()}
                    sx={{ marginTop: 2 }}
                >
                    Réessayer
                </Button>
            </div>
        );
    }

    return (
        <div className="filiere-page-container">
            <div className="filiere-header">
                <SchoolIcon sx={{ fontSize: 50, marginRight: 2, color: '#1976D2' }} />
                <Typography sx={{ marginRight: 2 }} variant="h4" className="filiere-title">
                    Nos Filières de Formation
                </Typography>
                <AddFiliere />
            </div>

            {filieres.length === 0 ? (
                <div className="no-filieres-container">
                    <Typography variant="h6" color="textSecondary" align="center">
                        Aucune filière n'est actuellement disponible
                    </Typography>
                </div>
            ) : (
                <motion.div 
                    className="filieres-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {filieres.map((filiere) => (
                        <motion.div
                            key={filiere.id}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Card 
                                className="filiere-card"
                                sx={{
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                                        transform: 'translateY(-10px)',
                                    }
                                }}
                            >
                                {filiere.imagePath && (
                                    <div className="filiere-image-container">
                                        <img
                                            src={`http://localhost:8081${filiere.imagePath}`}
                                            alt={filiere.nom}
                                            className="filiere-image"
                                        />
                                    </div>
                                )}

                                <div className="filiere-content">
                                    <Typography variant="h6" className="filiere-name">
                                        {filiere.nom}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        color="textSecondary" 
                                        className="filiere-description"
                                        sx={{ marginBottom: 2 }}
                                    >
                                        {filiere.description}
                                    </Typography>
                                    <Button 
                                        variant="outlined" 
                                        color="primary" 
                                        size="small" 
                                        className="learn-more-btn"
                                        startIcon={<MoreIcon />}
                                        sx={{ marginRight: 2, marginBottom: 2 }}
                                        onClick={() => handlePdfDownload(filiere)}
                                        disabled={!filiere.pdfPath}
                                    >
                                        {filiere.pdfPath ? 'En savoir plus' : 'Pas de PDF'}
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="warning"
                                        size="small"
                                        className="update-btn"
                                        startIcon={<EditIcon />}
                                        sx={{ marginRight: 2, marginBottom: 2 }}
                                        onClick={() => openUpdateFiliere(filiere)}
                                    >
                                        Modifier
                                    </Button>
                                    
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        className="delete-btn"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => confirmDeleteFiliere(filiere)}
                                    >
                                        Supprimer
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            )}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setOpenSnackbar(false)}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Update Dialog */}
            <Dialog 
                open={openUpdateDialog} 
                onClose={() => setOpenUpdateDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Modifier la Filière</DialogTitle>
                <DialogContent>
                    {currentFiliere && (
                        <div>
                            <TextField
                                margin="dense"
                                name="nom"
                                label="Nom de la Filière"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={currentFiliere.nom}
                                onChange={handleUpdateChange}
                                sx={{
                                    marginBottom: 2,
                                    '& .MuiInputBase-input': {
                                      color: 'black', 
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
                                margin="dense"
                                name="description"
                                label="Description"
                                type="text"
                                fullWidth
                                variant="outlined"
                                multiline
                                rows={4}
                                value={currentFiliere.description}
                                onChange={handleUpdateChange}
                                sx={{
                                    marginBottom: 2,
                                    '& .MuiInputBase-input': {
                                      color: 'black', 
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
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setOpenUpdateDialog(false)} 
                        color="primary"
                    >
                        Annuler
                    </Button>
                    <Button 
                        onClick={submitUpdateFiliere} 
                        color="primary" 
                        variant="contained"
                    >
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteConfirmDialog}
                onClose={() => setOpenDeleteConfirmDialog(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Confirmer la suppression</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Êtes-vous sûr de vouloir supprimer la filière "{currentFiliere?.nom}" ?
                        Cette action est irréversible.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setOpenDeleteConfirmDialog(false)} 
                        color="primary"
                    >
                        Annuler
                    </Button>
                    <Button 
                        onClick={deleteFiliere} 
                        color="error" 
                        variant="contained"
                    >
                        Confirmer
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default FilierePage;