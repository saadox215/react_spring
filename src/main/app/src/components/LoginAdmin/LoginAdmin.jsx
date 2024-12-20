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
        validationCode: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isValidationStep, setIsValidationStep] = useState(false);  // Nouvelle étape
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isValidationStep) {
            // Vérification du code de validation
            const response = await fetch('http://localhost:8081/admin/validateCode', {
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
                // Si le code est valide, on redirige vers le tableau de bord
                setSuccess("Validation réussie !");
                localStorage.setItem('login', 'afifisaad8@gmail.com');
                sessionStorage.setItem('saad','hhhhh');
                navigate('/admin/dashboard');
            } else {
                setError("Code de validation incorrect.");
            }
        } else {
            
            const response = await fetch('http://localhost:8081/admin/login', {
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
                setSuccess('Connexion réussie ! Entrez le code de validation envoyé par e-mail.');
                setIsValidationStep(true);  // Passer à l'étape de validation
            } else {
                setError('Échec de la connexion. Vérifiez vos identifiants.');
            }
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
                                        {success && <Col><p className="success-message">{success}</p></Col>}

                {error && <p>{error}</p>}

                {isValidationStep && (
                    <div>
                        <input
                            type="text"
                            name="validationCode"
                            value={formData.validationCode}
                            onChange={handleChange}
                            placeholder="Enter validation code"
                            required
                        />
                        <button type="submit">Validate Code</button>
                    </div>
                )}
                                        
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
