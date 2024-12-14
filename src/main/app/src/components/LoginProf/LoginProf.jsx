import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import login from '../../assets/login.jpg'
import './LoginProf.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <section className="login" id="connect">
            <div className="top-left-navigation">
                <Link to="/" className="back-to-home">
                    ← Back to Home
                </Link>
            </div>

            <Container>
                <Row className="align-items-center container">
                    <Col md={6}>
                        <img src={login} className='image' alt="login image" />
                    </Col>
                    <Col md={6}>
                        <h1>Login Profs</h1>
                        <form>
                            <Row>
                                <Col sm={12} className="px-1">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email Address"
                                        required
                                    />
                                </Col>
                                <Col sm={12} className="px-1">
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                        required
                                    />
                                </Col>
                                <button type="submit">Log In</button>
                                {error && <Col><p className="error-message">{error}</p></Col>}
                                
                                <div className="signup-link">
                                    <p>Are you an admin? <Link to="/admin/login">Go to Admin Login</Link></p>
                                </div>
                            </Row>
                        </form>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Login;