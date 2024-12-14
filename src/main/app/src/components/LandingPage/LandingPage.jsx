import React from 'react';
import './LandingPage.css';
import TypeWriter from '../TypeWriter/TypeWriter'; 
import NavBar from '../NavBar/NavBar';

const LandingPage = () => {
    return (
        <>
        <NavBar />
        <div className='header'>
            <div className="hero-text">
                <h1>School management</h1>
                <br />
                <br />
                <br />
                <div className="typewriter-container">
                    <TypeWriter
                        text="Explorez et suivez les performances académiques de l'ensemble de votre école."
                        fontSize="20px"
                        duration="6s"
                    />
                </div>
            </div>
        </div></>
    );
};

export default LandingPage;