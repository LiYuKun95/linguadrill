/**
 * Enhanced Speech Engine
 * Supports: speed adjustment, queue playback, replay, sentence playback
 * Includes fallback for browsers without SpeechSynthesis support
 */
const Speech = (function() {
  let synth = window.speechSynthesis;
  let voices = [];
  let currentRate = 1;
  let queue = [];
  let isPlaying = false;
  let currentUtterance = null;
  let lastSpokenText = '';
  let lastSpokenRate = 1;

  // Fallback: Create mock SpeechSynthesis if not available
  function init() {
    if (!synth) {
      console.warn('SpeechSynthesis not supported - using fallback');
      synth = createFallbackSynth();
    }

    loadVoices();
    
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }

    // Load voices after a short delay (some browsers load async)
    setTimeout(() => {
      loadVoices();
    }, 100);
  }

  function loadVoices() {
    if (synth && synth.getVoices) {
      voices = synth.getVoices();
    }
  }

  function getEnglishVoice() {
    if (!voices || voices.length === 0) {
      loadVoices();
    }

    const preferredVoices = [
      'Google US English',
      'Google English',
      'Microsoft Zira - English (United States)',
      'Samantha',
      'Alex',
      'Microsoft David - English (United States)',
      'Daniel',
      'Karen'
    ];
    
    for (const name of preferredVoices) {
      const voice = voices.find(v => v.name === name);
      if (voice) return voice;
    }
    
    // Fallback: any English voice
    const englishVoice = voices.find(v => v.lang && v.lang.startsWith('en'));
    return englishVoice || voices[0] || null;
  }

  /**
   * Create fallback synth for browsers without SpeechSynthesis
   */
  function createFallbackSynth() {
    return {
      speak: function(utterance) {
        console.log(`[Speech Fallback] Would speak: "${utterance.text}"`);
        utterance.onstart?.();
        setTimeout(() => {
          utterance.onend?.();
        }, utterance.text.length * 100);
      },
      cancel: function() {},
      pause: function() {},
      resume: function() {},
      getVoices: function() { return []; }
    };
  }

  /**
   * Speak text with current settings
   */
  function speak(text, rate = currentRate) {
    if (!synth) {
      console.warn('Speech synthesis not available');
      return Promise.resolve();
    }

    // Store for replay
    lastSpokenText = text;
    lastSpokenRate = rate;

    return new Promise((resolve) => {
      // Cancel any current speech
      stop();

      const utterance = createUtterance(text, rate);
      
      utterance.onend = () => {
        isPlaying = false;
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        isPlaying = false;
        resolve();
      };

      currentUtterance = utterance;
      isPlaying = true;
      synth.speak(utterance);
    });
  }

  /**
   * Create utterance with settings
   */
  function createUtterance(text, rate) {
    const utterance = new (synth.constructor || window.SpeechSynthesisUtterance)(text);
    utterance.lang = 'en-US';
    utterance.rate = Math.max(0.5, Math.min(rate, 2));
    utterance.pitch = 1;
    utterance.volume = 1;

    const voice = getEnglishVoice();
    if (voice) {
      utterance.voice = voice;
    }

    return utterance;
  }

  /**
   * Speak word (shorthand)
   */
  function speakWord(word, rate = currentRate) {
    return speak(word, rate);
  }

  /**
   * Speak sentence (shorthand)
   */
  function speakSentence(sentence, rate = currentRate) {
    return speak(sentence, rate);
  }

  /**
   * Play text multiple times with pause
   */
  async function speakRepeat(text, times = 3, pauseMs = 1000, rate = currentRate) {
    for (let i = 0; i < times; i++) {
      await speak(text, rate);
      if (i < times - 1) {
        await delay(pauseMs);
      }
    }
  }

  /**
   * Queue multiple items for sequential playback
   */
  async function playQueue(items, rate = currentRate) {
    queue = [...items];
    
    for (const item of queue) {
      if (!isPlaying) break;
      await speak(item, rate);
      await delay(500);
    }
    
    queue = [];
  }

  /**
   * Replay last spoken text
   */
  function replay() {
    if (lastSpokenText) {
      speak(lastSpokenText, lastSpokenRate);
    } else {
      console.warn('No text to replay');
    }
  }

  /**
   * Stop all speech
   */
  function stop() {
    if (synth) {
      synth.cancel();
      isPlaying = false;
      queue = [];
    }
  }

  /**
   * Pause speech
   */
  function pause() {
    if (synth && synth.pause) {
      synth.pause();
    }
  }

  /**
   * Resume speech
   */
  function resume() {
    if (synth && synth.resume) {
      synth.resume();
    }
  }

  /**
   * Set speech rate
   */
  function setRate(rate) {
    currentRate = Math.max(0.5, Math.min(rate, 2));
    Storage.setSpeechRate(currentRate);
  }

  /**
   * Get current rate
   */
  function getRate() {
    return currentRate;
  }

  /**
   * Check if speech is supported
   */
  function isSupported() {
    return typeof window !== 'undefined' && ('speechSynthesis' in window || !synth);
  }

  /**
   * Check if currently speaking
   */
  function isSpeaking() {
    return isPlaying;
  }

  /**
   * Get available voices
   */
  function getAvailableVoices() {
    loadVoices();
    return voices;
  }

  /**
   * Utility: delay promise
   */
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Show user-friendly message if speech not supported
   */
  function showNotSupportedMessage() {
    if (!isSupported()) {
      const container = document.querySelector('.main-content');
      if (container) {
        container.innerHTML = `
          <div class="speech-not-supported">
            <div class="not-supported-icon">🔇</div>
            <h2>语音功能不可用</h2>
            <p>您的浏览器不支持语音合成功能。</p>
            <p>请使用以下浏览器之一：</p>
            <ul>
              <li>Chrome (推荐)</li>
              <li>Edge</li>
              <li>Safari</li>
              <li>Firefox</li>
            </ul>
          </div>
        `;
      }
    }
  }

  // Initialize on load
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  return {
    speak,
    speakWord,
    speakSentence,
    speakRepeat,
    playQueue,
    replay,
    stop,
    pause,
    resume,
    setRate,
    getRate,
    isSupported,
    isSpeaking,
    getAvailableVoices,
    showNotSupportedMessage
  };
})();