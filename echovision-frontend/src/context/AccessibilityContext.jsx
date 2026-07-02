import { createContext, useEffect, useMemo, useRef, useState } from 'react';

export const AccessibilityContext = createContext(null);

const FONT_STORAGE_KEY = 'echo_accessibility_font_scale';
const COLOR_STORAGE_KEY = 'echo_accessibility_color_mode';
const FONT_MIN = 0.875;
const FONT_MAX = 1.375;
const FONT_STEP = 0.1;
const INTERACTIVE_SELECTOR =
  'a[href], button, input, textarea, select, summary, details, [tabindex]:not([tabindex="-1"]), [role="button"], [role="link"], [role="menuitem"], [role="option"], [role="textbox"], [role="checkbox"], [role="radio"], [role="switch"], [role="combobox"]';
const READABLE_TEXT_SELECTOR =
  'h1, h2, h3, h4, h5, h6, p, li, blockquote, figcaption, dd, dt, label, span, strong';

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
  const [voiceNavigationSupported, setVoiceNavigationSupported] = useState(false);
  const [isVoiceNavigationOn, setIsVoiceNavigationOn] = useState(false);
  const [voiceNavigationStatus, setVoiceNavigationStatus] = useState('Navegação por voz desativada.');
  const [lastVoiceCommand, setLastVoiceCommand] = useState('');
  const menuTriggerRef = useRef(null);
  const utteranceRef = useRef(null);
  const focusSpeechRef = useRef(null);
  const recognitionRef = useRef(null);
  const voiceNavigationEnabledRef = useRef(false);

  const getElementText = (element) => {
    if (!element) return '';

    const ariaLabel = element.getAttribute?.('aria-label');
    if (ariaLabel) return ariaLabel.trim();

    const ariaLabelledBy = element.getAttribute?.('aria-labelledby');
    if (ariaLabelledBy) {
      const label = ariaLabelledBy
        .split(/\s+/)
        .map((id) => document.getElementById(id)?.innerText?.trim())
        .filter(Boolean)
        .join(' ');

      if (label) {
        return label;
      }
    }

    if (element instanceof HTMLSelectElement) {
      return element.selectedOptions?.[0]?.textContent?.trim() || element.value?.trim() || '';
    }

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      return element.value?.trim() || element.placeholder?.trim() || '';
    }

    const text = element.innerText || element.textContent || '';
    return text.replace(/\s+/g, ' ').trim();
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
    return element.matches(INTERACTIVE_SELECTOR);
  };

  const getTextContentElements = () => {
    const root = getReadingRoot();

    return Array.from(root.querySelectorAll(READABLE_TEXT_SELECTOR)).filter((element) => {
      if (element.closest('.accessibility-panel')) {
        return false;
      }
      if (isInteractiveElement(element) || element.closest(INTERACTIVE_SELECTOR)) {
        return false;
      }
      if (element.querySelector(INTERACTIVE_SELECTOR)) {
        return false;
      }
      if (!isElementVisible(element)) {
        return false;
      }
      const text = getElementText(element);
      return text.length > 0;
    });
  };

  const getFocusContentElements = () => {
    const root = getReadingRoot();
    const candidates = Array.from(
      root.querySelectorAll(`${INTERACTIVE_SELECTOR}, ${READABLE_TEXT_SELECTOR}`)
    );

    const elements = candidates.filter((element) => {
      if (element.closest('.accessibility-panel')) {
        return false;
      }

      if (!isElementVisible(element)) {
        return false;
      }

      if (isInteractiveElement(element)) {
        return getElementText(element).length > 0 || element.getAttribute('aria-label');
      }

      if (element.closest(INTERACTIVE_SELECTOR) || element.querySelector(INTERACTIVE_SELECTOR)) {
        return false;
      }

      return getElementText(element).length > 0;
    });

    return Array.from(new Set(elements));
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

  const getReadingRoot = () => {
    return document.querySelector('[role="dialog"]:not(.accessibility-panel)') || document.body;
  };

  const refreshFocusableContentElements = () => {
    getTextContentElements().forEach((element) => {
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
        element.dataset.a11yFocusable = 'true';
      }
    });
    focusableContentElementsRef.current = getFocusContentElements();
    return focusableContentElementsRef.current;
  };

  const makeContentFocusable = () => {
    const textElements = getTextContentElements();
    textElements.forEach((element) => {
      if (element.closest('.accessibility-panel')) {
        return;
      }
      if (element.hasAttribute('tabindex')) {
        return;
      }
      element.setAttribute('tabindex', '0');
      element.dataset.a11yFocusable = 'true';
    });
    refreshFocusableContentElements();
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

      if (isTextInput(document.activeElement)) {
        return;
      }

      const elements = refreshFocusableContentElements();
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
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

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
    setVoiceNavigationSupported(typeof SpeechRecognition !== 'undefined');

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
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setVoiceNavigationStatus('Navegação por voz ouvindo comandos.');
    };

    recognition.onresult = (event) => {
      const results = Array.from(event.results);
      const latestResult = results[results.length - 1];
      const transcript = latestResult?.[0]?.transcript || '';
      handleVoiceCommand(transcript);
    };

    recognition.onerror = (event) => {
      const message = event.error === 'not-allowed'
        ? 'Permissão do microfone negada.'
        : 'Não consegui ouvir o comando. Tente novamente.';
      setVoiceNavigationStatus(message);
    };

    recognition.onend = () => {
      if (voiceNavigationEnabledRef.current) {
        try {
          recognition.start();
        } catch {
          setVoiceNavigationStatus('Navegação por voz aguardando o microfone.');
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      voiceNavigationEnabledRef.current = false;
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (isFocusReaderOn) {
      makeContentFocusable();
      setTimeout(() => {
        const elements = focusableContentElementsRef.current;
        if (elements && elements.length > 0) {
          elements[0].focus();
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
    const dialog = document.querySelector('[role="dialog"]:not(.accessibility-panel)');
    if (dialog) {
      return dialog.innerText.trim();
    }

    const main = document.querySelector('main');
    return main ? main.innerText.trim() : document.body.innerText.trim();
  };

  const normalizeVoiceCommand = (value) => {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const hasAnyTerm = (text, terms) => {
    return terms.some((term) => text.includes(term));
  };

  const getCommandSearchText = (element) => {
    const context = element.closest(
      '.card-arena, .event-card, .card-live, .modal-content, .compra-list-card, .compra-card, .compra-summary, .galeria-card'
    );

    return normalizeVoiceCommand([
      getElementText(element),
      element.getAttribute?.('aria-label') || '',
      context?.innerText || '',
    ].join(' '));
  };

  const getCommandKeywords = (command) => {
    const stopWords = new Set([
      'a', 'o', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'de', 'da', 'do', 'das', 'dos',
      'para', 'pra', 'por', 'favor', 'quero', 'gostaria', 'pode', 'poderia', 'ir',
      'abrir', 'acessar', 'entrar', 'mostrar', 'ver', 'detalhe', 'detalhes', 'evento',
      'eventos', 'comprar', 'compra', 'ingresso', 'ingressos', 'pagina', 'tela',
      'botao', 'clique', 'clicar', 'selecionar', 'escolher', 'me', 'leve', 'leva',
      'ate', 'no', 'na', 'ao', 'aos', 'nas', 'nos', 'com', 'sobre',
    ]);

    return command
      .split(' ')
      .filter((word) => word.length > 2 && !stopWords.has(word));
  };

  const scoreCandidate = (candidateText, keywords) => {
    return keywords.reduce((score, keyword) => {
      return candidateText.includes(keyword) ? score + Math.max(1, keyword.length) : score;
    }, 0);
  };

  const numberWords = {
    um: 1,
    uma: 1,
    dois: 2,
    duas: 2,
    tres: 3,
    quatro: 4,
  };

  const getControlLabel = (control) => {
    const id = control.getAttribute('id');
    const explicitLabel = id ? document.querySelector(`label[for="${id}"]`) : null;
    return normalizeVoiceCommand([
      explicitLabel?.innerText || '',
      control.getAttribute('aria-label') || '',
      control.name || '',
      control.id || '',
      control.closest('.compra-summary, .accessibility-card')?.innerText || '',
    ].join(' '));
  };

  const setSelectValue = (select, value) => {
    const option = Array.from(select.options).find((item) => String(item.value) === String(value));
    if (!option) {
      return false;
    }

    const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value')?.set;
    if (valueSetter) {
      valueSetter.call(select, option.value);
    } else {
      select.value = option.value;
    }

    select.dispatchEvent(new Event('input', { bubbles: true }));
    select.dispatchEvent(new Event('change', { bubbles: true }));
    select.focus();
    return true;
  };

  const getQuantityFromCommand = (command) => {
    const digitMatch = command.match(/\b([1-4])\b/);
    if (digitMatch) {
      return Number(digitMatch[1]);
    }

    const word = Object.keys(numberWords).find((item) => command.includes(item));
    return word ? numberWords[word] : null;
  };

  const clickGalleryAudioByVoice = (command, action) => {
    const buttons = Array.from(document.querySelectorAll(`[data-voice-action="${action}"]`)).filter(isElementVisible);
    if (buttons.length === 0) {
      return false;
    }

    const keywords = getCommandKeywords(command);
    const rankedButtons = buttons
      .map((button) => {
        const title = normalizeVoiceCommand(button.dataset.voiceTitle || '');
        const searchText = getCommandSearchText(button);
        return {
          button,
          score: scoreCandidate(`${title} ${searchText}`, keywords),
        };
      })
      .sort((a, b) => b.score - a.score);

    const target = rankedButtons.find((item) => keywords.length === 0 || item.score > 0) || rankedButtons[0];
    if (!target) {
      return false;
    }

    target.button.focus();
    target.button.click();
    return true;
  };

  const chooseSelectOptionByVoice = (command) => {
    const selects = Array.from(getReadingRoot().querySelectorAll('select')).filter(isElementVisible);
    if (selects.length === 0) {
      return false;
    }

    const changes = [];
    const ticketType = ['premium', 'meia', 'inteira'].find((type) => command.includes(type));
    if (ticketType) {
      const typeSelect = selects.find((select) => {
        const label = getControlLabel(select);
        return label.includes('tipo') || label.includes('ingresso') || select.id === 'ticket-type';
      });

      if (typeSelect) {
        const option = Array.from(typeSelect.options).find((item) => (
          normalizeVoiceCommand(item.textContent || item.value).includes(ticketType)
        ));

        if (option && setSelectValue(typeSelect, option.value)) {
          changes.push(`tipo ${option.textContent}`);
        }
      }
    }

    const quantity = getQuantityFromCommand(command);
    if (quantity) {
      const quantitySelect = selects.find((select) => {
        const label = getControlLabel(select);
        return label.includes('quantidade') || label.includes('qty') || select.id === 'qty';
      });

      if (quantitySelect && setSelectValue(quantitySelect, quantity)) {
        changes.push(`quantidade ${quantity}`);
      }
    }

    if (changes.length > 0) {
      setVoiceNavigationStatus(`Selecionado: ${changes.join(' e ')}.`);
      return true;
    }

    return false;
  };

  const findCommandTarget = (terms) => {
    const candidates = getFocusContentElements().filter(isInteractiveElement);

    return candidates.find((element) => {
      const text = normalizeVoiceCommand(getElementText(element));
      return terms.some((term) => text.includes(term));
    });
  };

  const clickCommandTarget = (terms) => {
    const target = findCommandTarget(terms);
    if (!target) {
      return false;
    }

    target.focus();
    target.click();
    return true;
  };

  const clickBestCommandTarget = (command, actionTerms) => {
    const keywords = getCommandKeywords(command);
    const candidates = getFocusContentElements()
      .filter((element) => isInteractiveElement(element) && isElementVisible(element))
      .map((element) => {
        const elementText = normalizeVoiceCommand(getElementText(element));
        const searchText = getCommandSearchText(element);
        const actionMatch = hasAnyTerm(elementText, actionTerms);

        if (!actionMatch) {
          return null;
        }

        return {
          element,
          score: scoreCandidate(searchText, keywords),
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);

    const target = candidates.find((candidate) => keywords.length === 0 || candidate.score > 0) || candidates[0];
    if (!target) {
      return false;
    }

    target.element.focus();
    target.element.click();
    return true;
  };

  const navigateToPath = (path) => {
    const link = Array.from(document.querySelectorAll(`a[href="${path}"]`)).find(isElementVisible);
    if (link) {
      link.click();
      return;
    }

    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const moveFocusByVoice = (direction) => {
    const elements = refreshFocusableContentElements();
    if (!elements || elements.length === 0) {
      setVoiceNavigationStatus('Nenhum item navegável encontrado.');
      return;
    }

    const activeIndex = elements.indexOf(document.activeElement);
    const fallbackIndex = direction > 0 ? 0 : elements.length - 1;
    const nextIndex = activeIndex >= 0
      ? Math.max(0, Math.min(activeIndex + direction, elements.length - 1))
      : fallbackIndex;

    focusContentElement(nextIndex);
    setVoiceNavigationStatus(direction > 0 ? 'Próximo item.' : 'Item anterior.');
  };

  const handleVoiceCommand = (rawCommand) => {
    const command = normalizeVoiceCommand(rawCommand);
    if (!command) {
      return;
    }

    setLastVoiceCommand(rawCommand);

    if (command.includes('parar navegacao') || command === 'parar' || command.includes('desativar voz')) {
      stopVoiceNavigation();
      return;
    }

    if (command.includes('proximo') || command.includes('avancar')) {
      moveFocusByVoice(1);
      return;
    }

    if (command.includes('anterior') || command.includes('voltar item')) {
      moveFocusByVoice(-1);
      return;
    }

    if (command === 'voltar' || command.includes('pagina anterior')) {
      window.history.back();
      setVoiceNavigationStatus('Voltando para a página anterior.');
      return;
    }

    if (command.includes('rolar para baixo') || command.includes('descer pagina')) {
      window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' });
      setVoiceNavigationStatus('Rolando para baixo.');
      return;
    }

    if (command.includes('rolar para cima') || command.includes('subir pagina')) {
      window.scrollBy({ top: -window.innerHeight * 0.75, behavior: 'smooth' });
      setVoiceNavigationStatus('Rolando para cima.');
      return;
    }

    if (command.includes('fechar modal') || command.includes('fechar janela') || command === 'fechar') {
      if (clickCommandTarget(['fechar detalhes do evento', 'fechar'])) {
        setVoiceNavigationStatus('Fechando.');
        return;
      }
    }

    if (command.includes('ler pagina') || command.includes('ler conteudo') || command.includes('ler texto')) {
      startSpeech();
      return;
    }

    if (command.includes('pausar leitura')) {
      pauseSpeech();
      return;
    }

    if (command.includes('continuar leitura') || command.includes('retomar leitura')) {
      resumeSpeech();
      return;
    }

    if (command.includes('parar leitura')) {
      stopSpeech();
      return;
    }

    if (chooseSelectOptionByVoice(command)) {
      return;
    }

    const wantsDetails = (
      command.includes('detalhes') ||
      command.includes('detalhe') ||
      command.includes('ver destaque') ||
      command.includes('ver o evento') ||
      command.includes('abrir evento')
    );
    const wantsBuy = (
      command.includes('comprar') ||
      command.includes('ingresso') ||
      command.includes('compra')
    );
    const wantsAudioPlay = (
      command.includes('play') ||
      command.includes('tocar') ||
      command.includes('reproduzir') ||
      command.includes('ouvir') ||
      command.includes('iniciar audio') ||
      command.includes('iniciar experiencia')
    );
    const wantsAudioPause = (
      command.includes('pausar') ||
      command.includes('pausa') ||
      command.includes('parar audio') ||
      command.includes('parar experiencia')
    );

    if (wantsAudioPause) {
      if (clickGalleryAudioByVoice(command, 'pause-audio') || clickBestCommandTarget(command, ['pausar experiencia', 'pausar'])) {
        setVoiceNavigationStatus('Pausando experiência de áudio.');
        return;
      }
    }

    if (wantsAudioPlay) {
      if (clickGalleryAudioByVoice(command, 'play-audio') || clickBestCommandTarget(command, ['ouvir experiencia', 'ouvir'])) {
        setVoiceNavigationStatus('Iniciando experiência de áudio.');
        return;
      }
    }

    if (wantsDetails) {
      if (clickBestCommandTarget(command, ['ver detalhes', 'ver destaque', 'abrir detalhes', 'abrir'])) {
        setVoiceNavigationStatus('Abrindo detalhes do evento.');
        return;
      }
    }

    if (wantsBuy) {
      if (clickBestCommandTarget(command, ['comprar ingresso', 'comprar agora', 'confirmar compra', 'comprar'])) {
        setVoiceNavigationStatus('Compra selecionada.');
        return;
      }
    }

    if (command.includes('clicar') || command.includes('clique') || command.includes('selecionar') || command.includes('escolher') || command.includes('abrir')) {
      const activeElement = document.activeElement;
      if (activeElement && isInteractiveElement(activeElement) && isElementVisible(activeElement)) {
        activeElement.click();
        setVoiceNavigationStatus('Item selecionado.');
        return;
      }

      if (clickCommandTarget(['ver detalhes', 'comprar ingresso', 'confirmar compra', 'conversar', 'explorar'])) {
        setVoiceNavigationStatus('Item selecionado.');
        return;
      }
    }

    if (hasAnyTerm(command, ['inicio', 'home', 'pagina inicial', 'tela inicial'])) {
      navigateToPath('/inicio');
      setVoiceNavigationStatus('Abrindo início.');
      return;
    }

    if (hasAnyTerm(command, ['eventos', 'arena', 'lista de eventos', 'pagina de eventos', 'ir para eventos'])) {
      navigateToPath('/arena');
      setVoiceNavigationStatus('Abrindo eventos.');
      return;
    }

    if (hasAnyTerm(command, ['galeria', 'obras', 'arte'])) {
      navigateToPath('/galeria');
      setVoiceNavigationStatus('Abrindo galeria.');
      return;
    }

    if (hasAnyTerm(command, ['eco', 'eco ia', 'assistente'])) {
      navigateToPath('/eco');
      setVoiceNavigationStatus('Abrindo ECO IA.');
      return;
    }

    if (hasAnyTerm(command, ['perfil', 'minha conta', 'meu perfil'])) {
      navigateToPath('/perfil');
      setVoiceNavigationStatus('Abrindo perfil.');
      return;
    }

    if (hasAnyTerm(command, ['login', 'entrar', 'acessar conta'])) {
      navigateToPath('/login');
      setVoiceNavigationStatus('Abrindo login.');
      return;
    }

    if (command.includes('comprar')) {
      if (clickCommandTarget(['comprar ingresso', 'comprar agora', 'confirmar compra'])) {
        setVoiceNavigationStatus('Compra selecionada.');
        return;
      }
    }

    if (command.includes('detalhes')) {
      if (clickCommandTarget(['ver detalhes', 'ver destaque', 'abrir detalhes'])) {
        setVoiceNavigationStatus('Abrindo detalhes.');
        return;
      }
    }

    setVoiceNavigationStatus(`Comando não reconhecido: ${rawCommand}`);
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

  const startVoiceNavigation = () => {
    if (!voiceNavigationSupported || !recognitionRef.current) {
      setVoiceNavigationStatus('Navegação por voz não suportada neste navegador.');
      return;
    }

    voiceNavigationEnabledRef.current = true;
    setIsVoiceNavigationOn(true);
    setIsMenuOpen(false);
    setVoiceNavigationStatus('Ativando microfone...');

    try {
      recognitionRef.current.start();
    } catch {
      setVoiceNavigationStatus('Navegação por voz já está ouvindo.');
    }
  };

  const stopVoiceNavigation = () => {
    voiceNavigationEnabledRef.current = false;
    setIsVoiceNavigationOn(false);
    setVoiceNavigationStatus('Navegação por voz desativada.');

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
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
      voiceNavigationSupported,
      isVoiceNavigationOn,
      voiceNavigationStatus,
      lastVoiceCommand,
      startVoiceNavigation,
      stopVoiceNavigation,
    }),
    [
      isMenuOpen,
      fontScale,
      colorMode,
      speechSupported,
      speechStatus,
      isFocusReaderOn,
      voiceNavigationSupported,
      isVoiceNavigationOn,
      voiceNavigationStatus,
      lastVoiceCommand,
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
      startVoiceNavigation,
      stopVoiceNavigation,
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
