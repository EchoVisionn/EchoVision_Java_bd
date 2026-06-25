import React, { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // 2. FUNÇÃO DE CONEXÃO COM O SPRING BOOT
  const handleLogin = async (e) => {
    e.preventDefault(); 

    // Montei o objeto exatamente com os atributos esperados pelo seu UsuarioController (@RequestBody Usuario dados)
    const dadosLogin = {
      email_user: email,
      senha_user: senha
    };

    console.log("Tentando efetuar login no IntelliJ com:", dadosLogin);

    try {
      const resposta = await fetch('http://localhost:8080/usuario/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(dadosLogin)
      });

      // Se o status for 200 (OK), significa que o e-mail existe e a senha ta la no bd!
      if (resposta.ok) {
        const usuarioLogado = await resposta.json();
        console.log("Login autorizado! Dados do usuário:", usuarioLogado);
        
        localStorage.setItem('id_user', usuarioLogado.id_user);
        localStorage.setItem('user_name', usuarioLogado.user_name);
        
        alert(`Bem-vindo de volta, ${usuarioLogado.user_name}!`);
        
        // Joga o usuário direto para a TelaUsuario com o Layout logado para ver as arenas e o que mais tiver lá
        navigate('/inicio'); 
      } else {
        // Se cair aqui, pode ser o erro 401 (Senha incorreta ou E-mail não encontrado)
        const erroData = await resposta.json().catch(() => ({}));
        const mensagemErro = erroData.erro || "Credenciais inválidas. Verifique seu e-mail e senha.";
        alert(mensagemErro);
      }

    } catch (error) {
      console.error("Erro de conexão com o Back-end:", error);
      alert("Não foi possível conectar ao servidor. O IntelliJ está rodando?");
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

      {/* Conteúdo Principal (Formulário de Login) */}
      <main className="auth-main">
        <div className="login-container">
          <h1>ECHOVISION</h1>
          <h2>Faça o seu Login</h2>
          
          <form onSubmit={handleLogin}>
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

            <div className="options-group">
              <label className="remember-me">
                <input type="checkbox" /> Lembre-me
              </label>
              <a href="#" className="forgot-password">Esqueci minha senha</a>
            </div>

            <button type="submit" className="btn-login">Login</button>

            <div className="register-link">
              Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default Login;