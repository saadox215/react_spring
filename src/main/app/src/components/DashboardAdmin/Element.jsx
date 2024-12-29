import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  Tooltip,
  useTheme,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Functions as CoefIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';

const API_BASE_URL = 'http://localhost:8081/admin';

const ElementManagement = () => {
  const theme = useTheme();
  
  // State management
  const [elements, setElements] = useState([]);
  const [modules, setModules] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [editingElement, setEditingElement] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    moduleId: '',
    professeurId: '',
    coefficient: ''
  });

  // Initial data fetching
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchElements(),
          fetchModules(),
          fetchProfessors()
        ]);
      } catch (error) {
        showSnackbar('Error loading initial data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // API calls
  const fetchElements = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/elements`);
      if (!response.ok) throw new Error('Failed to fetch elements');
      const data = await response.json();
      setElements(data);
      return data;
    } catch (error) {
      throw new Error('Error fetching elements: ' + error.message);
    }
  };

  const fetchModules = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/modules`);
      if (!response.ok) throw new Error('Failed to fetch modules');
      const data = await response.json();
      setModules(data);
      return data;
    } catch (error) {
      throw new Error('Error fetching modules: ' + error.message);
    }
  };

  const fetchProfessors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/professeurs`);
      if (!response.ok) throw new Error('Failed to fetch professors');
      const data = await response.json();
      setProfessors(data);
      return data;
    } catch (error) {
      throw new Error('Error fetching professors: ' + error.message);
    }
  };

  // Form handling
  const resetFormData = () => {
    setFormData({
      nom: '',
      moduleId: '',
      professeurId: '',
      coefficient: '',
    });
    setShowPassword(false);
  };

  const handleOpenDialog = (element = null) => {
    if (element) {
      setFormData({
        nom: element.nom || '',
        moduleId: element.moduleId?.toString() || '',
        professeurId: element.professeurId?.toString() || '',
        coefficient: element.coefficient?.toString() || '',
      });
      setEditingElement(element);
    } else {
      resetFormData();
      setEditingElement(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetFormData();
    setEditingElement(null);
  };
  const calculateMaxCoefficient = (moduleId) => {
    if (!moduleId) return 100;
    
    const selectedModuleElements = elements.filter(element => 
      element.moduleId === parseInt(moduleId) && 
      (!editingElement || element.id !== editingElement.id)
    );
    
    const totalUsedCoefficient = selectedModuleElements.reduce((sum, element) => 
      sum + (parseFloat(element.coefficient) || 0), 0);
      
    return 100 - totalUsedCoefficient;
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} with value:`, value); // Pour le débogage
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const validateForm = () => {
    // Validation plus stricte
    if (!formData.nom?.trim()) {
      showSnackbar('Name is required', 'error');
      return false;
    }
  
    if (!formData.moduleId || isNaN(parseInt(formData.moduleId))) {
      showSnackbar('Valid module selection is required', 'error');
      return false;
    }
  
    if (!formData.professeurId || isNaN(parseInt(formData.professeurId))) {
      showSnackbar('Valid professor selection is required', 'error');
      return false;
    }
  
    const coefficient = parseFloat(formData.coefficient);
    if (!coefficient || isNaN(coefficient) || coefficient <= 0) {
      showSnackbar('Valid coefficient is required', 'error');
      return false;
    }
  
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    setLoading(true);
    try {
      const moduleId = parseInt(formData.moduleId);
      const professeurId = parseInt(formData.professeurId);
  
      const payload = {
        nom: formData.nom.trim(),
        coefficient: parseFloat(formData.coefficient),
        module: {
          id: moduleId
        },
        professeur: {
          id: professeurId
        }
      };
  
      console.log('Payload being sent:', JSON.stringify(payload, null, 2));
  
      const response = await fetch(`${API_BASE_URL}/elements/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(errorText || 'Failed to add element');
      }
  
      const result = await response.json();
      console.log('Server response success:', result);
  
      await fetchElements();
      showSnackbar('Element added successfully');
      handleCloseDialog();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      showSnackbar(error.message || 'Failed to add element', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/elements/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: deleteItemId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete element');
      }

      showSnackbar('Element deleted successfully');
      await fetchElements();
    } catch (error) {
      showSnackbar(error.message || 'Error deleting element', 'error');
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false);
      setDeleteItemId(null);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteItemId(id);
    setOpenDeleteDialog(true);
  };
const checkCoefficientLimit = (moduleId, newCoefficient) => {
  const selectedModuleElements = elements.filter(element => 
    element.module?.id === parseInt(moduleId) && 
    (!editingElement || element.id !== editingElement.id)
  );
  
  const totalCoefficient = selectedModuleElements.reduce((sum, element) => 
    sum + (parseFloat(element.coefficient) || 0), 0);
  
  const newTotal = totalCoefficient + parseFloat(newCoefficient);
  
  if (newTotal > 100) {
    showSnackbar(`Total coefficient for this module would be ${newTotal.toFixed(1)}. Maximum allowed is 100`, 'error');
    return false;
  }
    return true;
  };
  
  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const filteredElements = elements.filter(element =>
    element.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    element.moduleNom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    element.professeurNom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Component: ElementCard
  const ElementCard = ({ element }) => (
    <Card 
      elevation={3}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[6],
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {element.nom}
          </Typography>
          <Chip
            label={element.coefficient}
            color="primary"
            size="small"
            icon={<CoefIcon />}
          />
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SchoolIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              {element.moduleNom}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              {element.professeurNom}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleOpenDialog(element)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteClick(element.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Element Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your educational elements and assignments
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
            }}
          >
            Add New Element
          </Button>
        </Box>

        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search elements..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              maxWidth: 400,
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Grid View">
              <IconButton
                color={viewMode === 'grid' ? 'primary' : 'default'}
                onClick={() => setViewMode('grid')}
              >
                <GridViewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="List View">
              <IconButton
                color={viewMode === 'list' ? 'primary' : 'default'}
                onClick={() => setViewMode('list')}
              >
                <ListViewIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Content */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : viewMode === 'grid' ? (
          <Grid container spacing={3}>
            {filteredElements.map((element) => (
              <Grid item xs={12} sm={6} md={4} key={element.id}>
                <ElementCard element={element} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Module</TableCell>
                  <TableCell>Professor</TableCell>
                  <TableCell>Coefficient</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredElements.map((element) => (
                  <TableRow key={element.id} hover>
                    <TableCell>{element.nom}</TableCell>
                    <TableCell>{element.moduleNom}</TableCell>
                    <TableCell>{element.professeurNom}</TableCell>
                    <TableCell>
                      <Chip
                        label={element.coefficient}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog(element)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(element.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Add/Edit Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
            }
          }}
        >
          <DialogTitle>
            {editingElement ? 'Edit Element' : 'Add New Element'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                name="nom"
                label="Name"
                fullWidth
                value={formData.nom}
                onChange={handleInputChange}
                required
                sx={{
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
                error={!formData.nom && formData.nom !== undefined}
                helperText={!formData.nom && formData.nom !== undefined ? "Name is required" : ""}
                autoFocus
              />
              <FormControl fullWidth required>
  <InputLabel>Module</InputLabel>
  <Select
    name="moduleId"
    value={formData.moduleId}
    onChange={handleInputChange}
    label="Module"
    error={!formData.moduleId}
  >
    {modules.map((module) => (
      <MenuItem key={module.id} value={module.id}>
        {module.nom}
      </MenuItem>
    ))}
  </Select>
</FormControl>

<FormControl fullWidth required>
  <InputLabel>Professor</InputLabel>
  <Select
    name="professeurId"
    value={formData.professeurId}
    onChange={handleInputChange}
    label="Professor"
    error={!formData.professeurId}
  >
    {professors.map((professor) => (
      <MenuItem key={professor.id} value={professor.id}>
        {professor.nom}
      </MenuItem>
    ))}
  </Select>
</FormControl>
              <TextField
                name="coefficient"
                label="Coefficient"
                type="number"
                fullWidth
                value={formData.coefficient}
                onChange={handleInputChange}
                sx={{
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
                required
                error={!formData.coefficient || parseFloat(formData.coefficient) <= 0}
  helperText={!formData.coefficient || parseFloat(formData.coefficient) <= 0 
    ? "Please enter a valid coefficient" 
    : `Maximum allowed: ${calculateMaxCoefficient(formData.moduleId).toFixed(1)}`
  }
  inputProps={{ 
    step: "0.1", 
    min: "0", 
    max: calculateMaxCoefficient(formData.moduleId)
  }}
              />
              
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button 
              onClick={handleCloseDialog}
              variant="outlined"
              sx={{ borderRadius: 1 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              disabled={loading}
              sx={{ borderRadius: 1 }}
            >
              {loading ? 'Processing...' : editingElement ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: '300px'
            }
          }}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this element? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button 
              onClick={() => setOpenDeleteDialog(false)}
              variant="outlined"
              sx={{ borderRadius: 1 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDelete}
              variant="contained"
              color="error"
              disabled={loading}
              sx={{ borderRadius: 1 }}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default ElementManagement;