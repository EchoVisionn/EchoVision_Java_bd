import React from 'react';
import useAccessibility from '../../hooks/useAccessibility';

function AccessibilityButton() {
  const { isMenuOpen, setIsMenuOpen, menuTriggerRef } = useAccessibility();

  return (
    <button
      type="button"
      ref={menuTriggerRef}
      className="icon-btn accessibility-access-button"
      onClick={() => setIsMenuOpen(true)}
      aria-label="Abrir menu de acessibilidade"
      aria-controls="accessibility-menu"
      aria-expanded={isMenuOpen}
    >
      <i className="fa-solid fa-universal-access" aria-hidden="true"></i>
    </button>
  );
}

export default AccessibilityButton;
