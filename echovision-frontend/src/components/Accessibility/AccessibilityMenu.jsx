import React, { useCallback, useEffect, useRef } from 'react';
import useAccessibility from '../../hooks/useAccessibility';
import FontControls from './FontControls';
import ColorAccessibility from './ColorAccessibility';
import SpeechControls from './SpeechControls';
import './accessibility.css';

function AccessibilityMenu() {
  const {
    isMenuOpen,
    setIsMenuOpen,
    menuTriggerRef,
  } = useAccessibility();

  const menuRef = useRef(null);
  const closeButtonRef = useRef(null);

  const handleClose = useCallback(() => {
    setIsMenuOpen(false);
  }, [setIsMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      if (menuTriggerRef.current) {
        menuTriggerRef.current.focus();
      }
      return;
    }

    const firstFocusable = () => {
      const focusableElements = menuRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      return focusableElements ? Array.from(focusableElements) : [];
    };

    const focusable = firstFocusable();
    if (focusable.length > 0) {
      focusable[0].focus();
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
      }

      if (event.key === 'Tab') {
        const focusableElements = firstFocusable();
        if (focusableElements.length === 0) {
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement;

        if (event.shiftKey && activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose, isMenuOpen, menuTriggerRef]);

  if (!isMenuOpen) {
    return null;
  }

  return (
    <div className="accessibility-backdrop" role="presentation" onClick={handleClose}>
      <aside
        id="accessibility-menu"
        className="accessibility-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-menu-title"
        aria-describedby="accessibility-menu-description"
        onClick={(event) => event.stopPropagation()}
        ref={menuRef}
      >
        <div className="accessibility-panel-header">
          <div>
            <h2 id="accessibility-menu-title">Menu de acessibilidade</h2>
            <p id="accessibility-menu-description">
              Ajuste fontes, modos de daltonismo e leitura por voz de forma rápida e acessível.
            </p>
          </div>
          <button
            type="button"
            className="accessibility-close-btn"
            onClick={handleClose}
            ref={closeButtonRef}
          >
            Fechar
          </button>
        </div>

        <div className="accessibility-panel-inner">
          <div className="accessibility-grid">
            <FontControls />
            <ColorAccessibility />
            <SpeechControls />
          </div>
        </div>
      </aside>
    </div>
  );
}

export default AccessibilityMenu;
