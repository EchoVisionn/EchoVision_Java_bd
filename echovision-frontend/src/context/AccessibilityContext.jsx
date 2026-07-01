import React, { createContext, useEffect, useMemo, useRef, useState } from 'react';

export const AccessibilityContext = createContext(null);

const FONT_STORAGE_KEY = 'echo_accessibility_font_scale';
const COLOR_STORAGE_KEY = 'echo_accessibility_color_mode';
const FONT_MIN = 0.875;
const FONT_MAX = 1.375;
const FONT_STEP = 0.1;

function clamp(value) {
  return Math.min(Math.max(value, FONT_MIN), FONT_MAX);
}

export function AccessibilityProvider({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [colorMode, setColorMode] = useState('normal');
  const [speechStatus, setSpeechStatus] = useState('Pronto para leitura');
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isFocusReaderOn, setIsFocusReaderOn] = useState(false);
  const menuTriggerRef = useRef(null);
  const utteranceRef = useRef(null);
  const focusSpeechRef = useRef(null);

  const getElementText = (element) => {
    if (!element) return '';

    const ariaLabel = element.getAttribute?.('aria-label');
    if (ariaLabel) return ariaLabel.trim();

    const ariaLabelledBy = element.getAttribute?.('aria-labelledby');
    if (ariaLabelledBy) {
      const labelEl = document.getElementById(ariaLabelledBy);
      if (labelEl?.innerText) {
        return labelEl.innerText.trim();
      }
    }

    return element.innerText?.trim() || '';
  };

  const isElementVisible = (element) => {
    if (!element || !(element instanceof HTMLElement)) {
      return false;
    }

    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0' || element.hasAttribute('hidden')) {
      return false;
    }

    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };

  const isInteractiveElement = (element) => {
    return element.matches(
      'a, button, input, select, textarea, option, summary, details, label, [contenteditable="true"], [contenteditable], [role="button"], [role="link"], [role="checkbox"], [role="radio"], [role="switch"], [role="combobox"], [role="textbox"]'
    );
  };

  const getFocusContentElements = () => {
    const main = document.querySelector('main') || document.body;
    if (!main) {
      return [];
    }

    const allCandidates = Array.from(
      main.querySelectorAll(
        'h1, h2, h3, h4, h5, h6, p, li, blockquote, figure, figcaption, dd, dt, section, article, nav, aside, header, footer, div[class], span[class]'
      )
    );

    const filtered = allCandidates.filter((element) => {
      if (element.closest('.accessibility-panel')) {
        return false;
      }
      if (isInteractiveElement(element)) {
        return false;
      }
      if (!isElementVisible(element)) {
        return false;
      }
      const text = getElementText(element);
      return text.length > 0;
    });

    return filtered.filter((element) =>
      !filtered.some((parent) => parent !== element && parent.contains(element))
    );
  };

  const isTextInput = (element) => {
    if (!element || !(element instanceof HTMLElement)) {
      return false;
    }
    const tag = element.tagName.toLowerCase();
    const editable = element.getAttribute('contenteditable');
    return (
      tag === 'input' ||
      tag === 'textarea' ||
      tag === 'select' ||
      editable === 'true' ||
      element.isContentEditable
    );
  };

  const focusableContentElementsRef = useRef([]);

  const makeContentFocusable = () => {
    const elements = getFocusContentElements();
    elements.forEach((element) => {
      if (element.closest('.accessibility-panel')) {
        return;
      }
      if (element.hasAttribute('tabindex')) {
        return;
      }
      element.setAttribute('tabindex', '0');
      element.dataset.a11yFocusable = 'true';
    });
    focusableContentElementsRef.current = elements;
  };

  const restoreContentFocusable = () => {
    const elements = document.querySelectorAll('[data-a11y-focusable="true"]');
    elements.forEach((element) => {
      element.removeAttribute('tabindex');
      element.removeAttribute('data-a11y-focusable');
    });
    focusableContentElementsRef.current = [];
  };

  const focusContentElement = (index) => {
    const elements = focusableContentElementsRef.current;
    if (!elements || elements.length === 0) {
      return;
    }

    const safeIndex = Math.max(0, Math.min(index, elements.length - 1));
    const element = elements[safeIndex];
    if (element) {
      element.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
      element.focus();
    }
  };

  useEffect(() => {
    if (!isFocusReaderOn) {
      return undefined;
    }

    const handleArrowNavigation = (event) => {
      if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) {
        return;
      }

      const elements = focusableContentElementsRef.current;
      if (!elements || elements.length === 0) {
        return;
      }

      const activeIndex = elements.indexOf(document.activeElement);
      let nextIndex = activeIndex;

      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        nextIndex = activeIndex >= 0 ? Math.min(activeIndex + 1, elements.length - 1) : 0;
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        nextIndex = activeIndex > 0 ? activeIndex - 1 : 0;
      }

      if (nextIndex !== activeIndex) {
        event.preventDefault();
        focusContentElement(nextIndex);
      }
    };

    document.addEventListener('keydown', handleArrowNavigation, true);
    return () => {
      document.removeEventListener('keydown', handleArrowNavigation, true);
    };
  }, [isFocusReaderOn]);

  useEffect(() => {
    const savedFont = parseFloat(localStorage.getItem(FONT_STORAGE_KEY));
    const savedColor = localStorage.getItem(COLOR_STORAGE_KEY);

    if (!Number.isNaN(savedFont)) {
      setFontScale(clamp(savedFont));
    }

    if (['normal', 'protanopia', 'deuteranopia', 'tritanopia', 'acromatopsia'].includes(savedColor)) {
      setColorMode(savedColor);
    }

    setSpeechSupported(
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof SpeechSynthesisUtterance !== 'undefined'
    );

    const handleFocus = (event) => {
      if (isFocusReaderOn) {
        const focusedElement = event.target;
        const text = getElementText(focusedElement);
        if (text) {
          if (window.speechSynthesis && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
          }
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'pt-BR';
          utterance.rate = 1;
          utterance.pitch = 1;
          window.speechSynthesis.speak(utterance);
          focusSpeechRef.current = utterance;
        }
      }
    };

    document.addEventListener('focusin', handleFocus);
    return () => {
      document.removeEventListener('focusin', handleFocus);
      restoreContentFocusable();
    };
  }, [isFocusReaderOn]);

  useEffect(() => {
    if (isFocusReaderOn) {
      makeContentFocusable();
      setTimeout(() => {
        const elements = focusableContentElementsRef.current;
        if (elements && elements.length > 0) {
          elements[0].focus();
        } else {
          const firstFocusable = document.querySelector('main, body');
          firstFocusable?.focus?.();
        }
      }, 0);
    } else {
      restoreContentFocusable();
    }

    return () => {
      restoreContentFocusable();
    };
  }, [isFocusReaderOn]);

  useEffect(() => {
    localStorage.setItem(FONT_STORAGE_KEY, fontScale.toString());
    document.documentElement.style.setProperty('--font-scale', fontScale.toString());
  }, [fontScale]);

  useEffect(() => {
    localStorage.setItem(COLOR_STORAGE_KEY, colorMode);
    const body = document.body;
    body.classList.remove(
      'daltonism-protanopia',
      'daltonism-deuteranopia',
      'daltonism-tritanopia',
      'daltonism-acromatopsia'
    );

    if (colorMode !== 'normal') {
      body.classList.add(`daltonism-${colorMode}`);
    }
  }, [colorMode]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
  }, [isMenuOpen]);

  const increaseFont = () => setFontScale(prev => clamp(prev + FONT_STEP));
  const decreaseFont = () => setFontScale(prev => clamp(prev - FONT_STEP));
  const resetFont = () => setFontScale(1);

  const getMainText = () => {
    const main = document.querySelector('main');
    return main ? main.innerText.trim() : document.body.innerText.trim();
  };

  const stopSpeech = () => {
    if (speechSupported && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
    }
    setSpeechStatus('Parado');
  };

  const startSpeech = () => {
    if (!speechSupported) {
      setSpeechStatus('Leitura por voz não suportada neste navegador.');
      return;
    }

    const text = getMainText();
    if (!text) {
      setSpeechStatus('Conteúdo principal não encontrado.');
      return;
    }

    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => setSpeechStatus('Leitura concluída.');
    utterance.onpause = () => setSpeechStatus('Leitura pausada.');
    utterance.onresume = () => setSpeechStatus('Leitura retomada.');
    utterance.onerror = () => setSpeechStatus('Erro ao ler a página.');

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setSpeechStatus('Lendo a página...');
  };

  const announceFocusText = (element) => {
    if (!speechSupported || !isFocusReaderOn) {
      return;
    }

    const text = element?.innerText?.trim();
    if (!text) {
      return;
    }

    const announcement = new SpeechSynthesisUtterance(text);
    announcement.lang = 'pt-BR';
    announcement.rate = 1;
    announcement.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(announcement);
  };

  const pauseSpeech = () => {
    if (!speechSupported || !window.speechSynthesis || !window.speechSynthesis.speaking) {
      return;
    }

    if (!window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setSpeechStatus('Leitura pausada.');
    }
  };

  const resumeSpeech = () => {
    if (!speechSupported || !window.speechSynthesis || !window.speechSynthesis.paused) {
      return;
    }

    window.speechSynthesis.resume();
    setSpeechStatus('Leitura retomada.');
  };

  const value = useMemo(
    () => ({
      isMenuOpen,
      setIsMenuOpen,
      menuTriggerRef,
      fontScale,
      increaseFont,
      decreaseFont,
      resetFont,
      colorMode,
      setColorMode,
      speechSupported,
      speechStatus,
      startSpeech,
      pauseSpeech,
      resumeSpeech,
      stopSpeech,
      isFocusReaderOn,
      setIsFocusReaderOn,
      announceFocusText,
    }),
    [
      isMenuOpen,
      fontScale,
      colorMode,
      speechSupported,
      speechStatus,
      isFocusReaderOn,
      increaseFont,
      decreaseFont,
      resetFont,
      setColorMode,
      setIsMenuOpen,
      setIsFocusReaderOn,
      startSpeech,
      pauseSpeech,
      resumeSpeech,
      stopSpeech,
      announceFocusText,
    ]
  );

  return (
    <>
      <svg
        aria-hidden="true"
        className="accessibility-filters"
        width="0"
        height="0"
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      >
        <defs>
          <filter id="protanopia-filter">
            <feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0" />
          </filter>
          <filter id="deuteranopia-filter">
            <feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0" />
          </filter>
          <filter id="tritanopia-filter">
            <feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0" />
          </filter>
        </defs>
      </svg>
      <AccessibilityContext.Provider value={value}>
        {children}
      </AccessibilityContext.Provider>
    </>
  );
}
