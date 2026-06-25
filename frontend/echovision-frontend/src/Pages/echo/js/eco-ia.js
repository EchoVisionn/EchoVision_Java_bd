// ─── CONSTANTS ───────────────────────────────────────────────────────────────

export const SUGGESTIONS = [
  "Descreva o estádio",
  "Próximos eventos",
  "Como funciona?",
];

export const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Olá! Sou a ECO, sua assistente de audiodescrição. Posso te guiar pelo site, descrever eventos e narrar partidas em tempo real. Como posso ajudar?",
};

const SYSTEM_PROMPT = `Você é a ECO, assistente de audiodescrição da EchoVision. Você ajuda usuários — incluindo pessoas com deficiência visual — a navegar pelo site, entender eventos esportivos, e receber narração e audiodescrição em tempo real. Seja descritiva, acolhedora e objetiva. Responda sempre em português brasileiro. Nunca use markdown, só texto simples.`;

// ─── API ──────────────────────────────────────────────────────────────────────

/**
 * Sends the conversation history to the Claude API and returns the reply text.
 * @param {Array<{role: string, content: string}>} messages
 * @returns {Promise<string>}
 */
export async function sendToEco(messages) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });

  if (!res.ok) {
    throw new Error(`Erro na API: ${res.status}`);
  }

  const data = await res.json();
  return data?.content?.[0]?.text ?? "Desculpe, não consegui processar sua mensagem.";
}
