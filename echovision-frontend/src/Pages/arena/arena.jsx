import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './arena.css';

import evento1 from '../../assets/imagens/evento-1.jpg';
import evento2 from '../../assets/imagens/evento-2.jpg';
import evento3 from '../../assets/imagens/evento-3.jpg';
import evento4 from '../../assets/imagens/evento-4.jpeg';
import evento5 from '../../assets/imagens/evento-5.jpg';
import evento6 from '../../assets/imagens/evento-6.jpg';
import evento7 from '../../assets/imagens/evento-7.jpg';
import evento8 from '../../assets/imagens/evento-8.jpg';
import evento9 from '../../assets/imagens/evento-9.jpg';
import evento10 from '../../assets/imagens/evento-10.jpg';

const events = [
  {
    id: 1,
    title: 'Exposição "Sentir a Arte: Esculturas para Tocar"',
    category: 'Exposição',
    thumb: evento1,
    price: 60,
    date: '15 de julho de 2026',
    time: '14h às 18h',
    location: 'Museu de Arte de São Paulo (MASP) – Avenida Paulista, 1578, São Paulo - SP',
    description:
      'Uma exposição de artes plásticas totalmente tátil. Os visitantes são convidados a explorar esculturas de diferentes texturas, tamanhos e materiais (mármore, bronze e madeira). O evento conta com audiodescrição de todas as peças via fones de ouvido, sinalização em braille e piso podotátil em todo o percurso.',
  },
  {
    id: 2,
    title: 'Jantar Sensorial "Sabores no Escuro"',
    category: 'Gastronomia',
    thumb: evento2,
    price: 120,
    date: '01 de agosto de 2026',
    time: '20h às 22h30',
    location: 'Restaurante Ateliê dos Sentidos – Pinheiros, São Paulo - SP',
    description:
      'Uma experiência gastronômica onde o paladar, o olfato e o tato são os protagonistas. Os participantes desfrutam de um menu surpresa de três tempos em um ambiente completamente escuro. Garçons especializados guiam os clientes pela experiência, que conta com música ao vivo em formato acústico 3D.',
  },
  {
    id: 3,
    title: 'Teatro com Audiodescrição: "O Som do Silêncio"',
    category: 'Teatro',
    thumb: evento3,
    price: 95,
    date: '16 de agosto de 2026',
    time: '18h',
    location: 'Teatro Municipal do Rio de Janeiro – Praça Floriano, S/N, Rio de Janeiro - RJ',
    description:
      'Apresentação de uma peça teatral dramática com equipamento de audiodescrição individual. Antes do espetáculo, haverá um "reconhecimento de palco" (às 16h30), onde o público cego poderá subir ao palco para tocar no cenário, nos figurinos e interagir com os atores para reconhecer suas vozes e estaturas.',
  },
  {
    id: 4,
    title: 'Oficina de Tecnologia: "Domando o Smartphone com Leitores de Tela"',
    category: 'Tecnologia',
    thumb: evento4,
    price: 45,
    date: '05 de setembro de 2026',
    time: '09h às 12h',
    location: 'Biblioteca Mário de Andrade – Rua da Consolação, 94, São Paulo - SP',
    description:
      'Um workshop prático voltado para o uso avançado de leitores de tela (TalkBack e VoiceOver). Focado em acessibilidade digital, navegação em aplicativos de banco, redes sociais e ferramentas de inteligência artificial voltadas para descrição de imagens em tempo real.',
  },
  {
    id: 5,
    title: 'Circuito de Corrida e Caminhada Guiada "Lado a Lado"',
    category: 'Esporte',
    thumb: evento5,
    price: 35,
    date: '20 de setembro de 2026',
    time: '07h (Concentração) | 08h (Largada)',
    location: 'Parque do Ibirapuera (Portão 3) – São Paulo - SP',
    description:
      'Evento esportivo inclusivo de 5km. Corredores e caminhantes cegos são emparelhados com atletas-guias voluntários por meio de faixas de ligação. O percurso conta com staff treinado, pontos de hidratação acessíveis e medalhas com inscrições em braille e relevo.',
  },
  {
    id: 6,
    title: 'Cine Inclusão: Lançamentos Nacionais com Transmissão de Audiodescrição',
    category: 'Cinema',
    thumb: evento6,
    price: 58,
    date: '10 de outubro de 2026',
    time: '15h',
    location: 'Cine Belas Artes – Rua da Consolação, 2423, São Paulo - SP',
    description:
      'Sessão de cinema adaptada exibindo um grande lançamento do cinema brasileiro. O evento disponibiliza o aplicativo MobiCinema ou fones de ouvido físicos para audiodescrição integrada, sem interferir no som original do filme para os demais acompanhantes. O volume do som ambiente é levemente equalizado para maior conforto.',
  },
  {
    id: 7,
    title: 'Degustação de Vinhos Sensorial: "Aromas e Texturas"',
    category: 'Degustação',
    thumb: evento7,
    price: 110,
    date: '24 de outubro de 2026',
    time: '19h',
    location: 'Enoteca Jardins – Alameda Lorena, São Paulo - SP',
    description:
      'Um minicurso de sommelier focado na percepção olfativa e gustativa de vinhos finos. As fichas técnicas das bebidas estão disponíveis em braille e macrocaracteres. As garrafas possuem gargalos com texturas diferentes para identificação rápida do tipo de uva.',
  },
  {
    id: 8,
    title: 'Sarau Literário "Palavras que Tocam"',
    category: 'Literatura',
    thumb: evento8,
    price: 25,
    date: '11 de novembro de 2026',
    time: '16h',
    location: 'Biblioteca Louis Braille (Centro Cultural São Paulo) – Rua Vergueiro, 1000, São Paulo - SP',
    description:
      'Um encontro de poetas, escritores e leitores. O sarau promove a leitura de poesias em braille, contação de histórias com sonoplastia imersiva (áudio 8D) e microfone aberto para quem quiser recitar textos próprios ou cantar.',
  },
  {
    id: 9,
    title: 'Oficina de Dança e Expressão Corporal "Ritmo e Espaço"',
    category: 'Dança',
    thumb: evento9,
    price: 50,
    date: '28 de novembro de 2026',
    time: '10h às 12h',
    location: 'Centro de Dança do Distrito Federal – Setor de Autarquias Nortes, Brasília - DF',
    description:
      'Oficina de dança contemporânea voltada para o desenvolvimento da orientação espacial e consciência corporal. Os instrutores utilizam comandos verbais descritivos e precisos, além de estímulos sonoros táteis (como tapetes com marcações de relevo no chão) para delimitar o espaço de movimento.',
  },
  {
    id: 10,
    title: 'Stand-up Comedy "Rir para Ver"',
    category: 'Humor',
    thumb: evento10,
    price: 80,
    date: '12 de dezembro de 2026',
    time: '21h',
    location: 'Comedians Club – Rua Augusta, São Paulo - SP',
    description:
      'Uma noite de comédia focada no humor verbal e situacional, com comediantes que adaptam suas piadas visuais para formatos descritivos em tempo real. O show conta com fones de audiodescrição para descrever expressões faciais expressivas ou reações físicas dos humoristas no palco que complementem as piadas.',
  },
];

function EventCard({ event, onOpen }) {
  const navigate = useNavigate();

  return (
    <article className="card-arena">
      <button
        type="button"
        className="card-arena-trigger"
        onClick={() => onOpen(event)}
        aria-label={`Abrir detalhes do evento ${event.title}`}
      >
        <div>
          <div
            className="card-arena-thumb"
            style={{ backgroundImage: `url('${event.thumb}')` }}
            role="img"
            aria-label={`Imagem do evento: ${event.title}`}
          >
            <div className="card-arena-overlay" aria-hidden="true">
              {event.category}
            </div>
          </div>

          <div className="card-arena-info">
            <h4>{event.title}</h4>
            <div className="campeonato">{event.date}</div>
            <p className="event-location-card">{event.location}</p>
          </div>
        </div>
      </button>

      <div className="card-arena-action">
        <button className="btn-primary" onClick={e => { e.stopPropagation(); onOpen(event); }}>
          Ver detalhes <i className="fa-solid fa-caret-right" aria-hidden="true" />
        </button>
        <button className="btn-buy-card" onClick={e => { e.stopPropagation(); navigate('/compra-ingressos', { state: { event } }); }}>
          Comprar ingresso
        </button>
      </div>
    </article>
  );
}

export default function Arena() {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);

  const featuredEvent = events[0];

  return (
    <div className="arena-page">
      <main className="arena-main">
        <section className="arena-section">
          <h1>Eventos</h1>
          <p className="subtitle">Descubra experiências inclusivas, culturais e sensoriais para todos.</p>

          <article className="card-live">
            <div className="card-live-header">
              <img src={featuredEvent.thumb} alt={featuredEvent.title} />
            </div>

            <div className="card-live-body">
              <h3>{featuredEvent.title}</h3>
              <p><strong>Data:</strong> {featuredEvent.date}</p>
              <p><strong>Horário:</strong> {featuredEvent.time}</p>
              <p><strong>Local:</strong> {featuredEvent.location}</p>
              <p className="card-live-description">
                {featuredEvent.description}
              </p>
              <button className="btn-primary" onClick={() => setSelectedEvent(featuredEvent)}>
                <i className="fa-solid fa-play" style={{ fontSize: '0.7rem' }} aria-hidden="true" />
                Ver destaque
              </button>
            </div>
          </article>
        </section>

        <section className="arena-section">
          <h2>Próximos Eventos</h2>
          <p className="subtitle">
            Explore o calendário completo e escolha uma experiência que combine com você.
          </p>

          <div className="arena-grid">
            {events.map(event => (
              <EventCard key={event.id} event={event} onOpen={setSelectedEvent} />
            ))}
          </div>
        </section>
      </main>

      {selectedEvent && (
        <div className="modal-backdrop" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="event-modal-title" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedEvent(null)} aria-label="Fechar detalhes do evento">
              ×
            </button>

            <div className="modal-image" style={{ backgroundImage: `url('${selectedEvent.thumb}')` }} role="img" aria-label={`Imagem de ${selectedEvent.title}`} />

            <div className="modal-body">
              <span className="modal-category">{selectedEvent.category}</span>
              <h3 id="event-modal-title">{selectedEvent.title}</h3>

              <div className="modal-meta">
                <div>
                  <span className="meta-label">Data</span>
                  <span>{selectedEvent.date}</span>
                </div>
                <div>
                  <span className="meta-label">Horário</span>
                  <span>{selectedEvent.time}</span>
                </div>
              </div>

              <div className="modal-location">
                <span className="meta-label">Local</span>
                <span>{selectedEvent.location}</span>
              </div>

              <p className="modal-description">{selectedEvent.description}</p>

              <div className="modal-footer">
                <div className="modal-price">
                  <span className="meta-label">A partir de</span>
                  <strong>R$ {selectedEvent.price}</strong>
                </div>
                <button className="btn-primary modal-buy-btn" onClick={() => { setSelectedEvent(null); navigate('/compra-ingressos', { state: { event: selectedEvent } }); }}>
                  Comprar ingresso
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
