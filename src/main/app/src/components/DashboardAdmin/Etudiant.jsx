import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import logoLeft from '../../assets/logo-ensak.png'
import logoRight from '../../assets/univ.png'
import 'jspdf-autotable';
import {
  Box,
  Typography,
  Button,
  Dialog,
  TextField,
  DialogContent,
  DialogTitle,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  FileDownload as FileDownloadIcon,
  PictureAsPdf as PdfIcon,
  TableView as ExcelIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
  '& .MuiTable-root': {
    borderCollapse: 'separate',
    borderSpacing: '0 8px',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    cursor: 'pointer',
  },
  '& td': {
    borderBottom: 'none',
    padding: '16px',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 500,
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
  fontSize: '0.875rem',
  padding: '16px',
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  color: 'white',
  padding: '8px 16px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 10px 4px rgba(33, 203, 243, .3)',
  },
}));

const StudentDashboard = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [selectedFiliere, setSelectedFiliere] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    id: '',
    filiere: null
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const BASE_URL = 'http://localhost:8081/admin';

  useEffect(() => {
    fetchFilieres();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (!allStudents) return;
    
    if (!selectedFiliere) {
      setFilteredStudents(allStudents);
    } else {
      const filtered = allStudents.filter(student => 
        student.filiereId === selectedFiliere
      );
      setFilteredStudents(filtered);
    }
  }, [selectedFiliere, allStudents]);

  const fetchFilieres = async () => {
    try {
      const response = await fetch(`${BASE_URL}/filiere`);
      const data = await response.json();
      setFilieres(data);
    } catch (error) {
      showSnackbar('Erreur de chargement des filières', 'error');
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/etudiants`);
      const data = await response.json();
      setAllStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      showSnackbar('Erreur de chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const exportToExcel = () => {
    const headers = ['Code', 'Nom', 'Prénom', 'Filière'];
    const data = filteredStudents.map(student => [
      student.id,
      student.nom,
      student.prenom,
      student.filiereNom || 'Non assignée'
    ]);

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'etudiants.csv';
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF('landscape');

  
    const primaryColor = [0, 87, 154];  
    const secondaryColor = [128, 128, 128];  
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    const addHeader = () => {
      doc.setFillColor(245, 245, 245);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.addImage(logoLeft, 'PNG', 10, 5, 30, 30);  
      doc.addImage(logoRight, 'PNG', pageWidth - 40, 5, 30, 30);
  
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("École Nationale des Sciences Appliquées Khouribga", pageWidth/2, 20, { align: "center" });
      
      doc.setFontSize(16);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text("Liste des Étudiants", pageWidth/2, 30, { align: "center" });
  
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.5);
      doc.line(10, 40, pageWidth - 10, 40);
    };
  
    const addFooter = () => {
      const date = new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
  
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.5);
      doc.line(10, pageHeight - 20, pageWidth - 10, pageHeight - 20);
  
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Document généré le ${date}`, 10, pageHeight - 10);
      doc.text("ENSA El Khouribga - Université soultane", pageWidth/2, pageHeight - 10, { align: "center" });
      doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageWidth - 20, pageHeight - 10);
    };
  
    addHeader();
  
    if (selectedFiliere) {
      const filiereNom = filieres.find(f => f.id === selectedFiliere)?.nom;
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Filière : ${filiereNom}`, 10, 50);
    }
  
    const headers = [['Code', 'Nom', 'Prénom', 'Filière']];
    const data = filteredStudents.map(student => [
      student.id,
      student.nom,
      student.prenom,
      student.filiereNom || 'Non assignée'
    ]);
  
    doc.autoTable({
      head: headers,
      body: data,
      startY: selectedFiliere ? 60 : 50,
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 60, right: 10, left: 10, bottom: 30 },
      didDrawPage: (data) => {
        if (data.pageNumber > 1) {
          addHeader();
        }
        addFooter();
      }
    });
  
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Nombre total d'étudiants : ${data.length}`, 10, finalY);
  
    doc.save('liste_etudiants_ensaKH.pdf');
  };
  
  const addWatermark = (doc) => {
    const text = "ENSA KHOURIBGA";
    doc.setFontSize(60);
    doc.setTextColor(230, 230, 230);
    doc.setFont("helvetica", "bold");
    
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({opacity: 0.1}));
    
    doc.transform(
      Math.cos(45 * Math.PI / 180), 
      Math.sin(45 * Math.PI / 180), 
      -Math.sin(45 * Math.PI / 180), 
      Math.cos(45 * Math.PI / 180), 
      50, 
      0
    );
    
    doc.text(text, 50, 200);
    doc.restoreGraphicsState();
  };

  const handleSubmit = async () => {
    if (!formData.filiere) {
      showSnackbar('Veuillez sélectionner une filière', 'error');
      return;
    }

    setLoading(true);
    try {
      const url = selectedStudent
        ? `${BASE_URL}/etudiant/update/${selectedStudent.id}`
        : `${BASE_URL}/etudiant/add`;
      
      const response = await fetch(url, {
        method: selectedStudent ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showSnackbar(
          selectedStudent ? 'Étudiant modifié ✨' : 'Nouvel étudiant ajouté ✨',
          'success'
        );
        handleCloseDialog();
        fetchStudents();
      } else {
        throw new Error('Erreur lors de l\'opération');
      }
    } catch (error) {
      showSnackbar('Une erreur est survenue', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirmer la suppression?')) {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/etudiant/delete/${id}`, { 
          method: 'DELETE' 
        });
        
        if (response.ok) {
          showSnackbar('Étudiant supprimé ✨', 'success');
          fetchStudents();
        } else {
          throw new Error('Erreur lors de la suppression');
        }
      } catch (error) {
        showSnackbar('Erreur lors de la suppression', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOpenDialog = (student = null) => {
    setSelectedStudent(student);
    setFormData(student || { 
      nom: '', 
      prenom: '', 
      id: '',
      filiere: selectedFiliere ? { id: selectedFiliere } : null
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
    setFormData({ 
      nom: '', 
      prenom: '', 
      id: '',
      filiere: selectedFiliere ? { id: selectedFiliere } : null
    });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box sx={{ p: 4, background: 'transparent', minHeight: '100vh' }}>
      
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center',gap:4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SchoolIcon sx={{ fontSize: 40, color: '#2196F3' }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', background: 'linear-gradient(45deg,rgb(23, 97, 157),rgb(27, 176, 209))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',marginLeft:'5' }}>
            Gestion des Étudiants
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2,marginRight:'10px' }}>
          <Tooltip title="Exporter en Excel">
            <GradientButton
              startIcon={<ExcelIcon />}
              onClick={exportToExcel}
              disabled={loading || filteredStudents.length === 0}
            >
              Excel
            </GradientButton>
          </Tooltip>
          <Tooltip title="Exporter en PDF">
            <GradientButton
              startIcon={<PdfIcon />}
              onClick={exportToPDF}
              disabled={loading || filteredStudents.length === 0}
            >
              PDF
            </GradientButton>
          </Tooltip>
          <GradientButton
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            disabled={loading}
          >
            Nouvel Étudiant
          </GradientButton>
        </Box>
      </Box>

      {/* Filière Selection */}
      <Box sx={{ mb: 4 }}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Filière</InputLabel>
          <Select
            value={selectedFiliere}
            onChange={(e) => setSelectedFiliere(e.target.value)}
            label="Filière"
          >
            <MenuItem value="">
              <em>Toutes les filières</em>
            </MenuItem>
            {filieres.map((filiere) => (
              <MenuItem key={filiere.id} value={filiere.id}>
                {filiere.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableHeadCell>Code</StyledTableHeadCell>
              <StyledTableHeadCell>Nom</StyledTableHeadCell>
              <StyledTableHeadCell>Prénom</StyledTableHeadCell>
              <StyledTableHeadCell>Filière</StyledTableHeadCell>
              <StyledTableHeadCell align="right">Actions</StyledTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Aucun étudiant trouvé
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((student) => (
                  <StyledTableRow key={student.id}>
                    <StyledTableCell>{student.id}</StyledTableCell>
                    <StyledTableCell>{student.nom}</StyledTableCell>
                    <StyledTableCell>{student.prenom}</StyledTableCell>
                    <StyledTableCell>
                      {student.filiereNom || 'Non assignée'}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(student)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(student.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredStudents.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Lignes par page"
        />
      </StyledTableContainer>

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
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <AddIcon />
          {selectedStudent ? 'Modifier l\'étudiant' : 'Ajouter un étudiant'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2, minWidth: 400 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            
            <TextField
              label="Nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              variant="outlined"
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
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              variant="outlined"
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
            <FormControl fullWidth>
              <InputLabel>Filière</InputLabel>
              <Select
                value={formData.filiere?.id || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  filiere: e.target.value ? { id: e.target.value } : null 
                })}
                label="Filière"
              >
                {filieres.map((filiere) => (
                  <MenuItem key={filiere.id} value={filiere.id}>
                    {filiere.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Annuler
          </Button>
          <GradientButton onClick={handleSubmit} disabled={loading}>
            {selectedStudent ? 'Modifier' : 'Ajouter'}
          </GradientButton>
        </DialogActions>
      </Dialog>

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

export default StudentDashboard;