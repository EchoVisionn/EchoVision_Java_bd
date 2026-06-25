import React from 'react';
import './arena.css';

// ◄ CORREÇÃO: Importando as imagens dos cards e escudos de dentro de src/assets/imagens/
import thumbSantosFlamengo from '../../assets/imagens/santosxflamengo.jpg';
import thumbVascoPalmeiras from '../../assets/imagens/vascoxpalmeiras.jpg';
import thumbArgentinaBrasil from '../../assets/imagens/argentinaxbrasil.jpg';
import escudo1 from '../../assets/imagens/escudo1.webp';
import escudo2 from '../../assets/imagens/escudo2.png';

const matches = [
  {
    id: 1,
    thumb: thumbSantosFlamengo, // ◄ Usando a imagem importada
    placar: '4 x 5',
    titulo: 'Santos 4 x 5 Flamengo — melhores momentos',
    campeonato: 'Brasileirão 2011',
    href: '/arena/video1',
  },
  {
    id: 2,
    thumb: thumbVascoPalmeiras, // ◄ Usando a imagem importada
    placar: '4 x 3',
    titulo: 'Vasco 4 x 3 Palmeiras — A virada do Século',
    campeonato: 'Final Copa Mercosul 2000',
    href: null,
  },
  {
    id: 3,
    thumb: thumbArgentinaBrasil, // ◄ Usando a imagem importada
    placar: '2 x 2',
    titulo: 'Argentina 2 x 2 Brasil',
    campeonato: 'Copa América 2004',
    href: null,
  },
];

function MatchCard({ match }) {
  function handleClick() {
    if (match.href) window.location.href = match.href;
  }

  return (
    <div
      className="card-arena"
      onClick={handleClick}
      role={match.href ? 'link' : undefined}
      tabIndex={match.href ? 0 : undefined}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
      aria-label={match.titulo}
    >
      <div>
        <div
          className="card-arena-thumb"
          style={{ backgroundImage: `url('${match.thumb}')` }} // Funciona perfeitamente com a variável do React
          role="img"
          aria-label={`Imagem da partida: ${match.titulo}`}
        >
          <div className="card-arena-overlay" aria-hidden="true">
            {match.placar}
          </div>
        </div>

        <div className="card-arena-info">
          <h4>{match.titulo}</h4>
          <div className="campeonato">{match.campeonato}</div>
        </div>
      </div>

      <div className="card-arena-action">
        <button className="btn-primary" onClick={handleClick}>
          Ouvir Experiência <i className="fa-solid fa-caret-right" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default function Arena() {
  return (
    <main className="arena-main">
      {/* ── LIVE ──────────────────────────────────── */}
      <section className="arena-section">
        <h1>Transmissões ao vivo</h1>
        <p className="subtitle">Selecione uma partida e prepare seus fones de ouvido!</p>

        <div className="card-live">
          <div className="card-live-header">
            <div className="escudo-placeholder">
              <img src={escudo1} alt="Escudo do time da casa" /> {/* ◄ Usando o escudo importado */}
            </div>
            <span>VS</span>
            <div className="escudo-placeholder">
              <img src={escudo2} alt="Escudo do time visitante" /> {/* ◄ Usando o escudo importado */}
            </div>
          </div>

          <div className="card-live-body">
            <h3>Final do Campeonato</h3>
            <p><strong>Local:</strong> Arena das Emoções / 21:00h</p>
            <p style={{ fontSize: '0.8rem', marginBottom: '20px' }}>
              <strong>Sintonize</strong> na nossa frequência exclusiva para narração descritiva posicional
              e vibração do estádio.
            </p>
            <button className="btn-primary">
              <i className="fa-solid fa-play" style={{ fontSize: '0.7rem' }} aria-hidden="true" />
              Sintonizar Áudio
            </button>
          </div>
        </div>
      </section>

      {/* ── CLIPES ────────────────────────────────── */}
      <section className="arena-section">
        <h2>Arena Esportiva</h2>
        <p className="subtitle">
          Selecione um clipe curto e sinta a <span style={{ color: 'var(--primary-purple)' }}>emoção</span>
        </p>

        <div className="arena-grid">
          {matches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>
    </main>
  );
}