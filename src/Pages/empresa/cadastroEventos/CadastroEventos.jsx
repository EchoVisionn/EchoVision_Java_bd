import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function CadastroEvento() {
  const navigate = useNavigate();

  // 1. Aqui pegamos  ID da empresa logada para fazer o vínculo automático (FK)
  const [idEmpresa, setIdEmpresa] = useState(() => {
    return parseInt(localStorage.getItem('id_empresa')) || null;
  });

  // Estados dos inputs do evento
  const [nome, setNome] = useState('');
  const [local, setLocal] = useState('');
  const [tipo, setTipo] = useState('');
  const [descricao, setDescricao] = useState('');

  // Segurança: Se não houver empresa logada, bloqueia o acesso à página
  useEffect(() => {
    if (!idEmpresa) {
      alert("Acesso restrito para empresas parceiras. Por favor, faça login.");
      navigate('/'); // Redireciona para o login/inicial
    }
  }, [idEmpresa, navigate]);

  const handleCadastrarEvento = async (e) => {
    e.preventDefault();

    const novoEvento = {
      nm_even: nome,
      local_even: local,
      tipo_even: tipo,
      desc_even: descricao,
      empresa: {
        id_emp: idEmpresa 
      }
    };

    try {
      const resposta = await fetch('http://localhost:8080/evento/salvar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoEvento),
      });

      if (resposta.ok) {
        alert("Evento / Exposição acessível cadastrado com sucesso na EchoVision!");
        // Limpa os campos assim como o cadastro
        setNome('');
        setLocal('');
        setTipo('');
        setDescricao('');
      } else {
        alert("Erro ao salvar o evento no servidor Java.");
      }
    } catch (error) {
      console.error("Erro ao conectar no backend:", error);
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <>
      {/* Ondas de identidade visual */}
      <div className="wave-wrapper">
        <svg className="organic-waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path className="wave path-1" d="M0,160 C320,300,420,0,720,160 C1020,320,1120,0,1440,160 V320 H0 Z"></path>
          <path className="wave path-2" d="M0,160 C320,0,420,300,720,160 C1020,20,1120,320,1440,160 V320 H0 Z"></path>
          <path className="wave path-3" d="M0,160 C160,200,320,100,480,160 C640,220,800,100,960,160 C1120,220,1280,100,1440,160 V320 H0 Z"></path>
        </svg>
      </div>

      <main className="auth-main">
        <div className="login-container">
          <button type="button" className="btn-back-clean" onClick={() => navigate(-1)}>
            ← Voltar
          </button>

          <h2>Cadastrar Novo Evento</h2>
          <p style={{ color: '#aaa', marginBottom: '20px', textAlign: 'center' }}>Disponibilize uma nova experiência acessível no app</p>

          <form onSubmit={handleCadastrarEvento}>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Nome do Evento / Exposição" 
                required 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="input-group">
              <input 
                type="text" 
                placeholder="Local (Ex: Ala Leste, Piso 2)" 
                required 
                value={local}
                onChange={(e) => setLocal(e.target.value)}
              />
            </div>

            <div className="input-group">
              <select 
                required 
                value={tipo} 
                onChange={(e) => setTipo(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fff' }}
              >
                <option value="">Selecione o Tipo de Evento</option>
                <option value="Museu">Museu / Exposição Tátil</option>
                <option value="Teatro">Teatro / Audiodrama</option>
                <option value="Cinema">Cinema com Audiodescrição</option>
                <option value="Outro">Outros</option>
              </select>
            </div>

            <div className="input-group">
              <textarea 
                placeholder="Descrição detalhada do evento (Ótimo para acessibilidade!)" 
                required 
                rows="4"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit' }}
              />
            </div>

            <button type="submit" className="btn-login" style={{ backgroundColor: '#a78bfa' }}>
              Publicar Evento
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

export default CadastroEvento;