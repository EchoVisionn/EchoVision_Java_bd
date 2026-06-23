import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './header.css';

function Header() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDark]);

  return (
    <header>
      <div className="logo">
        <h1 className="logo-text">ECHO<span>VISION</span></h1>
      </div>
      
      <nav>
        <ul>
          <li><NavLink to="/inicio">Início</NavLink></li>
          <li><NavLink to="/eco">ECO IA</NavLink></li>
          <li><NavLink to="/arena">Arena</NavLink></li>
          <li><NavLink to="/galeria">Galeria</NavLink></li>
          <li><NavLink to="/cadastro-empresa">Seja Parceiro B2B</NavLink></li>
          <li><NavLink to="/sobre">Sobre</NavLink></li>
        </ul>
      </nav>

      <div className="right">
        <div className="theme-switch" onClick={() => setIsDark(!isDark)}>
          <div 
            className="switch-circle" 
            style={{ 
              transform: isDark ? 'translateX(32px)' : 'translateX(0px)' 
            }}
          >
            <i className={`fa-solid ${isDark ? 'fa-moon' : 'fa-sun'}`}></i>
          </div>
        </div>

        <div className="icon-btn"><i className="fa-solid fa-universal-access"></i></div>
        <NavLink to="/perfil" className="icon-btn"><i className="fa-regular fa-circle-user"></i></NavLink>
      </div>
    </header>
  );
}

export default Header;