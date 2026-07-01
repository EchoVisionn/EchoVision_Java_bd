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
              onClick={() => setIsFocusReaderOn((prev) => !prev)}
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
    </section>
  );
}

export default SpeechControls;
