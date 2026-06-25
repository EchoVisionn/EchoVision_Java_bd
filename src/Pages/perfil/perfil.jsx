import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../perfil/perfil.css'; // 🔥 Corrigido para 'perfil.css' com p minúsculo

// Imagens — coloque em src/assets/imagens/
import autoCompadecida from '../../assets/imagens/img_membros/alex_perfil.png';
import tarsila from '../../assets/imagens/img_membros/alex_perfil.png';

function Perfil() {
  // Controla qual aba está ativa (substitui o changeTab do JS)
  const [activeTab, setActiveTab] = useState('eventos');

  return (
    <>
      {/* ── BANNER ─────────────────────────────────── */}
      <section className="profile-banner">
        <div className="banner-content">
          <h1>Meu Perfil</h1>
          <p>Seja bem-vinda Isabela</p>
        </div>
      </section>

      {/* ── LAYOUT SIDEBAR + CONTEÚDO ──────────────── */}
      <div className="container-layout">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-title">
            <span>Opções de conta</span>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'eventos' ? 'active' : ''}`}
              onClick={() => setActiveTab('eventos')}
            >
              Meus ingressos
            </button>

            <button
              className={`nav-item ${activeTab === 'dados' ? 'active' : ''}`}
              onClick={() => setActiveTab('dados')}
            >
              Informações Pessoais
            </button>

            <button className="nav-item">
              Privacidade e Segurança
            </button>

            <button className="nav-item">
              Ajuda
            </button>
          </nav>
        </aside>

        {/* CONTEÚDO DINÂMICO */}
        <section className="content-area">

          {/* ABA: MEUS INGRESSOS */}
          {activeTab === 'eventos' && (
            <div className="card">
              <h2 className="desktop-only">Próximos Eventos</h2>
              <hr className="desktop-only" />

              <div className="evento-card">
                <img src={autoCompadecida} alt="O Auto da Compadecida" />
                <div className="evento-info">
                  <h3>Peça de Teatro: O Auto da Compadecida</h3>
                  <p><strong>Data e Hora:</strong> Sábado, 18 de Abril de 2026, às 20h00.</p>
                  <p><strong>Local:</strong> Teatro Sesc Pinheiros - São Paulo, SP.</p>
                  <p><strong>Descrição:</strong> Uma comédia clássica brasileira. A tecnologia de IA no local descreverá...</p>
                </div>
              </div>

              <div className="evento-card">
                <img src={tarsila} alt="Obras de Tarsila do Amaral" />
                <div className="evento-info">
                  <h3>Exposição Imersiva: Obras de Tarsila do Amaral</h3>
                  <p><strong>Data e Hora:</strong> Diariamente, das 10h às 20h.</p>
                  <p><strong>Local:</strong> MIS Experience - São Paulo, SP.</p>
                  <p><strong>Descrição:</strong> Navegue livremente pela galeria. Aponte o celular e ouça a audiodramatização...</p>
                </div>
              </div>
            </div>
          )}

          {/* ABA: INFORMAÇÕES PESSOAIS */}
          {activeTab === 'dados' && (
            <div className="card">
              <h2 className="desktop-only">Informações Pessoais</h2>
              <hr className="desktop-only" />

              <form className="profile-form" onSubmit={e => e.preventDefault()}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nome">Nome</label>
                    <input type="text" id="nome" defaultValue="Isabela" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="sobrenome">Sobrenome</label>
                    <input type="text" id="sobrenome" defaultValue="Isabela" />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="email">E-mail</label>
                  <input type="email" id="email" defaultValue="isabela@email.com" />
                </div>

                <div className="form-row triplet">
                  <div className="form-group">
                    <label htmlFor="pais">País de Residência</label>
                    <input type="text" id="pais" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="doc">Tipo de documento</label>
                    <input type="text" id="doc" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cpf">CPF</label>
                    <input type="text" id="cpf" />
                  </div>
                </div>

                <div className="form-row phone-row">
                  <div className="form-group code-part">
                    <label htmlFor="code">Código</label>
                    <input type="tel" id="code" placeholder="+55" />
                  </div>
                  <div className="form-group phone-part">
                    <label htmlFor="telefone">Telefone</label>
                    <input type="tel" id="telefone" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nascimento">Data de nascimento</label>
                    <input type="date" id="nascimento" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="genero">Gênero</label>
                    <input type="text" id="genero" />
                  </div>
                </div>

                <div className="form-buttons">
                  <button type="button" className="btn-cancel">Cancelar</button>
                  <button type="submit" className="btn-save">Salvar alterações</button>
                </div>
              </form>
            </div>
          )}

        </section>
      </div>
    </>
  );
}

export default Perfil;
