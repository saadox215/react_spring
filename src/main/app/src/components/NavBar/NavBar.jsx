import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
 

  return (
    <nav>
    <div className="menu-toggle">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <ul >
      <li><a href="#home">Home</a></li>
      <li><Link to="/profs/login">Login Professeur</Link></li>
      <li>
        <button className='btn'><Link to="/admin/login">Login Admin</Link></button>
      </li>
    </ul>
  </nav>
  
  );
};

export default NavBar;