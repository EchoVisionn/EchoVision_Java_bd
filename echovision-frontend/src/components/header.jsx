import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './header.css';

function Header() {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDark]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header>
        <div className="logo">
          <h1 className="logo-text">ECHO<span>VISION</span></h1>
        </div>

        <nav className="desktop-nav">
          <ul>
            <li><NavLink to="/inicio" onClick={closeMenu}>Início</NavLink></li>
            <li><NavLink to="/eco" onClick={closeMenu}>ECO IA</NavLink></li>
            <li><NavLink to="/arena" onClick={closeMenu}>Arena</NavLink></li>
            <li><NavLink to="/galeria" onClick={closeMenu}>Galeria</NavLink></li>
            <li><NavLink to="/cadastro-empresa" onClick={closeMenu}>Seja Parceiro B2B</NavLink></li>
            <li><NavLink to="/sobre" onClick={closeMenu}>Sobre</NavLink></li>
          </ul>
        </nav>

        <div className="right">
          <div className="theme-switch" onClick={() => setIsDark(!isDark)}>
            <div className={`switch-circle ${isDark ? 'active' : ''}`}>
              <i className={`fa-solid ${isDark ? 'fa-moon' : 'fa-sun'}`}></i>
            </div>
          </div>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className="icon-btn desktop-only"><i className="fa-solid fa-universal-access"></i></div>
          <NavLink to="/perfil" className="icon-btn desktop-only"><i className="fa-regular fa-circle-user"></i></NavLink>
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <h3>Navegação</h3>
          <button className="close-menu" onClick={closeMenu} aria-label="Fechar menu">×</button>
        </div>
        <nav>
          <ul>
            <li><NavLink to="/inicio" onClick={closeMenu}>Início</NavLink></li>
            <li><NavLink to="/eco" onClick={closeMenu}>ECO IA</NavLink></li>
            <li><NavLink to="/arena" onClick={closeMenu}>Arena</NavLink></li>
            <li><NavLink to="/galeria" onClick={closeMenu}>Galeria</NavLink></li>
            <li><NavLink to="/cadastro-empresa" onClick={closeMenu}>Seja Parceiro B2B</NavLink></li>
            <li><NavLink to="/sobre" onClick={closeMenu}>Sobre</NavLink></li>
            <li><NavLink to="/perfil" onClick={closeMenu}>Perfil</NavLink></li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Header;