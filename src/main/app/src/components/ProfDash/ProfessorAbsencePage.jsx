import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Tooltip,
  IconButton,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

const ProfessorAbsencePage = () => {
  const [modules, setModules] = useState([]);
  const [selectedElement, setSelectedElement] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [absenceDate, setAbsenceDate] = useState('');
  const [absenceDescription, setAbsenceDescription] = useState('');

  useEffect(() => {
    fetchProfessorElements();
  }, []);

  useEffect(() => {
    if (selectedElement) {
      fetchElementAbsences();
    }
  }, [selectedElement]);

  const fetchProfessorElements = async () => {
    try {
      setLoading(true);
      const profId = localStorage.getItem('profId');
      const response = await fetch(`http://localhost:8081/prof/modules/${profId}`);
      
      if (!response.ok) throw new Error('Failed to fetch modules');
      
      const data = await response.json();
      setModules(data);
    } catch (err) {
      setError('Failed to load modules: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchElementAbsences = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8081/prof/element/${selectedElement}/absences`);
      
      if (!response.ok) throw new Error('Failed to fetch absences');
      
      const data = await response.json();
      setStudents(data.students);
    } catch (err) {
      setError('Failed to load absences: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAbsence = async () => {
    try {
      if (!absenceDate) {
        setError('Please select a date');
        return;
      }

      setLoading(true);
      const response = await fetch(`http://localhost:8081/prof/element/${selectedElement}/absence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          date: absenceDate,
          description: absenceDescription || 'Absence',
        }),
      });

      if (!response.ok) throw new Error('Failed to add absence');

      const data = await response.json();
      setSuccess('Absence added successfully');
      fetchElementAbsences();
      handleCloseDialog();
    } catch (err) {
      setError('Failed to add absence: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
    setAbsenceDate('');
    setAbsenceDescription('');
  };

  const getAbsenceCountStyle = (count) => {
    if (count >= 3) return { color: 'error.main', fontWeight: 'bold' };
    if (count >= 2) return { color: 'warning.main', fontWeight: 'bold' };
    return { color: 'success.main' };
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <PersonIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Absence Management
          </Typography>
        </Box>

        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel>Select Element</InputLabel>
          <Select
            value={selectedElement}
            label="Select Element"
            onChange={(e) => setSelectedElement(e.target.value)}
          >
            {modules.map((module) => (
              <MenuItem key={module.elementId} value={module.elementId}>
                {module.elementName} - {module.name} ({module.filiere})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {selectedElement && !loading && students.length > 0 && (
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell align="center">Total Absences</TableCell>
                  <TableCell>Absence Dates</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell align="center">
                      <Typography sx={getAbsenceCountStyle(student.totalAbsences)}>
                        {student.totalAbsences}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {student.absenceDates.map((date, index) => (
                          <Chip
                            key={index}
                            label={new Date(date).toLocaleDateString()}
                            size="small"
                            color={index >= 2 ? "error" : "default"}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => {
                          setSelectedStudent(student);
                          setOpenDialog(true);
                        }}
                        color={student.totalAbsences >= 3 ? "error" : "primary"}
                      >
                        Add Absence
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            Add Absence
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle1" color="primary">
                Student: {selectedStudent?.name}
              </Typography>
              {selectedStudent?.totalAbsences >= 3 && (
                <Alert severity="warning">
                  Warning: Student has {selectedStudent.totalAbsences} absences
                </Alert>
              )}
              <TextField
                label="Date"
                type="date"
                value={absenceDate}
                onChange={(e) => setAbsenceDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
              <TextField
                label="Description (Optional)"
                multiline
                rows={3}
                value={absenceDescription}
                onChange={(e) => setAbsenceDescription(e.target.value)}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              onClick={handleAddAbsence}
              variant="contained"
              disabled={loading || !absenceDate}
            >
              {loading ? <CircularProgress size={24} /> : 'Add Absence'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess(null)}
        >
          <Alert severity="success" onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default ProfessorAbsencePage;