import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DashboardEmpresa.css';

function DashboardEmpresa() {
  const navigate = useNavigate();
  const [idEmpresa, setIdEmpresa] = useState(() => parseInt(localStorage.getItem('id_empresa')) || null);
  const [nomeEmpresa, setNomeEmpresa] = useState('Instituição Parceira');
  const [tokenEmpresa, setTokenEmpresa] = useState('Não gerado');
  const [eventos, setEventos] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState('overview');

  useEffect(() => {
    // Se não houver empresa simulada ou logada, cria credenciais padrão para testes não quebrarem
    if (!idEmpresa) {
      localStorage.setItem('id_empresa', '100');
      localStorage.setItem('token_empresa', 'ECV-2026-X799-B2B');
      setIdEmpresa(100);
    }
    
    setTokenEmpresa(localStorage.getItem('token_empresa') || 'ECV-2026-X799-B2B');
    
    // Mock de dados dos eventos da empresa parceira
    setEventos([
      { id: 1, nome: "O Grito — Exposição Áudio Imersivo 3D", tipo: "Museu", status: "Ativo", acessos: 142 },
      { id: 2, nome: "Auto da Compadecida — Audiodrama Adaptado", tipo: "Teatro", status: "Ativo", acessos: 385 }
    ]);
  }, [idEmpresa]);

  return (
    <div className="b2b-dashboard-page">
      {/* 🌟 BOTÃO DE VOLTAR PREMIUM (Apenas o ícone da seta, sem texto "Voltar") */}
      <button type="button" className="btn-back-clean" onClick={() => navigate(-1)}>
        <i className="fa-solid fa-arrow-left"></i>
      </button>

      {/* Banner Corporativo */}
      <section className="b2b-banner">
        <div className="b2b-banner-content">
          <h1>Painel do Parceiro</h1>
          <p>Gerenciamento e Indicadores do Ecossistema EchoVision B2B</p>
        </div>
      </section>

      <div className="b2b-layout-container">
        {/* Menu Lateral */}
        <aside className="b2b-sidebar">
          <div className="sidebar-title">
            <span>Menu Corporativo</span>
          </div>
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${abaAtiva === 'overview' ? 'active' : ''}`}
              onClick={() => setAbaAtiva('overview')}
            >
              <i className="fa-solid fa-chart-pie"></i> Visão Geral
            </button>
            <button 
              className={`nav-item ${abaAtiva === 'eventos' ? 'active' : ''}`}
              onClick={() => setAbaAtiva('eventos')}
            >
              <i className="fa-solid fa-calendar-days"></i> Meus Eventos ({eventos.length})
            </button>
            <Link to="/cadastro-evento" className="nav-item btn-add-event-link">
              <i className="fa-solid fa-circle-plus"></i> Publicar Evento
            </Link>
          </nav>
        </aside>

        {/* Conteúdo Principal */}
        <main className="b2b-main-content">
          
          {abaAtiva === 'overview' && (
            <div className="tab-overview">
              <h2>Métricas de Impacto da ECO IA</h2>
              
              <div className="metrics-grid">
                <div className="metric-card">
                  <h3>Engajamento Imersivo</h3>
                  <div className="metric-value">527</div>
                  <p>Usuários PCD que sintonizaram suas frequências de áudio</p>
                </div>
                <div className="metric-card">
                  <h3>Acessibilidade Ativa</h3>
                  <div className="metric-value">94%</div>
                  <p>Taxa de feedback positivo sobre audiodescrição posicional</p>
                </div>
                <div className="metric-card">
                  <h3>Status do Serviço</h3>
                  <div className="metric-value status-online">Online</div>
                  <p>Integração de hardware/software operando normalmente</p>
                </div>
              </div>

              {/* Box de Segurança do Token API */}
              <div className="token-security-box">
                <div className="token-info">
                  <h3><i className="fa-solid fa-key"></i> Token de Integração Corporativa</h3>
                  <p>Insira este token nos guias físicos ou totens da sua instituição para sincronizar as faixas à IA.</p>
                  <div className="token-display">
                    <code>{tokenEmpresa}</code>
                    <button onClick={() => {
                      navigator.clipboard.writeText(tokenEmpresa);
                      alert("Token corporativo copiado!");
                    }} className="btn-copy">
                      <i className="fa-regular fa-copy"></i> Copiar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {abaAtiva === 'eventos' && (
            <div className="tab-eventos">
              <div className="tab-header-flex">
                <h2>Eventos Publicados</h2>
                <Link to="/cadastro-evento" className="btn-create-small">Novo Evento</Link>
              </div>

              <div className="events-table-wrapper">
                <table className="b2b-table">
                  <thead>
                    <tr>
                      <th>Nome do Evento</th>
                      <th>Segmento</th>
                      <th>Status</th>
                      <th>Ouvintes Ativos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventos.map(ev => (
                      <tr key={ev.id}>
                        <td><strong>{ev.nome}</strong></td>
                        <td><span className="type-badge">{ev.tipo}</span></td>
                        <td><span className="status-badge">{ev.status}</span></td>
                        <td><i className="fa-solid fa-headphones"></i> {ev.acessos} sintonizados</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default DashboardEmpresa;