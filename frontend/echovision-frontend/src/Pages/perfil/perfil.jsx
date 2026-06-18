import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './perfil.css'; 

function Perfil() {
  const navigate = useNavigate();

  const [idUsuario, setIdUsuario] = useState(() => {
    return parseInt(localStorage.getItem('id_user')) || null;
  }); 
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');

  //  NOVO balao: Controla o balão de aviso profissional
  const [toast, setToast] = useState({ exibir: false, mensagem: '', tipo: 'sucesso' });

  // Função auxiliar para disparar o aviso e sumir após 3 segundos, se quiser podemos aumentar
  const mostrarAviso = (mensagem, tipo = 'sucesso') => {
    setToast({ exibir: true, mensagem, tipo });
    setTimeout(() => {
      setToast({ exibir: false, mensagem: '', tipo: 'sucesso' });
    }, 3000);
  };

  useEffect(() => {
    if (!idUsuario) return;

    const carregarDadosUsuario = async () => {
      try {
        const respuesta = await fetch(`http://localhost:8080/usuario/`);
        if (respuesta.ok) {
          const usuarios = await respuesta.json();
          const usuarioAtual = usuarios.find(u => u.id_user === idUsuario);
          
          if (usuarioAtual) {
            setNome(usuarioAtual.user_name);
            setEmail(usuarioAtual.email_user);
            setSenha(usuarioAtual.senha_user);
            setCpf(usuarioAtual.cpf_user);
          } else {
            // modifiquei aqui para evitar usar alert, depois vamos fazer iso em todas as ações
            mostrarAviso("Usuário não encontrado no sistema.", "erro");
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados do perfil:", error);
        mostrarAviso("Erro ao conectar com o servidor.", "erro");
      }
    };

    carregarDadosUsuario();
  }, [idUsuario]);


// 🛠️ FUNÇÃO DE ATUALIZAR (PUT) 
  const handleAtualizar = async (e) => {
    e.preventDefault();

    const dadosAtualizados = {
      cpf_user: cpf, 
      user_name: nome,
      email_user: email,
      senha_user: senha
    };

    try {
      const respuesta = await fetch(`http://localhost:8080/usuario/atualizar/${idUsuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosAtualizados)
      });

      if (respuesta.ok) {
        const dadosSalvos = await respuesta.json(); 
        
        mostrarAviso("Perfil atualizado com sucesso!", "sucesso");
      } else {
        mostrarAviso("Erro ao atualizar os dados no Java.", "erro");
      }
    } catch (error) {
      console.error("Erro na requisição de atualização:", error);
      mostrarAviso("Erro de conexão com o servidor.", "erro");
    }
  };

// 🛠️ FUNÇÃO DE DELETAR (DELETE) - PADRONIZADA COM OS TOASTS
  const handleDeletarConta = async () => {
    // Mantemos o confirm nativo apenas para segurança contra cliques acidentais, o usuario pode clicar sem querer e poof, acaba o acesso dele
    const confirmar = window.confirm("Tem certeza absoluta que deseja excluir sua conta? Esta ação não pode ser desfeita.");
    if (!confirmar) return;

    try {
      const respuesta = await fetch(`http://localhost:8080/usuario/deletar/${idUsuario}`, {
        method: 'DELETE'
      });

      if (respuesta.ok) {
        await respuesta.text();

        // Limpa a sessão do navegador
        localStorage.removeItem('id_user');

        // Avisa com o balão que a conta foi removida
        mostrarAviso("Sua conta foi removida com sucesso.", "sucesso");

        // Dá um pequeno tempo de 1.5s para o usuário conseguir ver o balão verde antes de ser deslogado
        setTimeout(() => {
          navigate('/login');
        }, 1500);

      } else {
        mostrarAviso("Erro ao tentar deletar a conta no servidor.", "erro");
      }
    } catch (error) {
      console.error("Erro na requisição de exclusão:", error);
      mostrarAviso("Erro de conexão com o servidor.", "erro");
    }
  };

  // Se o usuário não estiver logado, exibe a tela de aviso de bloqueio (Mantida original)
  if (!idUsuario) {
    return (
      <>
        <div className="wave-wrapper">
          <svg className="organic-waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path className="wave path-1" d="M0,160 C320,300,420,0,720,160 C1020,320,1120,0,1440,160 V320 H0 Z"></path>
            <path className="wave path-2" d="M0,160 C320,0,420,300,720,160 C1020,20,1120,320,1440,160 V320 H0 Z"></path>
            <path className="wave path-3" d="M0,160 C160,200,320,100,480,160 C640,220,800,100,960,160 C1120,220,1280,100,1440,160 V320 H0 Z"></path>
          </svg>
        </div>

        <main className="auth-main">
          <div className="login-container perfil-container" style={{ textAlign: 'center', padding: '40px 30px' }}>
            <button type="button" className="btn-back-clean" onClick={() => navigate('/')}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <div style={{ fontSize: '3.5rem', color: '#a78bfa', marginBottom: '15px', marginTop: '10px' }}>
              <i className="fa-solid fa-user-lock"></i>
            </div>
            <h2>Acesso Restrito</h2>
            <p style={{ color: '#aaa', marginBottom: '25px', lineHeight: '1.5' }}>
              Para visualizar ou gerenciar suas informações de perfil, você precisa estar conectado a uma conta ativa no EchoVision.
            </p>
            <button onClick={() => navigate('/login')} className="btn-login" style={{ backgroundColor: '#a78bfa' }}>
              Fazer Login ou Criar Conta
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {/*  INJEÇÃO DA NOTIFICAÇÃO DINÂMICA NA TELA */}
      {toast.exibir && (
        <div className="toast-container">
          <div className={`toast-box ${toast.tipo}`}>
            <i className={toast.tipo === 'sucesso' ? "fa-solid fa-circle-check" : "fa-solid fa-circle-xmark"}></i>
            <span>{toast.mensagem}</span>
          </div>
        </div>
      )}

      {/* Ondas de Fundo */}
      <div className="wave-wrapper">
        <svg className="organic-waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path className="wave path-1" d="M0,160 C320,300,420,0,720,160 C1020,320,1120,0,1440,160 V320 H0 Z"></path>
          <path className="wave path-2" d="M0,160 C320,0,420,300,720,160 C1020,20,1120,320,1440,160 V320 H0 Z"></path>
          <path className="wave path-3" d="M0,160 C160,200,320,100,480,160 C640,220,800,100,960,160 C1120,220,1280,100,1440,160 V320 H0 Z"></path>
        </svg>
      </div>

      <main className="auth-main">
        <div className="login-container perfil-container" style={{ position: 'relative' }}>
          <button type="button" className="btn-back-clean" onClick={() => navigate('/')} title="Voltar">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h2>Seu Perfil</h2>
          <p style={{ color: '#aaa', marginBottom: '20px', textAlign: 'center' }}>Atualize seus dados ou gerencie sua conta</p>          
          <form onSubmit={handleAtualizar}>
            {/* Input Nome */}
            <div className="input-group">
              <input type="text" placeholder="Nome Completo" required value={nome} onChange={(e) => setNome(e.target.value)} />
              <div className="icon"><i className="fa-solid fa-user"></i></div>
            </div>

            {/* Input CPF */}
            <div className="input-group">
              <input type="number" placeholder="CPF" required value={cpf} onChange={(e) => setCpf(e.target.value)} />
              <div className="icon"><i className="fa-solid fa-id-card"></i></div>
            </div>

            {/* Input E-mail */}
            <div className="input-group">
              <input type="email" placeholder="E-mail" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <div className="icon"><i className="fa-solid fa-envelope"></i></div>
            </div>
            
            {/* Input Senha */}
            <div className="input-group">
              <input type="password" placeholder="Nova Senha" required value={senha} onChange={(e) => setSenha(e.target.value)} />
              <div className="icon"><i className="fa-solid fa-lock"></i></div>
            </div>

            <button type="submit" className="btn-login" style={{ backgroundColor: '#4ade80' }}>
              Salvar Alterações
            </button>

            <button type="button" className="btn-login" onClick={handleDeletarConta} style={{ backgroundColor: '#ef4444', marginTop: '10px' }}>
              Excluir minha Conta
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

export default Perfil;