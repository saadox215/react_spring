import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import login from '../../assets/login.jpg';
import { useNavigate } from "react-router-dom";
import './LoginProf.css';

const Login = () => {
    const [formData, setFormData] = useState({
        login: '',
        password: '',
        validationCode: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isValidationStep, setIsValidationStep] = useState(false);
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
            if (isValidationStep) {
                const response = await fetch('http://localhost:8081/prof/validateCode', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        login: formData.login,
                        validationCode: formData.validationCode,
                    }),
                    credentials: 'include',
                });

                if (response.ok) {
                    setSuccess("Validation réussie !");
                    const data = await response.json();
                    localStorage.setItem('profId', data.professeurId);
                    navigate('/prof/dashboard');
                } else {
                    const errorData = await response.json();
                    setError(errorData.error || "Code de validation incorrect.");
                }
            } else {
                const response = await fetch('http://localhost:8081/prof/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        login: formData.login,
                        password: formData.password,
                    }),
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('profId', data.professeur_id);
                    setSuccess('Connexion réussie ! Entrez le code de validation envoyé par e-mail.');
                    setIsValidationStep(true);
                } else {
                    const errorData = await response.json();
                    setError(errorData.error || 'Échec de la connexion. Vérifiez vos identifiants.');
                }
            }
        } catch (err) {
            setError('Erreur de connexion au serveur.');
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
                        <h1>Login Profs</h1>
                        <form onSubmit={handleSubmit}>
                            <Row>
                                <Col sm={12} className="px-1">
                                    <input
                                        type="email"
                                        id="login"
                                        name="login"
                                        value={formData.login}
                                        onChange={handleChange}
                                        placeholder="Email Address"
                                        required
                                    />
                                </Col>
                                {!isValidationStep && (
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
                                )}
                                
                                {error && <p className="error-message">{error}</p>}
                                {success && <p className="success-message">{success}</p>}
                                
                                {isValidationStep ? (
                                    <Col sm={12} className="px-1">
                                        <input
                                            type="text"
                                            name="validationCode"
                                            value={formData.validationCode}
                                            onChange={handleChange}
                                            placeholder="Enter validation code"
                                            required
                                        />
                                    </Col>
                                ) : null}
                                
                                <Col sm={12} className="px-1">
                                    <button type="submit">
                                        {isValidationStep ? 'Validate Code' : 'Log In'}
                                    </button>
                                </Col>

                                <div className="signup-link">
                                    <p>Are you an Admin? <Link to="/admin/login">Go to Admin Login</Link></p>
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