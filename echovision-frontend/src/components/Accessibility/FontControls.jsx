import React from 'react';
import useAccessibility from '../../hooks/useAccessibility';

function FontControls() {
  const { fontScale, increaseFont, decreaseFont, resetFont } = useAccessibility();

  return (
    <section className="accessibility-card" aria-labelledby="font-controls-title">
      <h3 id="font-controls-title">Tamanho da fonte</h3>
      <p>Altere a fonte global sem quebrar o layout.</p>
      <div className="accessibility-actions">
        <button type="button" onClick={decreaseFont} aria-label="Diminuir tamanho da fonte">
          Diminuir
        </button>
        <button type="button" onClick={resetFont} aria-label="Restaurar tamanho padrão da fonte">
          Restaurar
        </button>
        <button type="button" onClick={increaseFont} aria-label="Aumentar tamanho da fonte">
          Aumentar
        </button>
      </div>
      <p className="accessibility-info">Tamanho atual: {Math.round(fontScale * 100)}%</p>
    </section>
  );
}

export default FontControls;
