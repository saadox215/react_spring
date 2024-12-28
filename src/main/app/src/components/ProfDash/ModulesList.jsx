import React, { useState, useEffect } from 'react';
import { Card, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ModulesList = () => {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const id = localStorage.getItem('profId'); 
      const response = await fetch(`http://localhost:8081/prof/modules/${id}`);
      if (response.ok) {
        const data = await response.json();
        setModules(data);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'En cours': 'warning',
      'Validé': 'success',
      'Non commencé': 'secondary'
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  return (
    <Card>
      <Card.Header>
        <h4>Mes Modules</h4>
      </Card.Header>
      <Card.Body>
        <Table responsive>
          <thead>
            <tr>
              <th>Module</th>
              <th>Filière</th>
              <th>Semestre</th>
              <th>Élément</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((module) => (
              <tr key={module.id}>
                <td>{module.name}</td>
                <td>{module.filiere}</td>
                <td>{module.semester}</td>
                <td>{module.element}</td>
                <td>{getStatusBadge(module.status)}</td>
                <td>
                  <Link 
                    to={`/professor/grades/${module.id}`}
                    className="btn btn-sm btn-primary"
                  >
                    Gérer les notes
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};
export default ModulesList;