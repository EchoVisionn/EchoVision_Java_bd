import React, { useState } from 'react'; 
import './cadastro.css'; 
import { Link, useNavigate } from 'react-router-dom'; 

function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [cpf, setCpf] = useState('');

  const enviarParaOJava = async (evento) => {
    evento.preventDefault(); 

    // Validação básica: as senhas precisam bater antes de mandar pro banco
    if (senha !== confirmarSenha) {
      alert("As senhas informadas não coincidem!");
      return;
    }

    const dadosUsuario = {
      cpf_user: cpf, 
      user_name: nome,
      email_user: email,
      senha_user: senha
    };

    console.log("Enviando pacote para o IntelliJ:", dadosUsuario);

    try {
      // Fazemos a chamada HTTP POST para a rota do seu UsuarioController
      const resposta = await fetch('http://localhost:8080/usuario/salvar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosUsuario) 
      });

      if (resposta.ok) {
        const dadosRetornados = await resposta.json();
        console.log("Sucesso! Resposta do Java:", dadosRetornados);
        alert("Sua conta foi criada com sucesso no banco de dados!");
        
        // Aqui a gente está limpando os campos dos forms para deixar amais dinamico
        setNome('');
        setEmail('');
        setSenha('');
        setConfirmarSenha('');
        setCpf('');
        
        navigate('/'); // Redireciona para o login após cadastrar
      } else {
        alert("O servidor Java recusou o cadastro. Código de status: " + resposta.status);
      }
    } catch (error) {
      console.error("Erro na comunicação full-stack:", error);
      alert("Não consegui conectar ao Back-end. O IntelliJ está rodando em localhost:8080?");
    }
  };

  return (
    <>
      {/* Ondas de Fundo */}
      <div className="wave-wrapper">
        <svg className="organic-waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path className="wave path-1" d="M0,160 C320,300,420,0,720,160 C1020,320,1120,0,1440,160 V320 H0 Z"></path>
          <path className="wave path-2" d="M0,160 C320,0,420,300,720,160 C1020,20,1120,320,1440,160 V320 H0 Z"></path>
          <path className="wave path-3" d="M0,160 C160,200,320,100,480,160 C640,220,800,100,960,160 C1120,220,1280,100,1440,160 V320 H0 Z"></path>
        </svg>
      </div>

      <main className="auth-main">
        <div className="login-container">
          <h2>Crie sua Conta</h2>
          
          {/* Conectamos a nossa função de disparo ao evento onSubmit */}
          <form onSubmit={enviarParaOJava}>
            
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Nome Completo" 
                required 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <div className="icon">
                <i className="fa-solid fa-user"></i>
              </div>
            </div>

            <div className="input-group">
              <input 
                type="text" 
                placeholder="CPF (Somente números)" 
                maxLength="11"
                required 
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
              <div className="icon">
                <i className="fa-solid fa-id-card"></i>
              </div>
            </div>

            {/* Campo E-mail */}
            <div className="input-group">
              <input 
                type="email" 
                placeholder="E-mail" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="icon">
                <i className="fa-solid fa-envelope"></i>
              </div>
            </div>
            
            <div className="input-group">
              <input 
                type="password" 
                placeholder="Senha" 
                required 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <div className="icon">
                <i className="fa-solid fa-lock"></i>
              </div>
            </div>

            {/* Campo Confirmar Senha */}
            <div className="input-group">
              <input 
                type="password" 
                placeholder="Confirmar senha" 
                required 
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
              <div className="icon">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
            </div>

            <div className="options-group">
              <label className="remember-me">
                <input type="checkbox" required /> Eu aceito os Termos e Condições
              </label>
            </div>

            <button type="submit" className="btn-login">Cadastrar</button>

            {/*  LINK DE CONEXÃO B2B ADICIONADO AQUI, SE QUISER PODE ALTERAR PARA DEIXAR MAIS CHAMATIVO */}
            <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
              <p style={{ color: '#aaa', fontSize: '0.85rem', margin: 0 }}>
                Representa um museu ou instituição cultural?{' '}
                <Link to="/cadastro-empresa" style={{ color: '#a78bfa', fontWeight: 'bold', textDecoration: 'none' }}>
                  Cadastre-se aqui como Parceiro B2B
                </Link>
              </p>
            </div>

            <div className="register-link" style={{ marginTop: '15px' }}>
              Já tem uma conta? <Link to="/">Entrar</Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default Cadastro;