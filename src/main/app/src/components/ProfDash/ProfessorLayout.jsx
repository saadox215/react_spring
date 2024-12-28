import React from 'react';
import { Outlet } from 'react-router-dom';
import ProfessorSidebar from './ProfessorSidebar';
import { Container, Row, Col } from 'react-bootstrap';

const ProfessorLayout = () => {
  return (
    <Container fluid>
      <Row>
        <Col md={2} className="p-0">
          <ProfessorSidebar />
        </Col>
        <Col md={10} className="p-3">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default ProfessorLayout;