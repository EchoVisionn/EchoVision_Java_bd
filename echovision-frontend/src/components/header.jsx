import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './header.css';

function Header() {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDark]);

  // 🌟 CORRIGIDO: Monitora a chave exata 'id_user' que vimos no seu Local Storage
  useEffect(() => {
    const token = localStorage.getItem('id_user'); 
    if (token) {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, []);

  const closeMenu = () => setMenuOpen(false);

  // 🌟 CORRIGIDO: Controle do clique checando 'id_user' em tempo real no clique
  const handleProfileClick = (e) => {
    e.preventDefault();
    
    // Lê a chave correta no milissegundo do clique
    const tokenAtual = localStorage.getItem('id_user');
    
    if (!tokenAtual) {
      // Se não houver id_user salvo -> Vai para o Login
      navigate('/login');
    } else {
      // Se encontrou -> Garante o estado e vai direto para a tela de Perfil!
      setIsLogged(true);
      navigate('/perfil');
    }
  };

  // Função para deslogar (limpa as chaves do seu Local Storage)
  const handleLogout = () => {
    localStorage.removeItem('id_user');
    localStorage.removeItem('user_name'); // Opcional: limpa o nome também se quiser
    setIsLogged(false);
    closeMenu();
    navigate('/inicio');
  };

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
            <li><NavLink to="/arena" onClick={closeMenu}>Eventos</NavLink></li>
            <li><NavLink to="/galeria" onClick={closeMenu}>Galeria</NavLink></li>
            <li><NavLink to="/cadastro-empresa" onClick={closeMenu}>Seja Parceiro B2B</NavLink></li>
            {/* Link Externo do Sobre */}
            <li>
              <a 
                href="https://apresenta-o-echo-vision.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={closeMenu}
              >
                Sobre
              </a>
            </li>
          </ul>
        </nav>

        <div className="right">
          <button
            type="button"
            className="theme-switch"
            onClick={() => setIsDark(prev => !prev)}
            aria-pressed={isDark}
            aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            <span className={`switch-circle ${isDark ? 'active' : ''}`} aria-hidden="true">
              <i className={`fa-solid ${isDark ? 'fa-moon' : 'fa-sun'}`}></i>
            </span>
          </button>

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
          
          {/* Botão de Perfil Inteligente na Desktop */}
          <button 
            onClick={handleProfileClick} 
            className={`icon-btn desktop-only ${isLogged ? 'user-logged' : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            title={isLogged ? "Acessar Meu Perfil" : "Entrar ou Criar Conta"}
            aria-label={isLogged ? 'Acessar meu perfil' : 'Entrar ou criar conta'}
          >
            <i className="fa-regular fa-circle-user"></i>
          </button>
        </div>
      </header>

      {/* Menu Mobile */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <h3>Navegação</h3>
          <button className="close-menu" onClick={closeMenu} aria-label="Fechar menu">×</button>
        </div>
        <nav>
          <ul>
            <li><NavLink to="/inicio" onClick={closeMenu}>Início</NavLink></li>
            <li><NavLink to="/eco" onClick={closeMenu}>ECO IA</NavLink></li>
            <li><NavLink to="/arena" onClick={closeMenu}>Eventos</NavLink></li>
            <li><NavLink to="/galeria" onClick={closeMenu}>Galeria</NavLink></li>
            <li><NavLink to="/cadastro-empresa" onClick={closeMenu}>Seja Parceiro B2B</NavLink></li>
            <li>
              <a 
                href="https://apresenta-o-echo-vision.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={closeMenu}
              >
                Sobre
              </a>
            </li>
            {/* Rota dinâmica no Mobile checando id_user */}
            <li>
              <NavLink 
                to={localStorage.getItem('id_user') ? "/perfil" : "/login"} 
                onClick={closeMenu}
              >
                {localStorage.getItem('id_user') ? "Meu Perfil" : "Entrar / Cadastro"}
              </NavLink>
            </li>
            {/* Opção de Sair caso esteja logado */}
            {localStorage.getItem('id_user') && (
              <li>
                <button 
                  onClick={handleLogout} 
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0 16px', fontSize: 'inherit', fontFamily: 'inherit', textAlign: 'left', width: '100%' }}
                >
                  Sair da Sessão
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Header;