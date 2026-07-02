import React from 'react';
import useAccessibility from '../../hooks/useAccessibility';

function SpeechControls() {
  const {
    speechSupported,
    speechStatus,
    startSpeech,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    isFocusReaderOn,
    setIsFocusReaderOn,
    setIsMenuOpen,
    voiceNavigationSupported,
    isVoiceNavigationOn,
    voiceNavigationStatus,
    lastVoiceCommand,
    startVoiceNavigation,
    stopVoiceNavigation,
  } = useAccessibility();

  return (
    <section className="accessibility-card" aria-labelledby="speech-controls-title">
      <h3 id="speech-controls-title">Leitura por voz</h3>
      <p>
        Use leitura por voz para acompanhar o conteúdo principal da página.
      </p>
      {speechSupported ? (
        <>
          <div className="accessibility-actions-column">
            <button type="button" onClick={startSpeech}>Iniciar</button>
            <button type="button" onClick={pauseSpeech}>Pausar</button>
            <button type="button" onClick={resumeSpeech}>Continuar</button>
            <button type="button" onClick={stopSpeech}>Parar</button>
          </div>
          <div className="accessibility-actions-column">
            <button
              type="button"
              onClick={() => setIsFocusReaderOn((prev) => {
                const nextValue = !prev;
                if (nextValue) {
                  setIsMenuOpen(false);
                }
                return nextValue;
              })}
              aria-pressed={isFocusReaderOn}
            >
              {isFocusReaderOn ? 'Desativar leitura de foco' : 'Ativar leitura de foco'}
            </button>
          </div>
        </>
      ) : (
        <div className="accessibility-message" role="status" aria-live="polite">
          Leitura por voz não suportada neste navegador.
        </div>
      )}
      <p className="accessibility-info" aria-live="polite">Status: {speechStatus}</p>

      <div className="accessibility-voice-nav">
        <h4>Navegação por voz</h4>
        <p>
          Exemplos: ir para eventos, comprar ingresso do evento exposição, selecionar meia entrada, escolher 2 ingressos, confirmar compra, ouvir O Grito, pausar experiência, rolar para baixo e parar.
        </p>
        {voiceNavigationSupported ? (
          <>
            <div className="accessibility-actions-column">
              <button
                type="button"
                onClick={isVoiceNavigationOn ? stopVoiceNavigation : startVoiceNavigation}
                aria-pressed={isVoiceNavigationOn}
              >
                {isVoiceNavigationOn ? 'Desativar navegação por voz' : 'Ativar navegação por voz'}
              </button>
            </div>
            <p className="accessibility-info" aria-live="polite">
              Status: {voiceNavigationStatus}
            </p>
            {lastVoiceCommand && (
              <p className="accessibility-info">
                Último comando: {lastVoiceCommand}
              </p>
            )}
          </>
        ) : (
          <div className="accessibility-message" role="status">
            Navegação por voz não suportada neste navegador.
          </div>
        )}
      </div>
    </section>
  );
}

export default SpeechControls;
