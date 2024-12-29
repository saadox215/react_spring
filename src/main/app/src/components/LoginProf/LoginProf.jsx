import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import login from '../../assets/login.jpg';
import './LoginProf.css';

const Login = () => {
    const [formData, setFormData] = useState({
        login: '',
        password: '',
        validationCode: '',
        tempProfId: null // Add this to store the ID temporarily
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
        setError('');
        setSuccess('');
        
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

                const data = await response.json();

                if (response.ok) {
                    const profId = formData.tempProfId;
                    if (profId) {
                        localStorage.setItem('profId', profId);
                        setSuccess("Validation réussie !");
                        navigate('/prof/dashboard');
                    } else {
                        setError("Error: Professor ID not found");
                    }
                } else {
                    setError(data.error || "Code de validation incorrect.");
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

                const data = await response.json();

                if (response.ok && data.professeur_id) {
                    setFormData(prev => ({
                        ...prev,
                        tempProfId: data.professeur_id
                    }));
                    setSuccess('Connexion réussie ! Entrez le code de validation envoyé par e-mail.');
                    setIsValidationStep(true);
                } else {
                    setError(data.error || 'Échec de la connexion. Vérifiez vos identifiants.');
                }
            }
        } catch (err) {
            console.error('Error:', err);
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
                                
                                {isValidationStep && (
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
                                )}
                                
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