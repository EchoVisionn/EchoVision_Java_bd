import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CadastroEmpresa() {
  const navigate = useNavigate();

  // Estados para capturar os dados dos inputs B2B
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');

  const handleCadastro = async (e) => {
    e.preventDefault();

    // o JSON exatamente como o seu EmpresaController.java espera receber
    const novaEmpresa = {
      nm_emp: nome,
      cnpj_emp: cnpj,
      email_emp: email,
      tel_emp: telefone,
      end_emp: endereco,
      // O token_emp e status_emp o Java vai gerar automaticamente nos bastidores! (no caso seria nosso token da IA e serviço etc....)
    };

    try {
      const resposta = await fetch('http://localhost:8080/empresa/salvar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novaEmpresa),
      });

      if (resposta.ok) {
        const dadosSalvos = await resposta.json();
        localStorage.setItem('id_empresa', dadosSalvos.id_emp);  
        alert(`Empresa parceira "${dadosSalvos.nm_emp}" cadastrada!\nToken: ${dadosSalvos.token_emp}`);
        navigate('/cadastro-evento'); // aqui mandamos o usuario para criar eventos!
      } else {
        alert('Erro ao cadastrar a empresa. Verifique se o CNPJ ou E-mail já existem.');
      }
    } catch (error) {
      console.error('Erro na conexão com o servidor Java:', error);
      alert('Não foi possível conectar ao servidor backend.');
    }
  };

  return (
    <>
      {/* Mantendo a identidade visual das ondas do EchoVision */}
      <div className="wave-wrapper">
        <svg className="organic-waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path className="wave path-1" d="M0,160 C320,300,420,0,720,160 C1020,320,1120,0,1440,160 V320 H0 Z"></path>
          <path className="wave path-2" d="M0,160 C320,0,420,300,720,160 C1020,20,1120,320,1440,160 V320 H0 Z"></path>
          <path className="wave path-3" d="M0,160 C160,200,320,100,480,160 C640,220,800,100,960,160 C1120,220,1280,100,1440,160 V320 H0 Z"></path>
        </svg>
      </div>

      <main className="auth-main">
        <div className="login-container" style={{ position: 'relative' }}>
          
          <button 
            type="button" 
            className="btn-back-clean" 
            onClick={() => navigate('/')}
            title="Voltar"
            aria-label="Botão Voltar"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>

          <h2>Cadastro de Parceiro B2B</h2>
          <p style={{ color: '#aaa', marginBottom: '20px', textAlign: 'center' }}>Cadastre sua instituição na plataforma EchoVision</p>

          <form onSubmit={handleCadastro}>
            {/* Input Nome da Empresa */}
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Nome da Empresa / Museu" 
                required 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <div className="icon"><i className="fa-solid fa-building"></i></div>
            </div>

            {/* Input CNPJ */}
            <div className="input-group">
              <input 
                type="text" 
                placeholder="CNPJ" 
                maxLength="16"
                required 
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
              />
              <div className="icon"><i className="fa-solid fa-id-card-clip"></i></div>
            </div>

            {/* Input E-mail Corporativo */}
            <div className="input-group">
              <input 
                type="email" 
                placeholder="E-mail Corporativo" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="icon"><i className="fa-solid fa-envelope"></i></div>
            </div>

            {/* Input Telefone */}
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Telefone (DDD + Número)" 
                maxLength="11"
                required 
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
              <div className="icon"><i className="fa-solid fa-phone"></i></div>
            </div>

            {/* Input Endereço */}
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Endereço da Instituição" 
                required 
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-login" style={{ backgroundColor: '#a78bfa', marginTop: '10px' }}>
              Cadastrar Instituição
            </button>   
          </form>
        </div>
      </main>
    </>
  );
}

export default CadastroEmpresa;