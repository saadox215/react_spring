import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const ProfessorSidebar = () => {
  const location = useLocation();
  
  return (
    <Nav className="flex-column sidebar bg-light vh-100 p-3">
      <Nav.Item>
        <Link 
          to="/professor/dashboard" 
          className={`nav-link ${location.pathname === '/professor/dashboard' ? 'active' : ''}`}
        >
          Tableau de bord
        </Link>
      </Nav.Item>
      <Nav.Item>
        <Link 
          to="/professor/grades" 
          className={`nav-link ${location.pathname === '/professor/grades' ? 'active' : ''}`}
        >
          Gestion des Notes
        </Link>
      </Nav.Item>
      <Nav.Item>
        <Link 
          to="/professor/modules" 
          className={`nav-link ${location.pathname === '/professor/modules' ? 'active' : ''}`}
        >
          Mes Modules
        </Link>
      </Nav.Item>
      <Nav.Item>
        <Link 
          to="/professor/reports" 
          className={`nav-link ${location.pathname === '/professor/reports' ? 'active' : ''}`}
        >
          Rapports
        </Link>
      </Nav.Item>
    </Nav>
  );
};

export default ProfessorSidebar;