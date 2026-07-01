import { useState, useRef, useEffect } from "react";
import "./eco.css";
import { 
  SUGGESTIONS, 
  INITIAL_MESSAGE, 
  sendToEco, 
  falarTexto, 
  recognition,
  pausarFala,   
  retomarFala, 
  pararFala 
} from "./js/eco-ia.js";

export default function EcoIA() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [ecoState, setEcoState] = useState("idle"); 
  const [isListening, setIsListening] = useState(false);
  const chatBodyRef = useRef(null);

  // Controla o modo escuro (Dark Mode)
  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
  }, [isDark]);

  // Auto-scroll para o final do chat a cada nova mensagem ou carregamento
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // --- FUNÇÃO DE ENVIO DE MENSAGENS ---
  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    // Adiciona a mensagem do usuário na tela
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // 1. Envia a pergunta para o servidor Flask Python (porta 5000)
      const reply = await sendToEco(userText);
      
      // 2. Insere a resposta da ECO nos balões de chat
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      
      // 3. Ativa o sintetizador de voz para verbalizar a resposta da IA
      setEcoState("talking");
      falarTexto(reply, setEcoState);

    } catch (error) {
      const msgErro = "Ops! Tive um problema para me conectar ao meu cérebro Python. O servidor está ligado?";
      setMessages((prev) => [...prev, { role: "assistant", content: msgErro }]);
      falarTexto(msgErro, setEcoState);
    } finally {
      setLoading(false);
    }
  };

  // --- FUNÇÃO DO MICROFONE (Speech Recognition) ---
  const ativarMicrofone = () => {
    if (!recognition) {
      alert("O reconhecimento de voz não é suportado ou permitido neste navegador. Tente usar o Google Chrome.");
      return;
    }

    if (loading) return;

    try {
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const textCapturado = event.results[0][0].transcript;
        sendMessage(textCapturado); // Envia automaticamente o que foi falado
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Erro no microfone:", event.error);
        setIsListening(false);
      };

    } catch (err) {
      console.error("Instância do microfone já estava ativa:", err);
      setIsListening(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div>
      {/* Wave Background */}
      <div className="wave-wrapper">
        <svg
          className="organic-waves"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            className="wave path-1"
            d="M0,160 C320,300,420,0,720,160 C1020,320,1120,0,1440,160 V320 H0 Z"
          />
          <path
            className="wave path-2"
            d="M0,160 C320,0,420,300,720,160 C1020,20,1120,320,1440,160 V320 H0 Z"
          />
          <path
            className="wave path-3"
            d="M0,160 C160,200,320,100,480,160 C640,220,800,100,960,160 C1120,220,1280,100,1440,160 V320 H0 Z"
          />
        </svg>
      </div>

      {/* Main Container */}
      <main className="home-container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-badge">IA GENERATIVA DE VOZ</div>
          <h1 className="hero-title">
            Conheça a <span className="viva">ECO</span>
          </h1>
          <p className="hero-text">
            Sua companheira de áudio. Pergunte, peça descrições e navegue pelo
            site de forma totalmente acessível.
          </p>
        </section>

        {/* Chat Section */}
        <section className="chat-section">
          <div className="chat-window">

            {/* Chat Header */}
            <div className="chat-header">
              <div className="user-info">
                <div className="avatar">🔊</div>
                {/* Espaço do Avatar Dinâmico da ECO */}
                <div className="eco-avatar-container">
                  {ecoState === "talking" ? (
                    <video 
                      src="/eco_vid.mp4" 
                      autoPlay 
                      loop 
                      muted 
                      className="eco-avatar-media"
                    />
                  ) : (
                    <img 
                      src="/eco_img.jpeg" 
                      alt="Mascote Echo Parada" 
                      className="eco-avatar-media"
                    />
                  )}
                </div>
                <div className="status">
                  <strong>ECO</strong>
                  <span>{isListening ? "Ouvindo você..." : "Online · Narrando agora"}</span>
                </div>
              </div>
              <div className={`audio-wave ${isListening ? "active" : ""}`}>
                <span /><span /><span /><span />
              </div>
            </div>

            {/* Painel de Controle de Acessibilidade de Áudio */}
            <div className="audio-controls-panel">
              <button onClick={() => pausarFala(setEcoState)} className="audio-control-btn btn-pause">⏸️ Pausar</button>
              <button onClick={() => retomarFala(setEcoState)} className="audio-control-btn btn-resume">▶️ Continuar</button>
              <button onClick={() => pararFala(setEcoState)} className="audio-control-btn btn-stop">⏹️ Parar</button>
            </div>

            {/* Chat Body */}
            <div className="chat-body" ref={chatBodyRef}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`message ${
                    msg.role === "assistant" ? "bot-message" : "user-message"
                  }`}
                >
                  {msg.content}
                </div>
              ))}

              {loading && (
                <div className="typing-indicator">
                  <span /><span /><span />
                </div>
              )}
            </div>

            {/* Chat Footer */}
            <div className="chat-footer">
              {/* Chips / Sugestões Rápidas */}
              <div className="suggestions">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    disabled={loading || isListening}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="input-area">
                <button 
                  className={`mic-btn ${isListening ? "recording" : ""}`} 
                  onClick={ativarMicrofone}
                  disabled={loading}
                  title="Ativar reconhecimento de voz"
                  style={{ backgroundColor: isListening ? "#ef4444" : "transparent" }}
                >
                  🎙️
                </button>
                <input
                  type="text"
                  placeholder={isListening ? "Ouvindo..." : "Pergunte qualquer coisa à ECO..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  disabled={loading || isListening}
                />
                <button
                  className="send-btn"
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim() || isListening}
                  aria-label="Enviar mensagem"
                >
                  {input.trim().length > 0 ? "➤" : "👋"}
                </button>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}