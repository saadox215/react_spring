import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import login from '../../assets/admin.jpg'
import './LoginAdmin.css';
import {useNavigate} from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        login: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8081/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: formData.login,
                    password: formData.password
                }),
                credentials: 'include',
            });
            console.log('Payload:', JSON.stringify({ login: formData.login, password: formData.password }));

            console.log('Response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Login data:', data);
                setSuccess(data.message);
                localStorage.setItem('login', data.login);
                navigate('/admin/dashboard');
            } else {
                const errorData = await response.json();
                console.error('Login error:', errorData);
                setError('Failed to log in. Please check your credentials.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error occurred during login.');
        }
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
                                <h1>Login Admin</h1>
                                <form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col sm={12} className="px-1">
                                            <input
                                                type="text"
                                                id="email"
                                                name="login"
                                                value={formData.login}
                                                onChange={handleChange}
                                                placeholder="login"
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
                                            <p>Are you an profs? <Link to="/profs/login">Go to Profs Login</Link></p>
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
