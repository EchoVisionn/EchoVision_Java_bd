import React, { useState, useEffect, useRef } from 'react';
import './galeria.css';
import { useNavigate } from 'react-router-dom'; // ◄ ADICIONADO: Para controle de navegação pós-compra

import imgScream from '../../assets/imagens/Scream.jpg';
import imgStarry from '../../assets/imagens/Starry_Night.jpg';
import imgIndependencia from '../../assets/imagens/Independência_ou_Morte.jpg';
import audioScream from '../../assets/audios/Scream.mpeg?url';
import audioStarry from '../../assets/audios/Starry.mpeg?url';
import audioIndependencia from '../../assets/audios/independencia.mpeg?url';

const artworks = [
  {
    id: 1,
    title: "O Grito",
    artist: "Edvard Munch",
    desc: "Uma expressão profunda de ansiedade e emoção humana.",
    badge: "ÁUDIO 3D",
    img: imgScream, 
    audioSrc: audioScream
  },
  {
    id: 2,
    title: "A Noite Estrelada",
    artist: "Vincent van Gogh",
    desc: "Uma representação vibrante e dinâmica da vista noturna.",
    badge: "IMERSIVO",
    img: imgStarry, 
    audioSrc: audioStarry
  },
  {
    id: 3,
    title: "Independência ou Morte",
    artist: "Pedro Américo",
    desc: "A icônica representação do momento histórico do Brasil.",
    badge: "EXPERIÊNCIA",
    img: imgIndependencia, 
    audioSrc: audioIndependencia
  }
];

export default function Galeria() {
  const [playingId, setPlayingId] = useState(null);
  const audioRef = useRef(null);
  const navigate = useNavigate(); // ◄ ADICIONADO: Inicializando o hook de navegação

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handlePlayPause = (artwork) => {
    if (playingId === artwork.id) {
      audioRef.current.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      audioRef.current = new Audio(artwork.audioSrc);
      audioRef.current.play().catch(err => console.log("Erro ao reproduzir áudio:", err));
      setPlayingId(artwork.id);

      audioRef.current.onended = () => {
        setPlayingId(null);
      };
    }
  };

  // 🔥 NOVA FUNÇÃO: Envia a requisição de compra de ingresso para o seu IngressoController no Java
  const handleComprarIngresso = async (artwork) => {
    // Busca o ID do usuário visitante armazenado no momento do login comum
    const idUsuarioLogado = parseInt(localStorage.getItem('id_user'));

    if (!idUsuarioLogado) {
      alert("Para garantir seu ingresso, por favor realize o login antes!");
      navigate('/'); // Redireciona para a tela de login/inicial se não achar o usuário
      return;
    }

    // Estrutura o payload JSON com os Enums correspondentes do seu backend
    const dadosCompra = {
      valorIng: 45.50, // Valor fictício mapeado para o BigDecimal do banco
      descIng: `Ingresso comprado via Galeria para a experiência: ${artwork.title}`,
      tipoIng: "INTEIRA", // Casando perfeitamente com seu Enum TipoIng
      digFis: "DIGITAL",   // Casando perfeitamente com seu Enum DigFis
      usuario: {
        id_user: idUsuarioLogado // Relacionamento Chave Estrangeira (User)
      },
      evento: {
        id_even: artwork.id // Vincula temporariamente ao ID do array fixo para testes de gravação
      }
    };

    try {
      const resposta = await fetch('http://localhost:8080/ingresso/comprar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosCompra)
      });

      if (resposta.ok) {
        const ingressoSalvo = await resposta.json();
        alert(`🎉 Ingresso Garantido com Sucesso!\nCódigo gerado no banco: ${ingressoSalvo.idIng}`);
      } else {
        alert("O servidor backend recusou o processamento do ingresso.");
      }
    } catch (error) {
      console.error("Erro ao conectar no endpoint de ingressos:", error);
      alert("Não foi possível estabelecer contato com o servidor Java.");
    }
  };

  return (
    <div className="galeria-container">
      <div className="wave-wrapper">
        <svg className="organic-waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path className="wave path-1" d="M0,160 C320,300,420,0,720,160 C1020,320,1120,0,1440,160 V320 H0 Z"></path>
          <path className="wave path-2" d="M0,160 C320,0,420,300,720,160 C1020,20,1120,320,1440,160 V320 H0 Z"></path>
          <path className="wave path-3" d="M0,160 C160,200,320,100,480,160 C640,220,800,100,960,160 C1120,220,1280,100,1440,160 V320 H0 Z"></path>
        </svg>
      </div>

      <main className="galeria-main">
        <header className="page-title-section">
          <h1>Galeria Imersiva</h1>
          <p>Selecione uma obra e deixe o som guiar sua percepção.</p>
        </header>

        <div className="galeria-grid">
          {artworks.map((artwork) => {
            const isCurrentPlaying = playingId === artwork.id;
            return (
              <div className="galeria-card" key={artwork.id}>
                <div className="card-image">
                  <img src={artwork.img} alt={artwork.title} />
                  <span className="badge">{artwork.badge}</span>
                </div>
                
                <div className="card-content">
                  <h3>{artwork.title}</h3>
                  <div className="artist">{artwork.artist}</div>
                  <p className="desc">{artwork.desc}</p>
                  
                  {/* Botão de Áudio (Mantido Original) */}
                  <button 
                    className={`btn ${isCurrentPlaying ? 'playing' : ''}`}
                    onClick={() => handlePlayPause(artwork)}
                  >
                    <span className={isCurrentPlaying ? "pause-icon" : "play-icon"}></span>
                    <span className="btn-text">
                      {isCurrentPlaying ? "Pausar Experiência" : "Ouvir Experiência"}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}