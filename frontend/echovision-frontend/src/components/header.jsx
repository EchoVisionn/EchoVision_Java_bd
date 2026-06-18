import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Perfil from '../Pages/perfil/perfil';
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
          <li><Link to="/inicio">Início</Link></li>
          <li><Link to="/eco">ECO IA</Link></li>
          <li><Link to="/arena">Arena</Link></li>
          <li><Link to="/galeria">Galeria</Link></li>
          <li><Link to="/sobre">Sobre</Link></li>
        </ul>
      </nav>

      <div className="right">
        {/* O BOTÃO COM CONTROLE POR TRANSFORM */}
        <div className="theme-switch" onClick={() => setIsDark(!isDark)}>
  <div 
    className="switch-circle" 
    style={{ 
      /* Move suavemente e fica preso dentro do container */
      transform: isDark ? 'translateX(32px)' : 'translateX(0px)' 
    }}
  >
    <i className={`fa-solid ${isDark ? 'fa-moon' : 'fa-sun'}`}></i>
  </div>
</div>

        <div className="icon-btn"><i className="fa-solid fa-universal-access"></i></div>
        <Link to="/perfil" className="icon-btn"><i className="fa-regular fa-circle-user"></i></Link>
      </div>
    </header>
  );
}

export default Header;