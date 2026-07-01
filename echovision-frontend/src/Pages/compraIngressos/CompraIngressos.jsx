import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CompraIngressos.css';

const events = [
  {
    id: 1,
    title: 'Exposição "Sentir a Arte: Esculturas para Tocar"',
    category: 'Exposição',
    thumb: '/src/assets/imagens/evento-1.jpg',
    date: '15 de julho de 2026',
    time: '14h às 18h',
    location: 'Museu de Arte de São Paulo (MASP) – Avenida Paulista, 1578, São Paulo - SP',
    price: 60,
    description: 'Uma exposição de artes plásticas totalmente tátil...',
  },
  {
    id: 2,
    title: 'Jantar Sensorial "Sabores no Escuro"',
    category: 'Gastronomia',
    thumb: '/src/assets/imagens/evento-2.jpg',
    date: '01 de agosto de 2026',
    time: '20h às 22h30',
    location: 'Restaurante Ateliê dos Sentidos – Pinheiros, São Paulo - SP',
    price: 120,
    description: 'Uma experiência gastronômica onde o paladar, o olfato e o tato são os protagonistas.',
  },
];

function CompraIngressos() {
  const navigate = useNavigate();
  const location = useLocation();
  const eventFromState = location.state?.event;

  const selectedEvent = useMemo(() => {
    return eventFromState || events[0];
  }, [eventFromState]);

  const [quantity, setQuantity] = useState(1);
  const [selectedType, setSelectedType] = useState('Inteira');
  const [confirmed, setConfirmed] = useState(false);

  const ticketPrice = selectedEvent.price;
  const multiplier = selectedType === 'Meia' ? 0.5 : selectedType === 'Premium' ? 1.5 : 1;
  const unitPrice = ticketPrice * multiplier;
  const total = unitPrice * quantity;

  const handleBuy = () => {
    const idUsuarioLogado = parseInt(localStorage.getItem('id_user'));

    if (!idUsuarioLogado) {
      alert('Para concluir a compra, faça login primeiro.');
      navigate('/login');
      return;
    }

    setConfirmed(true);
  };

  return (
    <div className="compra-ingressos-page">
      <div className="wave-wrapper">
        <svg className="organic-waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path className="wave path-1" d="M0,160 C320,300,420,0,720,160 C1020,320,1120,0,1440,160 V320 H0 Z"></path>
          <path className="wave path-2" d="M0,160 C320,0,420,300,720,160 C1020,20,1120,320,1440,160 V320 H0 Z"></path>
          <path className="wave path-3" d="M0,160 C160,200,320,100,480,160 C640,220,800,100,960,160 C1120,220,1280,100,1440,160 V320 H0 Z"></path>
        </svg>
      </div>

      <div className="compra-shell">
        <div className="compra-topbar">
          <button className="btn-back" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left"></i> Voltar
          </button>
        </div>

        <div className="compra-layout">
          <section className="compra-card">
            <div
              className="compra-card-image"
              style={{ backgroundImage: `url('${selectedEvent.thumb}')` }}
              role="img"
              aria-label={`Imagem de ${selectedEvent.title}`}
            />

            <div className="compra-card-body">
              <span className="compra-badge">{selectedEvent.category}</span>
              <h2>{selectedEvent.title}</h2>
              <p>{selectedEvent.description}</p>

              <div className="compra-details">
                <div className="compra-detail">
                  <span>Data</span>
                  <strong>{selectedEvent.date}</strong>
                </div>
                <div className="compra-detail">
                  <span>Horário</span>
                  <strong>{selectedEvent.time}</strong>
                </div>
              </div>
            </div>
          </section>

          <aside className="compra-summary">
            <h3>Resumo da compra</h3>

            <label htmlFor="ticket-type">Tipo de ingresso</label>
            <select
              id="ticket-type"
              className="compra-select"
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
            >
              <option>Inteira</option>
              <option>Meia</option>
              <option>Premium</option>
            </select>

            <label htmlFor="qty">Quantidade</label>
            <select
              id="qty"
              className="compra-qty"
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
            >
              <option value={1}>1 ingresso</option>
              <option value={2}>2 ingressos</option>
              <option value={3}>3 ingressos</option>
              <option value={4}>4 ingressos</option>
            </select>

            <div className="compra-summary-row">
              <span>Ingresso {selectedType}</span>
              <strong>R$ {unitPrice.toFixed(2)}</strong>
            </div>
            <div className="compra-summary-row">
              <span>Quantidade</span>
              <strong>{quantity}</strong>
            </div>
            <div className="compra-summary-row total">
              <span>Total</span>
              <strong>R$ {total.toFixed(2)}</strong>
            </div>

            <button className="compra-buy-btn" onClick={handleBuy}>
              Confirmar compra
            </button>

            {confirmed && (
              <div className="compra-confirmation">
                <strong>Compra simulada concluída!</strong>
                <p>{quantity} ingresso(s) para {selectedEvent.title} confirmados.</p>
              </div>
            )}
          </aside>
        </div>

        <section className="compra-list-section" style={{ marginTop: '30px' }}>
          <h3 className="compra-list-title">Outros eventos disponíveis</h3>
          <div className="compra-list">
            {events.filter(e => e.id !== selectedEvent.id).map(event => (
              <div key={event.id} className="compra-list-card">
                <img src={event.thumb} alt={event.title} />
                <h4>{event.title}</h4>
                <p>{event.date}</p>
                <a href="#" onClick={e => { e.preventDefault(); navigate('/compra-ingressos', { state: { event } }); }}>
                  Comprar agora
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default CompraIngressos;
