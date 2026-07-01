import React from 'react';
import useAccessibility from '../../hooks/useAccessibility';

function ColorAccessibility() {
  const { colorMode, setColorMode } = useAccessibility();

  return (
    <section className="accessibility-card" aria-labelledby="color-accessibility-title">
      <h3 id="color-accessibility-title">Modo de daltonismo</h3>
      <p>Selecione uma opção para melhorar a distinção das cores.</p>
      <div className="accessibility-actions">
        {['normal', 'protanopia', 'deuteranopia', 'tritanopia', 'acromatopsia'].map((mode) => (
          <button
            key={mode}
            type="button"
            className={colorMode === mode ? 'active' : ''}
            onClick={() => setColorMode(mode)}
            aria-pressed={colorMode === mode}
          >
            {mode === 'normal' ? 'Normal' : mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>
      <p className="accessibility-info">Modo atual: {colorMode === 'normal' ? 'Normal' : colorMode}</p>
    </section>
  );
}

export default ColorAccessibility;
