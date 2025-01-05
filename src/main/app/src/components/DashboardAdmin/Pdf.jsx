// Add these imports at the top of the file
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const generateElementPDF = async (element) => {
  try {
    // Fetch grades for the element
    const response = await fetch(`http://localhost:8081/prof/element/${element.id}/grades`);
    if (!response.ok) throw new Error('Failed to fetch grades');
    const data = await response.json();
    
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 128);
    doc.text('Notes de l\'élément', doc.internal.pageSize.getWidth()/2, 15, { align: 'center' });
    
    // Element Info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Element: ${element.nom}`, 14, 25);
    doc.text(`Module: ${element.moduleNom}`, 14, 32);
    doc.text(`Professeur: ${element.professeurNom}`, 14, 39);
    doc.text(`Coefficient: ${element.coefficient}`, 14, 46);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 53);
    
    // Grades Table
    const tableColumn = ["Etudiant", "EXAM", "TP", "PROJET", "Moyenne"];
    const tableRows = data.students.map(student => [
      student.name,
      data.grades[student.id]?.EXAM || 'N/A',
      data.grades[student.id]?.TP || 'N/A',
      data.grades[student.id]?.PROJET || 'N/A',
      calculateMean(data.grades[student.id])
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
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });
    
    // Calculate statistics
    const stats = calculateStats(data.grades, data.students);
    
    const finalY = doc.lastAutoTable.finalY || 70;
    doc.text('Statistiques:', 14, finalY + 10);
    doc.text(`Nombre d'étudiants: ${stats.totalStudents}`, 14, finalY + 20);
    doc.text(`Taux de réussite: ${stats.successRate}%`, 14, finalY + 27);
    doc.text(`Note la plus haute: ${stats.highest}`, 14, finalY + 34);
    doc.text(`Note la plus basse: ${stats.lowest}`, 14, finalY + 41);
    doc.text(`Absences totales: ${stats.totalAbsences}`, 14, finalY + 48);
    
    // Add page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }
    
    doc.save(`notes_${element.nom.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Helper functions
const calculateMean = (grades) => {
  if (!grades) return 'N/A';
  const values = Object.values(grades).filter(g => g !== 'ABS' && g !== '');
  if (values.length === 0) return 'N/A';
  return (values.reduce((a, b) => a + parseFloat(b), 0) / values.length).toFixed(2);
};

const calculateStats = (grades, students) => {
  let highest = -1;
  let lowest = 21;
  let totalAbsences = 0;
  let passCount = 0;
  
  students.forEach(student => {
    const mean = parseFloat(calculateMean(grades[student.id]));
    if (!isNaN(mean)) {
      highest = Math.max(highest, mean);
      lowest = Math.min(lowest, mean);
      if (mean >= 10) passCount++;
    }
    
    Object.values(grades[student.id] || {}).forEach(grade => {
      if (grade === 'ABS') totalAbsences++;
    });
  });
  
  return {
    totalStudents: students.length,
    successRate: ((passCount / students.length) * 100).toFixed(1),
    highest: highest === -1 ? 'N/A' : highest.toFixed(2),
    lowest: lowest === 21 ? 'N/A' : lowest.toFixed(2),
    totalAbsences
  };
};

export { generateElementPDF };