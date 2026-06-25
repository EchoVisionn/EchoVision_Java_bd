import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';

// Importações padronizadas com caminhos absolutos /src/ para evitar erros de pasta do Vite
import Login from '/src/pages/login/login';
import Cadastro from '/src/pages/cadastro/cadastro'; 
import TelaUsuario from '/src/pages/telaUsuario/telaUsuario';
import Perfil from '/src/pages/perfil/perfil';
import Arena from '/src/pages/arena/arena';
import Galeria from '/src/Pages/galeria/galeria'; // 🔥 Corrigido para 'Pages' com P maiúsculo
import CadastroEmpresa from '/src/Pages/empresa/CadastroEmpresa'; // 🔥 Padronizado absoluto
import CadastroEvento from '/src/Pages/empresa/cadastroEventos/CadastroEventos'; 

const Sobre = () => <div style={{ padding: '120px 10%', textAlign: 'center' }}><h2>Tela Sobre (Aguardando migração...)</h2></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* 1. GRUPO COM LAYOUT PADRÃO (Header e Footer globais) */}
        <Route element={<RootLayout />}>
          {/* 🌟 MUDANÇA: A rota raiz "/" agora está aqui dentro. O site inicia com Header, Footer e TelaUsuario juntos! */}
          <Route path="/" element={<TelaUsuario />} />
          
          {/* Mantido /inicio apontando para o mesmo lugar para não quebrar links internos existentes */}
          <Route path="/inicio" element={<TelaUsuario />} /> 
          <Route path="/arena" element={<Arena />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/eco" element={<EcoIA />} />
          <Route path="/echo" element={<EcoIA />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/cadastro-empresa" element={<CadastroEmpresa />} />
          <Route path="/cadastro-evento" element={<CadastroEvento />} />
        </Route>

        {/* 2. ROTAS TOTALMENTE ISOLADAS (Telas limpas de autenticação) */}
        {/* 🌟 MUDANÇA: A rota raiz duplicada que estava aqui foi removida para não dar conflito */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/perfil" element={<Perfil />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;