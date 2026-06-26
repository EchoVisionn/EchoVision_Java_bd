import { useState, useRef, useEffect } from "react";
import "./eco.css";
import { SUGGESTIONS, INITIAL_MESSAGE, sendToEco } from "./js/eco-ia.js";

export default function EcoIA() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const chatBodyRef = useRef(null);

  // Apply dark class to body for CSS variable switching
  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
  }, [isDark]);

  // Auto-scroll chat to bottom on new messages
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendToEco(newMessages);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erro ao conectar. Tente novamente." },
      ]);
    } finally {
      setLoading(false);
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

      {/* Main */}
      <main className="home-container">
        {/* Hero */}
        <section className="hero">
          <div className="hero-badge">IA GENERATIVA DE VOZ</div>
          <h1 className="hero-title">
            Conheça a <span className="viva">ECO</span>
          </h1>
          <p className="hero-text">
            Sua companheira de áudio. Pergunte, peça descrições e navegue pelo
            site só com a voz.
          </p>
        </section>

        {/* Chat */}
        <section className="chat-section">
          <div className="chat-window">

            {/* Chat Header */}
            <div className="chat-header">
              <div className="user-info">
                <div className="avatar">🔊</div>
                <div className="status">
                  <strong>ECO</strong>
                  <span>Online · Narrando agora</span>
                </div>
              </div>
              <div className="audio-wave">
                <span /><span /><span /><span />
              </div>
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
              <div className="suggestions">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    disabled={loading}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="input-area">
                <span className="mic-icon">🎙️</span>
                <input
                  type="text"
                  placeholder="Pergunte qualquer coisa à ECO..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  disabled={loading}
                />
                <button
                  className="send-btn"
                  onClick={() => sendMessage()}
                  disabled={loading}
                  aria-label="Enviar mensagem"
                >
                  ➤
                </button>
              </div>
            </div>

          </div>
        </section>
      </main>

    </div>
  );
}
