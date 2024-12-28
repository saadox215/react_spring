import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Alert, Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const GradeManagement = () => {
  const { moduleId } = useParams();
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStudentsAndGrades();
  }, [moduleId]);

  const fetchStudentsAndGrades = async () => {
    try {
      const response = await fetch(`http://localhost:8081/prof/module/${moduleId}/grades`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data.students);
        setGrades(data.grades || {});
      }
    } catch (error) {
      setError('Erreur lors du chargement des données');
    }
  };

  const handleGradeChange = (studentId, type, value) => {
    if (value === '' || (value >= 0 && value <= 20)) {
      setGrades(prev => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [type]: value
        }
      }));
    }
  };

  const markAbsent = (studentId, type) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [type]: 'ABS'
      }
    }));
  };

  const calculateAverage = (studentGrades) => {
    if (!studentGrades) return '-';
    
    const validGrades = Object.values(studentGrades).filter(grade => 
      typeof grade === 'number' && !isNaN(grade)
    );
    
    if (validGrades.length === 0) return '-';
    
    const sum = validGrades.reduce((acc, curr) => acc + curr, 0);
    return (sum / validGrades.length).toFixed(2);
  };

  const validateGrades = () => {
    // Vérifier toutes les notes
    const invalidGrades = Object.values(grades).some(studentGrades => 
      Object.values(studentGrades).some(grade => 
        grade !== 'ABS' && (isNaN(grade) || grade < 0 || grade > 20)
      )
    );

    if (invalidGrades) {
      setError('Certaines notes sont invalides');
      return;
    }

    // Vérifier les notes extrêmes
    const hasExtremeGrades = Object.values(grades).some(studentGrades =>
      Object.values(studentGrades).some(grade =>
        grade === 0 || grade === 20
      )
    );

    if (hasExtremeGrades) {
      setShowConfirmModal(true);
    } else {
      submitGrades(true);
    }
  };

  const submitGrades = async (isValidated = false) => {
    try {
      const response = await fetch(`http://localhost:8081/prof/grades/${moduleId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grades,
          isValidated
        }),
      });

      if (response.ok) {
        setSuccess(isValidated ? 'Notes validées avec succès' : 'Brouillon sauvegardé');
        setShowConfirmModal(false);
      }
    } catch (error) {
      setError('Erreur lors de la sauvegarde');
    }
  };

  return (
    <div>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3>Gestion des Notes</h3>
          <div>
            <Button variant="secondary" className="me-2" onClick={() => submitGrades(false)}>
              Sauvegarder Brouillon
            </Button>
            <Button variant="primary" onClick={validateGrades}>
              Valider les Notes
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Étudiant</th>
                <th>CC</th>
                <th>TP</th>
                <th>Projet</th>
                <th>Moyenne</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  {['CC', 'TP', 'Projet'].map(type => (
                    <td key={type}>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type="number"
                          min="0"
                          max="20"
                          step="0.25"
                          value={grades[student.id]?.[type] === 'ABS' ? '' : grades[student.id]?.[type] || ''}
                          onChange={(e) => handleGradeChange(student.id, type, e.target.value)}
                          className="grade-input me-2"
                          disabled={grades[student.id]?.[type] === 'ABS'}
                        />
                        <Button
                          variant={grades[student.id]?.[type] === 'ABS' ? 'danger' : 'outline-secondary'}
                          size="sm"
                          onClick={() => markAbsent(student.id, type)}
                        >
                          ABS
                        </Button>
                      </div>
                    </td>
                  ))}
                  <td>{calculateAverage(grades[student.id])}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Des notes extrêmes (0 ou 20) ont été détectées. Voulez-vous vraiment valider ces notes ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={() => submitGrades(true)}>
            Confirmer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GradeManagement;