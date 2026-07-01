import React from 'react';
import './footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <div className="logo">
            <h1 className="logo-text">ECHO<span>VISION</span></h1>
          </div>
          <p className="footer-description">
            Sua visão através do som. Acesse sua conta para experiências personalizadas.
          </p>
          <h1 className="footer-highlight">Escute. Sinta. Viva.</h1>
        </div>
        <div className="footer-column">
          <h3>NAVEGAÇÃO</h3>
          <ul>
            <li><a href="/">Início</a></li>
            <li><a href="/arena">Arena</a></li>
            <li><a href="/sobre">Sobre</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>SUPORTE</h3>
          <ul>
            <li>contato@echovision.app</li>
            <li>Central de Ajuda</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 EchoVision. Todos os direitos reservados.</p>
        <p>Feito com ondas sonoras.</p>
      </div>
    </footer>
  );
}

export default Footer;