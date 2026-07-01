import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './telaUsuario.css';

import autoCompadecida from '/src/assets/imagens/auto-da-compadecida.jpeg';
import corinthiansPalmeiras from '/src/assets/imagens/corinthians-palmeiras.png';

function TelaUsuario() {
  const navigate = useNavigate();

  const eventosCompra = [
    {
      id: 1,
      title: 'O Auto da Compadecida',
      image: autoCompadecida,
      category: 'Teatro',
      date: '28 Jun · 21h00',
      location: 'Sesc Pinheiros, São Paulo',
      price: 89,
      description: 'Audiodescrição ao vivo com narração imersiva para o público.',
    },
    {
      id: 2,
      title: 'Corinthians x Palmeiras — O Clássico Paulista',
      image: corinthiansPalmeiras,
      category: 'Esportes',
      date: '05 Jul · 19h30',
      location: 'Itaquera, São Paulo',
      price: 65,
      description: 'Experiência de áudio imersivo com narração ECO para o clássico paulista.',
    },
  ];

  const handleComprar = (event) => {
    navigate('/compra-ingressos', { state: { event } });
  };

  return (
    <>
      {/* Filtro SVG e Ondas de Fundo */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="wave-distort">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.02" numOctaves={3} seed={2} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={90} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div className="wave-wrapper">
        <svg className="organic-waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path className="wave path-1" d="M0,160 C320,300,420,0,720,160 C1020,320,1120,0,1440,160 V320 H0 Z"></path>
          <path className="wave path-2" d="M0,160 C320,0,420,300,720,160 C1020,20,1120,320,1440,160 V320 H0 Z"></path>
          <path className="wave path-3" d="M0,160 C160,200,320,100,480,160 C640,220,800,100,960,160 C1120,220,1280,100,1440,160 V320 H0 Z"></path>
        </svg>
      </div>

      <section className="hero" style={{ position: 'relative' }}>
        
        <div className="hero-badge">
          <i className="fa-solid fa-bars-staggered"></i> AUDIODESCRIÇÃO EM TEMPO REAL
        </div>
        <h1 className="hero-title">Escute, sinta,<br /><span className="viva">viva.</span></h1>
        <p className="hero-text">
          O <strong>EchoVision</strong> transforma eventos esportivos e culturais em experiências imersivas em áudio, narradas pela nossa IA <strong>ECO</strong>.
        </p>
        <div className="hero-btns">
          <Link to="/eco" className="btn-purple">Conversar com a ECO <i className="fa-solid fa-arrow-right"></i></Link>
          <Link to="/arena" className="btn-outline"><i className="fa-solid fa-headphones"></i> Explorar eventos</Link>
        </div>
      </section>

      {/* Seção de Eventos */}
      <section className="events-section">
        <span className="subtitle">EVENTOS ESPORTIVOS</span>
        <h2 className="section-title">Ingressos com <span className="pink">áudio imersivo</span></h2>
        <p className="section-desc">Cada ingresso inclui narração descritiva ao vivo pela ECO, com fones sem fio sincronizados ao jogo.</p>

        <div className="event-grid">
          {eventosCompra.map((event) => (
            <div className="event-card" key={event.id}>
              <div className="card-header">
                <img src={event.image} alt={`Imagem do evento ${event.title}`} />
                <div className="tags">
                  <span className="tag-cat">{event.category}</span>
                  <span className="tag-info">Audiodescrição ao vivo</span>
                </div>
                <div className="card-overlay"></div>
              </div>
              <div className="card-body">
                <h3>{event.title}</h3>
                <p><i className="fa-regular fa-calendar"></i> {event.date}</p>
                <p><i className="fa-solid fa-location-dot"></i> {event.location}</p>
                <div className="card-footer">
                  <div className="price">
                    <span>a partir de</span>
                    <strong>R$ {event.price}</strong>
                  </div>
                  <button className="btn-buy" onClick={() => handleComprar(event)}>Comprar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default TelaUsuario;