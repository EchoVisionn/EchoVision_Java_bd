// --- VALORES INICIAIS E SUGESTÕES ---
export const INITIAL_MESSAGE = {
  role: "assistant",
  content: "Olá! Eu sou a Echo, a mascote oficial da EchoVision. Como posso te ajudar hoje?"
};

export const SUGGESTIONS = [
  "Como funciona o projeto?",
  "Como confirmo minha presença?",
  "Posso comprar lanches pelo app?"
];

// --- ATUALIZAÇÃO DA SAÍDA DE VOZ COM FILTRO DE ASTERISCOS ---
export function falarTexto(texto, onStateChange) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Cancela falas anteriores

    // 🌟 FILTRO MÁGICO: Remove todos os asteriscos (*) do texto para a voz não ler eles
    const textoLimpo = texto.replace(/\*/g, '');

    const speech = new SpeechSynthesisUtterance(textoLimpo); // Passa o texto limpo para o motor de voz
    speech.lang = 'pt-BR';
    speech.rate = 1.15; // Velocidade natural

    // Dispara 'talking' assim que a voz de fato começar a sair
    speech.onstart = () => {
      if (onStateChange) onStateChange("talking");
    };

    // Dispara 'idle' assim que a leitura do texto terminar por completo
    speech.onend = () => {
      if (onStateChange) onStateChange("idle");
    };

    // Se houver algum erro na geração da voz, volta a mascote para parada
    speech.onerror = () => {
      if (onStateChange) onStateChange("idle");
    };

    window.speechSynthesis.speak(speech);
  }
}

// --- 2. CONFIGURAÇÃO DO RECONHECIMENTO DE VOZ (Microfone) ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
export const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.lang = 'pt-BR';
  recognition.interimResults = false;
}

// --- 3. FUNÇÃO DE CONEXÃO HTTP POST COM O PYTHON (Porta 5000) ---
export const sendToEco = async (messageText) => {
  try {
    const response = await fetch('http://127.0.0.1:5000/ask', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question: messageText })
    });

    if (!response.ok) {
      throw new Error('Erro na resposta do servidor Python');
    }

    const data = await response.json();
    return data.answer; // Retorna a resposta que veio do Gemini

  } catch (error) {
    console.error("Erro de conexão com o Back-End Python:", error);
    throw error;
  }
};

export function pausarFala(onStateChange) {
  if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
    if (onStateChange) onStateChange("idle"); // Pausou? O avatar para de mexer a boca
  }
}

export function retomarFala(onStateChange) {
  if ('speechSynthesis' in window && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
    if (onStateChange) onStateChange("talking"); // Retomou? O avatar volta a falar
  }
}

export function pararFala(onStateChange) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    if (onStateChange) onStateChange("idle"); // Parou tudo? Avatar estático
  }
}