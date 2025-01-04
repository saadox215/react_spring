import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
  TextField,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import WarningIcon from '@mui/icons-material/Warning';
import CalculateIcon from '@mui/icons-material/Calculate';

const ProfessorGradesPage = () => {
  const [modules, setModules] = useState([]);
  const [selectedElement, setSelectedElement] = useState('');
  const [grades, setGrades] = useState({});
  const [tempGrades, setTempGrades] = useState({});
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    callback: null
  });
  const [elementMean, setElementMean] = useState(null);
  const [moduleMean, setModuleMean] = useState(null);
  const [isElementValidated, setIsElementValidated] = useState(false);

  const checkValidationStatus = async () => {
    try {
      const response = await fetch(`http://localhost:8081/prof/element/${selectedElement}/validation-status`);
      if (!response.ok) throw new Error('Failed to check validation status');
      const data = await response.json();
      setIsElementValidated(data.isValidated);
    } catch (err) {
      setError('Failed to check validation status: ' + err.message);
    }
  };

  useEffect(() => {
    fetchProfessorElements();
  }, []);

  useEffect(() => {
    if (selectedElement) {
      fetchElementGrades();
      checkValidationStatus();
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

  const fetchElementGrades = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8081/prof/element/${selectedElement}/grades`);
      
      if (!response.ok) throw new Error('Failed to fetch grades');
      
      const data = await response.json();
      setStudents(data.students);
      setGrades(data.grades);
      setTempGrades(data.grades);
      setHasUnsavedChanges(false);
    } catch (err) {
      setError('Failed to load grades: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  const validateGradesData = () => {
    let hasZeros = false;
    let hasTwenties = false;
    let hasEmptyGrades = false;
    let hasInvalidGrades = false;

    Object.values(tempGrades).forEach(studentGrades => {
      Object.entries(studentGrades).forEach(([type, grade]) => {
        if (grade === '') {
          hasEmptyGrades = true;
        } else if (grade !== 'ABS') {
          const numGrade = parseFloat(grade);
          if (numGrade === 0) hasZeros = true;
          if (numGrade === 20) hasTwenties = true;
          if (numGrade < 0 || numGrade > 20) hasInvalidGrades = true;
        }
      });
    });

    if (hasEmptyGrades) {
      setError('All grades must be filled');
      return false;
    }

    if (hasInvalidGrades) {
      setError('All grades must be between 0 and 20');
      return false;
    }

    if (hasZeros || hasTwenties) {
      setConfirmDialog({
        open: true,
        title: 'Confirm Grades',
        message: `There are ${hasZeros ? '0s' : ''} ${hasZeros && hasTwenties ? 'and' : ''} ${hasTwenties ? '20s' : ''} in the grades. Are you sure you want to validate?`,
        callback: () => validateGrades()
      });
      return false;
    }

    return true;
  };

  const calculateElementMean = () => {
    let total = 0;
    let count = 0;
    Object.values(tempGrades).forEach(studentGrades => {
      Object.values(studentGrades).forEach(grade => {
        if (grade !== 'ABS') {
          total += parseFloat(grade);
          count++;
        }
      });
    });
    setElementMean(count > 0 ? (total / count).toFixed(2) : 0);
  };

  const calculateModuleMean = async () => {
    try {
      const response = await fetch(`http://localhost:8081/prof/module/${selectedElement}/mean`);
      if (!response.ok) throw new Error('Failed to calculate module mean');
      const data = await response.json();
      setModuleMean(data.mean);
    } catch (err) {
      setError('Failed to calculate module mean: ' + err.message);
    }
  };

  const exportGrades = () => {
    if (!isElementValidated) {
      setError('Element must be validated before export');
      return;
    }
  
    try {
      const doc = new jsPDF();
      const selectedModuleInfo = modules.find(m => m.elementId === selectedElement);
  
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 128);
      doc.text('Notes du module', doc.internal.pageSize.getWidth()/2, 15, { align: 'center' });
  
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); 
      doc.text(`Element: ${selectedModuleInfo.elementName}`, 14, 25);
      doc.text(`Module: ${selectedModuleInfo.name}`, 14, 32);
      doc.text(`Filière: ${selectedModuleInfo.filiere}`, 14, 39);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 53);
      doc.text(`Mean: ${elementMean || 'Not calculated'}`, 14, 60);
  
      const tableColumn = ["Student", "EXAM", "TP", "PROJET", "Mean"];
      const tableRows = students.map(student => [
        student.name,
        formatGrade(tempGrades[student.id]?.EXAM),
        formatGrade(tempGrades[student.id]?.TP),
        formatGrade(tempGrades[student.id]?.PROJET),
        calculateStudentMean(student.id)
      ]);
  
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 70,
        theme: 'striped',
        headStyles: {
          fillColor: [0, 0, 128],
          textColor: 255,
          fontSize: 12,
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 11,
          halign: 'center'
        },
        columnStyles: {
          0: { 
            halign: 'left',
            cellWidth: 50
          },
          1: { cellWidth: 30 }, 
          2: { cellWidth: 30 },
          3: { cellWidth: 30 }, 
          4: { cellWidth: 30 }  
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        didDrawCell: (data) => {
          if (data.section === 'body' && data.column.index > 0 && data.column.index < 4) {
            const value = data.cell.text[0];
            if (value === 'ABS') {
              doc.setTextColor(255, 0, 0); 
            } else if (value === '0' || value === '20') {
              doc.setTextColor(0, 0, 255); 
            }
          }
        }
      });
  
      const finalY = doc.lastAutoTable.finalY || 70;
      doc.setFontSize(11);
      doc.text('Statistics:', 14, finalY + 10);
      
      const stats = calculateStatistics();
      doc.text(`Number of students: ${students.length}`, 14, finalY + 20);
      doc.text(`Success rate: ${stats.successRate}%`, 14, finalY + 27);
      doc.text(`Highest grade: ${stats.highest}`, 14, finalY + 34);
      doc.text(`Lowest grade: ${stats.lowest}`, 14, finalY + 41);
      doc.text(`Total absences: ${stats.totalAbsences}`, 14, finalY + 48);
  
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }
  
      const fileName = `grades_${selectedModuleInfo.elementName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      setSuccess('Grades exported successfully');
  
    } catch (err) {
      setError('Failed to export grades: ' + err.message);
    }
  };
  
  const formatGrade = (grade) => {
    return grade === 'ABS' ? 'ABS' : grade.toString();
  };
  
  const calculateStatistics = () => {
    let highest = -1;
    let lowest = 21;
    let totalAbsences = 0;
    let passCount = 0;
  
    students.forEach(student => {
      const mean = parseFloat(calculateStudentMean(student.id));
      if (!isNaN(mean)) {
        highest = Math.max(highest, mean);
        lowest = Math.min(lowest, mean);
        if (mean >= 10) passCount++;
      }
  
      Object.values(tempGrades[student.id] || {}).forEach(grade => {
        if (grade === 'ABS') totalAbsences++;
      });
    });
  
    return {
      highest: highest === -1 ? 'N/A' : highest.toFixed(2),
      lowest: lowest === 21 ? 'N/A' : lowest.toFixed(2),
      totalAbsences,
      successRate: ((passCount / students.length) * 100).toFixed(1)
    };
  };

  const handleGradeChange = (studentId, type, value) => {
    if (isElementValidated) {
      setError('Cannot modify grades for a validated element');
      return;
    }

    setTempGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [type]: value === 'ABS' ? 'ABS' : 
                value === '' ? '' : 
                Math.min(Math.max(parseFloat(value) || 0, 0), 20)
      }
    }));
    setHasUnsavedChanges(true);
  };

  const cancelChanges = () => {
    setTempGrades(grades);
    setHasUnsavedChanges(false);
  };
  
  const prepareGradesForSubmission = (grades) => {
    const preparedGrades = {};
    Object.entries(grades).forEach(([studentId, studentGrades]) => {
      preparedGrades[studentId] = {};
      Object.entries(studentGrades).forEach(([type, value]) => {
        if (value === 'ABS' || (!isNaN(value) && value !== '')) {
          preparedGrades[studentId][type] = value;
        } else {
          preparedGrades[studentId][type] = 0;
        }
      });
    });
    return preparedGrades;
  };
  const saveDraft = async () => {
    try {
      setLoading(true);
      const preparedGrades = prepareGradesForSubmission(tempGrades);
      
      const response = await fetch(`http://localhost:8081/prof/element/${selectedElement}/grades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grades: preparedGrades,
          isValidated: false
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save draft');
      }

      const data = await response.json();
      setGrades(tempGrades);
      setSuccess('Draft saved successfully');
      setHasUnsavedChanges(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateGrades = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8081/prof/element/${selectedElement}/grades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grades: tempGrades,
          isValidated: true
        }),
      });

      if (!response.ok) throw new Error('Failed to validate grades');

      const data = await response.json();
      setGrades(tempGrades);
      setSuccess('Grades validated successfully');
      setHasUnsavedChanges(false);
      setIsElementValidated(true);
    } catch (err) {
      setError('Failed to validate grades: ' + err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Grade Management
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
  
        {hasUnsavedChanges && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            You have unsaved changes
          </Alert>
        )}
  
        {selectedElement && !loading && students.length > 0 && (
          <>
            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell align="center">EXAM</TableCell>
                    <TableCell align="center">TP</TableCell>
                    <TableCell align="center">PROJET</TableCell>
                    <TableCell align="center">Mean</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      {['EXAM', 'TP', 'PROJET'].map((type) => (
                        <TableCell key={type} align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <TextField
  size="small"
  value={tempGrades[student.id]?.[type] ?? ''}
  onChange={(e) => handleGradeChange(student.id, type, e.target.value)}
  disabled={isElementValidated}
  inputProps={{
    style: { textAlign: 'center', width: '60px', color: 'black' },
    min: 0,
    max: 20,
    step: 0.25,
    type: 'number'
  }}
  InputProps={{
    inputMode: 'numeric',
    'aria-label': 'grade input'
  }}
/>
                            <Button
                              size="small"
                              variant={tempGrades[student.id]?.[type] === 'ABS' ? 'contained' : 'outlined'}
                              onClick={() => handleGradeChange(student.id, type, 'ABS')}
                              disabled={isElementValidated}
                              sx={{ minWidth: '40px' }}
                            >
                              ABS
                            </Button>
                          </Box>
                        </TableCell>
                      ))}
                      <TableCell align="center">
                        {calculateStudentMean(student.id)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
  
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                {elementMean !== null && (
                  <Typography variant="subtitle1">
                    Element Mean: {elementMean}
                  </Typography>
                )}
                {moduleMean !== null && (
                  <Typography variant="subtitle1">
                    Module Mean: {moduleMean}
                  </Typography>
                )}
              </Box>
  
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<CalculateIcon />}
                  onClick={calculateElementMean}
                >
                  Calculate Means
                </Button>
                {isElementValidated && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FileDownloadIcon />}
                    onClick={exportGrades}
                  >
                    Export PDF
                  </Button>
                )}
              </Box>
            </Box>
  
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={cancelChanges}
                disabled={!hasUnsavedChanges || isElementValidated}
              >
                Cancel Changes
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={saveDraft}
                disabled={!hasUnsavedChanges || isElementValidated}
              >
                Save Draft
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => {
                  if (validateGradesData()) {
                    validateGrades();
                  }
                }}
                disabled={isElementValidated}
              >
                Validate Grades
              </Button>
            </Box>
          </>
        )}
  
        <Dialog
          open={confirmDialog.open}
          onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon color="warning" />
              {confirmDialog.title}
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography>{confirmDialog.message}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() => {
                setConfirmDialog({ ...confirmDialog, open: false });
                if (confirmDialog.callback) confirmDialog.callback();
              }}
            >
              Confirm
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
  
  function calculateStudentMean(studentId) {
    const studentGrades = tempGrades[studentId];
    if (!studentGrades) return '-';
  
    let total = 0;
    let count = 0;
    Object.values(studentGrades).forEach(grade => {
      if (grade !== 'ABS' && grade !== '') {
        total += parseFloat(grade);
        count++;
      }
    });
  
    return count > 0 ? (total / count).toFixed(2) : '-';
  }
  function calculateStudentMean(studentId) {
    const studentGrades = tempGrades[studentId];
    if (!studentGrades) return '-';
  
    let total = 0;
    let count = 0;
    
    Object.values(studentGrades).forEach(grade => {
      if (grade !== '') {  
        if (grade === 'ABS') {
          total += 0;
        } else {
          total += parseFloat(grade);
        }
        count++; 
      }
    });
  
    return count > 0 ? (total / count).toFixed(2) : '-';
  }
};

export default ProfessorGradesPage;