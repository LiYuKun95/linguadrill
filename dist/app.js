/* LinguaDrill Combined JavaScript */

/* === src/utils/i18n.js === */
/**
 * Internationalization (i18n) Foundation
 * Simple, scalable translation system supporting zh and en
 */
const I18n = (function() {
  let currentLang = 'zh';
  
  const translations = {
    zh: {
      // Navigation
      'nav.home': '首页',
      'nav.words': '词汇',
      'nav.patterns': '句型',
      'nav.shadowing': '跟读',
      'nav.progress': '进度',
      
      // Home Page
      'home.title': 'LinguaDrill',
      'home.subtitle': '高效英语学习引擎',
      'home.description': '基于高频词汇、句型操练和跟读训练的沉浸式学习体验',
      'home.startBtn': '开始第一天学习',
      'home.philosophy.title': '学习理念',
      'home.philosophy.listening': '听说优先',
      'home.philosophy.pattern': '句型操练',
      'home.philosophy.shadowing': '跟读训练',
      'home.philosophy.gradual': '循序渐进',
      
      // Words Page
      'words.title': '高频词汇',
      'words.speed': '语速',
      'words.repeat': '重复3次',
      'words.learned': '已学会',
      'words.markLearned': '标记为已学',
      'words.phonetic': '音标',
      'words.example': '例句',
      
      // Patterns Page
      'patterns.title': '句型操练',
      'patterns.generate': '生成新句子',
      'patterns.play': '播放句子',
      'patterns.autoPlay': '自动播放',
      'patterns.template': '模板',
      
      // Shadowing Page
      'shadowing.title': '影子跟读',
      'shadowing.play': '听一遍',
      'shadowing.slow': '慢速播放',
      'shadowing.next': '下一个',
      'shadowing.prev': '上一个',
      'shadowing.yourTurn': '轮到你了！',
      'shadowing.complete': '完成',
      
      // Progress Page
      'progress.title': '学习进度',
      'progress.words': '已学词汇',
      'progress.patterns': '句型练习',
      'progress.shadowing': '跟读完成',
      'progress.streak': '连续天数',
      'progress.history': '学习历史',
      'progress.achievements': '成就',
      
      // Common
      'common.loading': '加载中...',
      'common.error': '出错了，请重试',
      'common.retry': '重试',
      'common.cancel': '取消',
      'common.confirm': '确认',
      'common.close': '关闭',
      'common.day': '天'
    },
    en: {
      // Navigation
      'nav.home': 'Home',
      'nav.words': 'Words',
      'nav.patterns': 'Patterns',
      'nav.shadowing': 'Shadowing',
      'nav.progress': 'Progress',
      
      // Home Page
      'home.title': 'LinguaDrill',
      'home.subtitle': 'English Learning Engine',
      'home.description': 'Immersive learning with high-frequency words, pattern drills, and shadowing practice',
      'home.startBtn': 'Start Day 1',
      'home.philosophy.title': 'Learning Philosophy',
      'home.philosophy.listening': 'Listening First',
      'home.philosophy.pattern': 'Pattern Drill',
      'home.philosophy.shadowing': 'Shadowing',
      'home.philosophy.gradual': 'Step by Step',
      
      // Words Page
      'words.title': 'Vocabulary',
      'words.speed': 'Speed',
      'words.repeat': 'Repeat 3x',
      'words.learned': 'Learned',
      'words.markLearned': 'Mark as Learned',
      'words.phonetic': 'Phonetic',
      'words.example': 'Example',
      
      // Patterns Page
      'patterns.title': 'Pattern Drill',
      'patterns.generate': 'New Sentence',
      'patterns.play': 'Play',
      'patterns.autoPlay': 'Auto Play',
      'patterns.template': 'Template',
      
      // Shadowing Page
      'shadowing.title': 'Shadowing',
      'shadowing.play': 'Play',
      'shadowing.slow': 'Slow',
      'shadowing.next': 'Next',
      'shadowing.prev': 'Previous',
      'shadowing.yourTurn': 'Your Turn!',
      'shadowing.complete': 'Complete',
      
      // Progress Page
      'progress.title': 'Progress',
      'progress.words': 'Words Learned',
      'progress.patterns': 'Patterns',
      'progress.shadowing': 'Shadowing',
      'progress.streak': 'Day Streak',
      'progress.history': 'History',
      'progress.achievements': 'Achievements',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error, please retry',
      'common.retry': 'Retry',
      'common.cancel': 'Cancel',
      'common.confirm': 'Confirm',
      'common.close': 'Close',
      'common.day': 'Day'
    }
  };

  /**
   * Get translation for a key
   */
  function t(key, lang = currentLang) {
    const translation = translations[lang]?.[key];
    if (translation) {
      return translation;
    }
    // Fallback to zh if key not found
    return translations['zh']?.[key] || key;
  }

  /**
   * Set current language
   */
  function setLanguage(lang) {
    if (translations[lang]) {
      currentLang = lang;
      localStorage.setItem('linguadrill_lang', lang);
      
      // Dispatch language change event
      window.dispatchEvent(new CustomEvent('languageChange', { 
        detail: { language: lang } 
      }));
      
      return true;
    }
    return false;
  }

  /**
   * Get current language
   */
  function getLanguage() {
    return currentLang;
  }

  /**
   * Initialize language from localStorage or browser
   */
  function init() {
    const saved = localStorage.getItem('linguadrill_lang');
    if (saved && translations[saved]) {
      currentLang = saved;
    } else {
      // Detect browser language
      const browserLang = navigator.language || navigator.userLanguage;
      if (browserLang && browserLang.startsWith('en')) {
        currentLang = 'en';
      }
    }
  }

  /**
   * Get available languages
   */
  function getAvailableLanguages() {
    return Object.keys(translations).map(code => ({
      code,
      name: code === 'zh' ? '中文' : 'English'
    }));
  }

  /**
   * Translate entire element and its children
   */
  function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (key) {
        const translation = t(key);
        if (element.hasAttribute('placeholder')) {
          element.placeholder = translation;
        } else if (element.hasAttribute('title')) {
          element.title = translation;
        } else {
          element.textContent = translation;
        }
      }
    });
  }

  // Initialize on load
  init();

  return {
    t,
    setLanguage,
    getLanguage,
    getAvailableLanguages,
    translatePage
  };
})();

/* === src/utils/storage.js === */
const Storage = (function() {
  const STORAGE_KEYS = {
    PROGRESS: 'linguadrill_progress',
    HISTORY: 'linguadrill_history',
    STREAK: 'linguadrill_streak',
    SETTINGS: 'linguadrill_settings'
  };

  function getDefaultProgress() {
    return {
      wordsLearned: 0,
      patternsPracticed: 0,
      shadowingCompleted: 0,
      totalWords: 0,
      totalPatterns: 0,
      totalShadowing: 0,
      completedDays: [],
      currentStreak: 0
    };
  }

  function getDefaultSettings() {
    return {
      language: 'zh',
      speechRate: 1,
      darkMode: false
    };
  }

  return {
    getProgress: function() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
        return data ? JSON.parse(data) : getDefaultProgress();
      } catch {
        return getDefaultProgress();
      }
    },

    saveProgress: function(progress) {
      try {
        localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
      } catch (e) {
        console.error('Failed to save progress:', e);
      }
    },

    incrementWordsLearned: function(count = 1) {
      const progress = this.getProgress();
      progress.wordsLearned += count;
      this.saveProgress(progress);
      this.updateHistory('words', count);
    },

    incrementPatternsPracticed: function(count = 1) {
      const progress = this.getProgress();
      progress.patternsPracticed += count;
      this.saveProgress(progress);
      this.updateHistory('patterns', count);
    },

    incrementShadowingCompleted: function(count = 1) {
      const progress = this.getProgress();
      progress.shadowingCompleted += count;
      this.saveProgress(progress);
      this.updateHistory('shadowing', count);
    },

    setTotalCounts: function(words, patterns, shadowing) {
      const progress = this.getProgress();
      progress.totalWords = words;
      progress.totalPatterns = patterns;
      progress.totalShadowing = shadowing;
      this.saveProgress(progress);
    },

    getHistory: function() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
        return data ? JSON.parse(data) : [];
      } catch {
        return [];
      }
    },

    updateHistory: function(type, count) {
      const history = this.getHistory();
      const today = new Date().toISOString().split('T')[0];
      const todayEntry = history.find(h => h.date === today);

      if (todayEntry) {
        todayEntry[type] = (todayEntry[type] || 0) + count;
        todayEntry.total = (todayEntry.total || 0) + count;
      } else {
        history.push({
          date: today,
          words: type === 'words' ? count : 0,
          patterns: type === 'patterns' ? count : 0,
          shadowing: type === 'shadowing' ? count : 0,
          total: count
        });
      }

      try {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(-30)));
      } catch (e) {
        console.error('Failed to save history:', e);
      }

      this.updateStreak();
    },

    getStreak: function() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.STREAK);
        return data ? JSON.parse(data) : { current: 0, lastDate: null };
      } catch {
        return { current: 0, lastDate: null };
      }
    },

    updateStreak: function() {
      const streak = this.getStreak();
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      if (streak.lastDate === todayStr) {
        return;
      }

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (streak.lastDate === yesterdayStr) {
        streak.current += 1;
      } else if (streak.lastDate !== todayStr) {
        streak.current = 1;
      }

      streak.lastDate = todayStr;

      try {
        localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
      } catch (e) {
        console.error('Failed to save streak:', e);
      }
    },

    getSettings: function() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return data ? JSON.parse(data) : getDefaultSettings();
      } catch {
        return getDefaultSettings();
      }
    },

    saveSettings: function(settings) {
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      } catch (e) {
        console.error('Failed to save settings:', e);
      }
    },

    setSpeechRate: function(rate) {
      const settings = this.getSettings();
      settings.speechRate = rate;
      this.saveSettings(settings);
    },

    getSpeechRate: function() {
      return this.getSettings().speechRate;
    },

    clearAll: function() {
      try {
        localStorage.removeItem(STORAGE_KEYS.PROGRESS);
        localStorage.removeItem(STORAGE_KEYS.HISTORY);
        localStorage.removeItem(STORAGE_KEYS.STREAK);
        localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      } catch (e) {
        console.error('Failed to clear storage:', e);
      }
    }
  };
})();

/* === src/utils/speech.js === */
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

/* === src/utils/dayLoader.js === */
/**
 * Day Loader - Dynamic content loader for learning data
 * Supports loading week1.json (full week) and individual days
 */
const DayLoader = (function() {
  let currentWeek = null;
  let currentDay = 1;
  let currentData = null;
  let loadingError = null;

  async function loadWeek1() {
    loadingError = null;
    try {
      const response = await fetch('src/data/week1.json');
      if (!response.ok) {
        throw new Error(`Week 1 data not found (HTTP ${response.status})`);
      }
      currentWeek = await response.json();
      return currentWeek;
    } catch (error) {
      console.error('Failed to load week 1:', error);
      loadingError = error.message;
      currentWeek = null;
      return null;
    }
  }

  async function loadDay(dayNumber) {
    loadingError = null;
    if (!currentWeek) {
      await loadWeek1();
    }
    
    if (currentWeek && currentWeek.days) {
      const dayData = currentWeek.days.find(d => d.day === dayNumber);
      if (dayData) {
        currentData = dayData;
        currentDay = dayNumber;
        return dayData;
      }
    }
    
    try {
      const response = await fetch(`src/data/day${dayNumber}.json`);
      if (!response.ok) {
        throw new Error(`Day ${dayNumber} data not found (HTTP ${response.status})`);
      }
      currentData = await response.json();
      currentDay = dayNumber;
      return currentData;
    } catch (error) {
      console.error(`Failed to load day ${dayNumber}:`, error);
      loadingError = error.message;
      currentData = null;
      return null;
    }
  }

  function getCurrentDay() {
    return currentDay;
  }

  function getCurrentData() {
    return currentData;
  }

  function getWeekData() {
    return currentWeek;
  }

  function getWords() {
    return currentData ? currentData.words : [];
  }

  function getPatterns() {
    return currentData ? currentData.patterns : [];
  }

  function getShadowing() {
    return currentData ? currentData.shadowing : [];
  }

  function getDayInfo() {
    if (currentData) {
      return {
        day: currentData.day,
        title: currentData.title || currentData.titleCn,
        titleCn: currentData.titleCn,
        titleEn: currentData.titleEn || currentData.title,
        focus: currentData.focus,
        focusCn: currentData.focusCn
      };
    }
    return null;
  }

  function getAvailableDays() {
    if (currentWeek && currentWeek.days) {
      return currentWeek.days.map(d => ({
        day: d.day,
        title: d.title,
        titleCn: d.titleCn
      }));
    }
    return [];
  }

  async function loadNextDay() {
    const nextDay = currentDay + 1;
    const data = await loadDay(nextDay);
    if (data) {
      return data;
    }
    return null;
  }

  async function loadPreviousDay() {
    if (currentDay > 1) {
      const prevDay = currentDay - 1;
      return await loadDay(prevDay);
    }
    return null;
  }

  function isDayUnlocked(dayNumber) {
    if (dayNumber <= 1) return true;
    const progress = Storage.getProgress();
    return progress.completedDays && progress.completedDays.includes(dayNumber - 1);
  }

  function markDayCompleted(dayNumber) {
    const progress = Storage.getProgress();
    if (!progress.completedDays) {
      progress.completedDays = [];
    }
    if (!progress.completedDays.includes(dayNumber)) {
      progress.completedDays.push(dayNumber);
      Storage.saveProgress(progress);
    }
  }

  return {
    loadWeek1,
    loadDay,
    getCurrentDay,
    getCurrentData,
    getWeekData,
    getWords,
    getPatterns,
    getShadowing,
    getDayInfo,
    getAvailableDays,
    loadNextDay,
    loadPreviousDay,
    isDayUnlocked,
    markDayCompleted
  };
})();


/* === src/utils/patternEngine.js === */
/**
 * Pattern Drill Engine
 * Core engine for template replacement and random sentence generation
 */
const PatternEngine = (function() {
  let patterns = [];
  let currentPatternIndex = 0;

  function loadPatterns(patternData) {
    patterns = patternData;
    currentPatternIndex = 0;
  }

  function getCurrentPattern() {
    return patterns[currentPatternIndex] || null;
  }

  function selectPattern(index) {
    if (index >= 0 && index < patterns.length) {
      currentPatternIndex = index;
      return patterns[index];
    }
    return null;
  }

  function getAllPatterns() {
    return patterns;
  }

  /**
   * Generate a sentence from the current pattern
   * Replaces {placeholder} with random values from placeholders
   */
  function generateSentence(patternIndex = null) {
    const pattern = patternIndex !== null ? patterns[patternIndex] : getCurrentPattern();
    if (!pattern) return null;

    let sentence = pattern.template;
    const usedValues = {};

    // Find all placeholders in template: {key}
    const placeholderMatches = sentence.match(/\{([^}]+)\}/g);
    
    if (placeholderMatches && pattern.placeholders) {
      placeholderMatches.forEach(match => {
        const key = match.slice(1, -1); // Remove { and }
        const values = pattern.placeholders[key];
        
        if (values && values.length > 0) {
          // Get random value, avoid repeating if possible
          let availableValues = values;
          if (usedValues[key]) {
            availableValues = values.filter(v => v !== usedValues[key]);
            if (availableValues.length === 0) availableValues = values;
          }
          
          const randomValue = availableValues[Math.floor(Math.random() * availableValues.length)];
          usedValues[key] = randomValue;
          
          // Replace all occurrences of this placeholder
          sentence = sentence.replace(new RegExp(`\\{${key}\\}`, 'g'), randomValue);
        }
      });
    }

    return {
      sentence: sentence,
      pattern: pattern,
      template: pattern.template
    };
  }

  /**
   * Generate multiple unique sentences from the same pattern
   */
  function generateMultipleSentences(count = 3, patternIndex = null) {
    const sentences = [];
    const usedSentences = new Set();
    let attempts = 0;
    const maxAttempts = count * 10;

    while (sentences.length < count && attempts < maxAttempts) {
      const result = generateSentence(patternIndex);
      if (result && !usedSentences.has(result.sentence)) {
        sentences.push(result);
        usedSentences.add(result.sentence);
      }
      attempts++;
    }

    return sentences;
  }

  /**
   * Get next pattern (for cycling through patterns)
   */
  function nextPattern() {
    currentPatternIndex = (currentPatternIndex + 1) % patterns.length;
    return getCurrentPattern();
  }

  /**
   * Get previous pattern
   */
  function previousPattern() {
    currentPatternIndex = (currentPatternIndex - 1 + patterns.length) % patterns.length;
    return getCurrentPattern();
  }

  function getCurrentPatternIndex() {
    return currentPatternIndex;
  }

  /**
   * Get pattern statistics
   */
  function getStats() {
    return {
      totalPatterns: patterns.length,
      currentIndex: currentPatternIndex,
      currentPattern: getCurrentPattern()
    };
  }

  return {
    loadPatterns,
    getCurrentPattern,
    selectPattern,
    getCurrentPatternIndex,
    getAllPatterns,
    generateSentence,
    generateMultipleSentences,
    nextPattern,
    previousPattern,
    getStats
  };
})();

/* === src/components/navigation.js === */
/**
 * Navigation System
 * Sticky bottom mobile navigation with 5 main sections
 */
const Navigation = (function() {
  const navItems = [
    { id: 'home', icon: '🏠', label: '首页', labelEn: 'Home' },
    { id: 'words', icon: '📚', label: '词汇', labelEn: 'Words' },
    { id: 'patterns', icon: '🔄', label: '句型', labelEn: 'Patterns' },
    { id: 'shadowing', icon: '🎤', label: '跟读', labelEn: 'Shadowing' },
    { id: 'progress', icon: '📊', label: '进度', labelEn: 'Progress' }
  ];

  let currentPage = 'home';
  let isEnglish = false;

  function init() {
    renderNavigation();
    setupEventListeners();
    highlightCurrentPage();
    updateGlobalStats();
  }

  function renderNavigation() {
    const container = document.getElementById('bottomNav');
    if (!container) return;

    container.innerHTML = navItems.map(item => `
      <button class="nav-item ${item.id === currentPage ? 'active' : ''}" 
              data-page="${item.id}"
              aria-label="${isEnglish ? item.labelEn : item.label}">
        <span class="nav-icon">${item.icon}</span>
        <span class="nav-label">${isEnglish ? item.labelEn : item.label}</span>
      </button>
    `).join('');
  }

  function setupEventListeners() {
    const container = document.getElementById('bottomNav');
    if (!container) return;

    container.addEventListener('click', (e) => {
      const navItem = e.target.closest('.nav-item');
      if (navItem) {
        const pageId = navItem.getAttribute('data-page');
        navigateTo(pageId);
      }
    });
  }

  function navigateTo(pageId) {
    if (pageId === currentPage) return;

    // Update current page
    currentPage = pageId;

    // Update navigation UI
    highlightCurrentPage();

    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update global stats
    updateGlobalStats();

    // Refresh page content
    refreshPage(pageId);

    // Dispatch navigation event
    window.dispatchEvent(new CustomEvent('pageChange', { detail: { page: pageId } }));
  }

  function updateGlobalStats() {
    const learnedWords = Storage.getLearnedWords().length;
    const streak = Storage.getStreak();

    // Update header stats
    const headerStreak = document.getElementById('header-streak');
    const headerLearned = document.getElementById('header-learned');
    if (headerStreak) headerStreak.textContent = streak;
    if (headerLearned) headerLearned.textContent = learnedWords;
  }

  function highlightCurrentPage() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-page') === currentPage);
    });
  }

  function refreshPage(pageId) {
    switch (pageId) {
      case 'home':
        if (typeof HomePage !== 'undefined') HomePage.refresh();
        break;
      case 'words':
        if (typeof WordsPage !== 'undefined') WordsPage.refresh();
        break;
      case 'patterns':
        if (typeof PatternsPage !== 'undefined') PatternsPage.refresh();
        break;
      case 'shadowing':
        if (typeof ShadowingPage !== 'undefined') ShadowingPage.refresh();
        break;
      case 'progress':
        if (typeof ProgressPage !== 'undefined') ProgressPage.refresh();
        break;
    }
  }

  function setLanguage(isEn) {
    isEnglish = isEn;
    renderNavigation();
  }

  function getCurrentPage() {
    return currentPage;
  }

  return {
    init,
    navigateTo,
    setLanguage,
    getCurrentPage
  };
})();

/* === src/pages/home.js === */
const HomePage = (function() {
  function init() {
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
      startBtn.addEventListener('click', function() {
        navigateTo('words');
      });
    }
    updateStats();
  }

  function refresh() {
    init();
  }

  function updateStats() {
    const learnedWords = Storage.getLearnedWords().length;
    const streak = Storage.getStreak();
    const drillsCompleted = Storage.getCompletedDrills().length;
    const shadowingCompleted = Storage.getShadowingSessions().length;

    // Update header stats
    const headerStreak = document.getElementById('header-streak');
    const headerLearned = document.getElementById('header-learned');
    if (headerStreak) headerStreak.textContent = streak;
    if (headerLearned) headerLearned.textContent = learnedWords;

    // Update quick stats row
    const homeWordsCount = document.getElementById('homeWordsCount');
    const homePatternsCount = document.getElementById('homePatternsCount');
    const homeShadowingCount = document.getElementById('homeShadowingCount');
    if (homeWordsCount) homeWordsCount.textContent = learnedWords;
    if (homePatternsCount) homePatternsCount.textContent = drillsCompleted;
    if (homeShadowingCount) homeShadowingCount.textContent = shadowingCompleted;

    // Update streak banner
    const streakCountEl = document.getElementById('streakCount');
    const homeStreakDisplay = document.getElementById('homeStreakDisplay');
    if (streakCountEl) streakCountEl.textContent = streak;
    if (homeStreakDisplay) homeStreakDisplay.textContent = streak + '天';

    // Update module cards
    const wordsLearned = document.getElementById('wordsLearned');
    const patternsCompleted = document.getElementById('patternsCompleted');
    const shadowingComp = document.getElementById('shadowingCompleted');

    if (wordsLearned) wordsLearned.textContent = learnedWords + '/587';
    if (patternsCompleted) patternsCompleted.textContent = drillsCompleted;
    if (shadowingComp) shadowingComp.textContent = shadowingCompleted;
  }

  return {
    init: init,
    refresh: refresh,
    updateStats: updateStats
  };
})();

/* === src/pages/words.js === */
/**
 * Vocabulary Training Module
 * Features: speech playback, day selection, adjustable speed, repeat mode, mark as learned
 */
const WordsPage = (function() {
  let wordsData = [];
  let learnedWords = new Set();
  let currentSpeed = 1;
  let isRepeatMode = false;
  let currentDay = 1;
  let availableDays = [];

  async function init() {
    await loadWeekData();
    loadLearnedWords();
    setupEventListeners();
    renderDaySelector();
    await loadDay(1);
    renderWords();
  }

  async function loadWeekData() {
    const weekData = await DayLoader.loadWeek1();
    if (weekData && weekData.days) {
      availableDays = weekData.days.map(d => ({
        day: d.day,
        title: d.title,
        titleCn: d.titleCn,
        titleEn: d.titleEn
      }));
    }
    renderDaySelector();
  }

  async function loadDay(dayNumber) {
    const data = await DayLoader.loadDay(dayNumber);
    if (data) {
      wordsData = data.words || [];
      currentDay = dayNumber;
      updateDayTitle();
      renderWords();
    }
  }

  function updateDayTitle() {
    const titleEl = document.getElementById('wordsDayTitle');
    if (titleEl && availableDays.length > 0) {
      const dayInfo = availableDays.find(d => d.day === currentDay);
      if (dayInfo) {
        titleEl.textContent = `${I18n.t('day')} ${currentDay}: ${dayInfo.titleCn || dayInfo.title}`;
      }
    }
  }

  function renderDaySelector() {
    const container = document.getElementById('daySelector');
    if (!container) return;

    container.innerHTML = availableDays.map(day => {
      const isActive = day.day === currentDay;
      const isUnlocked = DayLoader.isDayUnlocked(day.day);
      return `
        <button class="day-btn ${isActive ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}"
                onclick="WordsPage.selectDay(${day.day})"
                ${!isUnlocked ? 'disabled' : ''}>
          ${I18n.t('day')} ${day.day}
        </button>
      `;
    }).join('');
  }

  function selectDay(dayNumber) {
    if (!DayLoader.isDayUnlocked(dayNumber)) return;
    loadDay(dayNumber);
    renderDaySelector();
  }

  function loadLearnedWords() {
    const saved = localStorage.getItem('linguadrill_learned_words');
    if (saved) {
      learnedWords = new Set(JSON.parse(saved));
    }
  }

  function saveLearnedWords() {
    localStorage.setItem('linguadrill_learned_words', JSON.stringify([...learnedWords]));
  }

  function setupEventListeners() {
    const speedSlider = document.getElementById('wordSpeedSlider');
    const speedValue = document.getElementById('wordSpeedValue');
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        currentSpeed = parseFloat(e.target.value);
        if (speedValue) speedValue.textContent = `${currentSpeed.toFixed(1)}x`;
        Speech.setRate(currentSpeed);
      });
    }

    const repeatBtn = document.getElementById('repeatModeBtn');
    if (repeatBtn) {
      repeatBtn.addEventListener('click', () => {
        isRepeatMode = !isRepeatMode;
        repeatBtn.classList.toggle('active', isRepeatMode);
        repeatBtn.textContent = isRepeatMode ? '🔁 重复3次: 开' : '🔁 重复3次: 关';
      });
    }
  }

  function renderWords() {
    const container = document.getElementById('wordsList');
    if (!container) return;

    if (wordsData.length === 0) {
      container.innerHTML = '<div class="empty-state">📚 No words loaded. Please select a day.</div>';
      return;
    }

    container.innerHTML = wordsData.map((word, index) => {
      const isLearned = learnedWords.has(`${currentDay}_${word.word}`);
      return `
        <div class="word-card ${isLearned ? 'learned' : ''}" data-index="${index}">
          <div class="word-header">
            <div class="word-main">
              <span class="word-text" onclick="WordsPage.playWord(${index})">${word.word}</span>
              <span class="word-phonetic">${word.phonetic}</span>
            </div>
            <button class="word-audio-btn" onclick="WordsPage.playWord(${index})" aria-label="Play pronunciation">
              🔊
            </button>
          </div>
          <div class="word-translation">${word.translation}</div>
          <div class="word-example">"${word.example}"</div>
          <div class="word-example-cn">${word.exampleCn}</div>
          <div class="word-actions">
            <button class="word-action-btn ${isLearned ? 'learned' : ''}" 
                    onclick="WordsPage.toggleLearned('${word.word}')">
              ${isLearned ? '✅ 已学会' : '⭕ 标记为已学'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function playWord(index) {
    const word = wordsData[index];
    if (!word) return;

    if (isRepeatMode) {
      Speech.speak(word.word, currentSpeed);
      setTimeout(() => Speech.speak(word.word, currentSpeed), 1000);
      setTimeout(() => Speech.speak(word.word, currentSpeed), 2000);
    } else {
      Speech.speak(word.word, currentSpeed);
    }

    Storage.incrementWordsLearned();
  }

  function playExample(index) {
    const word = wordsData[index];
    if (!word || !word.example) return;
    Speech.speak(word.example, currentSpeed);
  }

  function toggleLearned(word) {
    const key = `${currentDay}_${word}`;
    if (learnedWords.has(key)) {
      learnedWords.delete(key);
    } else {
      learnedWords.add(key);
    }
    saveLearnedWords();
    renderWords();
    checkDayCompletion();
    // Update global stats
    if (typeof Navigation !== 'undefined' && Navigation.updateGlobalStats) {
      Navigation.updateGlobalStats();
    }
    // Also update home page stats if available
    if (typeof HomePage !== 'undefined' && HomePage.updateStats) {
      HomePage.updateStats();
    }
  }

  function checkDayCompletion() {
    const dayWordsCount = wordsData.length;
    const learnedToday = wordsData.filter(w => learnedWords.has(`${currentDay}_${w.word}`)).length;
    
    if (learnedToday >= dayWordsCount * 0.8) {
      DayLoader.markDayCompleted(currentDay);
    }
  }

  function refresh() {
    loadLearnedWords();
    renderDaySelector();
    renderWords();
  }

  return {
    init,
    refresh,
    playWord,
    playExample,
    toggleLearned,
    selectDay
  };
})();


/* === src/pages/patterns.js === */
/**
 * Pattern Drill Module
 * Interactive pattern training with auto sentence generation and speech playback
 */
const PatternsPage = (function() {
  let currentSpeed = 1;
  let currentSentence = null;
  let currentPattern = null;
  let isAutoPlay = false;
  let currentDay = 1;
  let availableDays = [];

  async function init() {
    await loadWeekData();
    setupEventListeners();
    renderDaySelector();
    await loadDay(1);
    renderPatternList();
    generateNewSentence();
  }

  async function loadWeekData() {
    const weekData = await DayLoader.loadWeek1();
    if (weekData && weekData.days) {
      availableDays = weekData.days.map(d => ({
        day: d.day,
        title: d.title,
        titleCn: d.titleCn,
        titleEn: d.titleEn
      }));
    }
    renderDaySelector();
  }

  async function loadDay(dayNumber) {
    const data = await DayLoader.loadDay(dayNumber);
    if (data && data.patterns) {
      PatternEngine.loadPatterns(data.patterns);
      currentDay = dayNumber;
      updateDayTitle();
      renderPatternList();
      generateNewSentence();
    }
  }

  function updateDayTitle() {
    const titleEl = document.getElementById('patternsDayTitle');
    if (titleEl && availableDays.length > 0) {
      const dayInfo = availableDays.find(d => d.day === currentDay);
      if (dayInfo) {
        titleEl.textContent = `${I18n.t('day')} ${currentDay}: ${dayInfo.titleCn || dayInfo.title}`;
      }
    }
  }

  function renderDaySelector() {
    const container = document.getElementById('patternsDaySelector');
    if (!container) return;

    container.innerHTML = availableDays.map(day => {
      const isActive = day.day === currentDay;
      const isUnlocked = DayLoader.isDayUnlocked(day.day);
      return `
        <button class="day-btn ${isActive ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}"
                onclick="PatternsPage.selectDay(${day.day})"
                ${!isUnlocked ? 'disabled' : ''}>
          ${I18n.t('day')} ${day.day}
        </button>
      `;
    }).join('');
  }

  function selectDay(dayNumber) {
    if (!DayLoader.isDayUnlocked(dayNumber)) return;
    loadDay(dayNumber);
    renderDaySelector();
  }

  function setupEventListeners() {
    const speedSlider = document.getElementById('patternSpeedSlider');
    const speedValue = document.getElementById('patternSpeedValue');
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        currentSpeed = parseFloat(e.target.value);
        if (speedValue) speedValue.textContent = `${currentSpeed.toFixed(1)}x`;
        Speech.setRate(currentSpeed);
      });
    }

    const generateBtn = document.getElementById('generateSentenceBtn');
    if (generateBtn) {
      generateBtn.addEventListener('click', generateNewSentence);
    }

    const playBtn = document.getElementById('playSentenceBtn');
    if (playBtn) {
      playBtn.addEventListener('click', playCurrentSentence);
    }

    const autoPlayBtn = document.getElementById('autoPlayBtn');
    if (autoPlayBtn) {
      autoPlayBtn.addEventListener('click', toggleAutoPlay);
    }
  }

  function renderPatternList() {
    const container = document.getElementById('patternList');
    if (!container) return;

    const patterns = PatternEngine.getAllPatterns();
    if (patterns.length === 0) {
      container.innerHTML = '<div class="empty-state">📝 No patterns loaded. Please select a day.</div>';
      return;
    }

    container.innerHTML = patterns.map((pattern, index) => `
      <div class="pattern-item ${index === PatternEngine.getCurrentPatternIndex() ? 'active' : ''}" 
           data-index="${index}" 
           onclick="PatternsPage.selectPattern(${index})">
        <div class="pattern-template">${pattern.template}</div>
        <div class="pattern-desc">${pattern.description || pattern.descriptionCn || ''}</div>
      </div>
    `).join('');
  }

  function selectPattern(index) {
    PatternEngine.selectPattern(index);
    renderPatternList();
    generateNewSentence();
  }

  function generateNewSentence() {
    const result = PatternEngine.generateSentence();
    if (!result) return;

    currentSentence = result.sentence;
    currentPattern = result.template;
    
    const sentenceDisplay = document.getElementById('sentenceDisplay');
    const templateDisplay = document.getElementById('templateDisplay');
    
    if (sentenceDisplay) {
      sentenceDisplay.textContent = currentSentence;
      sentenceDisplay.classList.remove('fade-in');
      void sentenceDisplay.offsetWidth;
      sentenceDisplay.classList.add('fade-in');
    }
    
    if (templateDisplay) {
      templateDisplay.textContent = `模板: ${currentPattern}`;
    }

    Storage.incrementPatternsPracticed();

    if (isAutoPlay) {
      setTimeout(() => playCurrentSentence(), 500);
    }
  }

  function playCurrentSentence() {
    if (!currentSentence) return;
    Speech.speak(currentSentence, currentSpeed);
  }

  function toggleAutoPlay() {
    isAutoPlay = !isAutoPlay;
    const btn = document.getElementById('autoPlayBtn');
    if (btn) {
      btn.classList.toggle('active', isAutoPlay);
      btn.textContent = isAutoPlay ? '🔊 自动播放: 开' : '🔊 自动播放: 关';
    }
  }

  function refresh() {
    renderDaySelector();
    renderPatternList();
    if (!currentSentence) {
      generateNewSentence();
    }
  }

  return {
    init,
    refresh,
    selectPattern,
    selectDay,
    generateNewSentence,
    playCurrentSentence
  };
})();


/* === src/pages/shadowing.js === */
/**
 * Shadowing Module
 * Train listening rhythm and speaking rhythm with play/pause and "Your Turn" indicator
 */
const ShadowingPage = (function() {
  let shadowingData = [];
  let currentIndex = 0;
  let currentSpeed = 1;
  let isPlaying = false;
  let isPausedForUser = false;
  let currentDay = 1;
  let availableDays = [];
  let completedShadowing = new Set();

  async function init() {
    await loadWeekData();
    loadCompletedShadowing();
    setupEventListeners();
    renderDaySelector();
    await loadDay(1);
    renderSentenceList();
    renderPlayer();
  }

  async function loadWeekData() {
    const weekData = await DayLoader.loadWeek1();
    if (weekData && weekData.days) {
      availableDays = weekData.days.map(d => ({
        day: d.day,
        title: d.title,
        titleCn: d.titleCn,
        titleEn: d.titleEn
      }));
    }
    renderDaySelector();
  }

  async function loadDay(dayNumber) {
    const data = await DayLoader.loadDay(dayNumber);
    if (data && data.shadowing) {
      shadowingData = data.shadowing;
      currentDay = dayNumber;
      currentIndex = 0;
      isPausedForUser = false;
      isPlaying = false;
      updateDayTitle();
      renderSentenceList();
      renderPlayer();
    }
  }

  function updateDayTitle() {
    const titleEl = document.getElementById('shadowingDayTitle');
    if (titleEl && availableDays.length > 0) {
      const dayInfo = availableDays.find(d => d.day === currentDay);
      if (dayInfo) {
        titleEl.textContent = `${I18n.t('day')} ${currentDay}: ${dayInfo.titleCn || dayInfo.title}`;
      }
    }
  }

  function renderDaySelector() {
    const container = document.getElementById('shadowingDaySelector');
    if (!container) return;

    container.innerHTML = availableDays.map(day => {
      const isActive = day.day === currentDay;
      const isUnlocked = DayLoader.isDayUnlocked(day.day);
      return `
        <button class="day-btn ${isActive ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}"
                onclick="ShadowingPage.selectDay(${day.day})"
                ${!isUnlocked ? 'disabled' : ''}>
          ${I18n.t('day')} ${day.day}
        </button>
      `;
    }).join('');
  }

  function selectDay(dayNumber) {
    if (!DayLoader.isDayUnlocked(dayNumber)) return;
    loadDay(dayNumber);
    renderDaySelector();
  }

  function loadCompletedShadowing() {
    const saved = localStorage.getItem('linguadrill_completed_shadowing');
    if (saved) {
      completedShadowing = new Set(JSON.parse(saved));
    }
  }

  function saveCompletedShadowing() {
    localStorage.setItem('linguadrill_completed_shadowing', JSON.stringify([...completedShadowing]));
  }

  function setupEventListeners() {
    const speedSlider = document.getElementById('shadowingSpeedSlider');
    const speedValue = document.getElementById('shadowingSpeedValue');
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        currentSpeed = parseFloat(e.target.value);
        if (speedValue) speedValue.textContent = `${currentSpeed.toFixed(1)}x`;
        Speech.setRate(currentSpeed);
      });
    }

    const playBtn = document.getElementById('shadowingPlayBtn');
    const replayBtn = document.getElementById('shadowingReplayBtn');
    const nextBtn = document.getElementById('shadowingNextBtn');
    const prevBtn = document.getElementById('shadowingPrevBtn');

    if (playBtn) playBtn.addEventListener('click', playCurrent);
    if (replayBtn) replayBtn.addEventListener('click', replayCurrent);
    if (nextBtn) nextBtn.addEventListener('click', nextSentence);
    if (prevBtn) prevBtn.addEventListener('click', prevSentence);
  }

  function renderSentenceList() {
    const container = document.getElementById('shadowingList');
    if (!container) return;

    if (shadowingData.length === 0) {
      container.innerHTML = '<div class="empty-state">🎧 No sentences loaded. Please select a day.</div>';
      return;
    }

    container.innerHTML = shadowingData.map((item, index) => {
      const key = `${currentDay}_${item.id}`;
      const isCompleted = completedShadowing.has(key);
      return `
        <div class="shadowing-item ${index === currentIndex ? 'active' : ''} ${isCompleted ? 'completed' : ''}" 
             data-index="${index}" 
             onclick="ShadowingPage.selectSentence(${index})">
          <div class="shadowing-number">${index + 1}</div>
          <div class="shadowing-content">
            <div class="shadowing-sentence">${item.sentence}</div>
            <div class="shadowing-translation">${item.translation}</div>
          </div>
          <div class="shadowing-status">
            ${isCompleted ? '✅' : item.difficulty === 'easy' ? '🟢' : '🟡'}
          </div>
        </div>
      `;
    }).join('');
  }

  function renderPlayer() {
    const currentItem = shadowingData[currentIndex];
    if (!currentItem) return;

    const sentenceDisplay = document.getElementById('shadowingSentenceDisplay');
    const translationDisplay = document.getElementById('shadowingTranslationDisplay');
    const yourTurnIndicator = document.getElementById('yourTurnIndicator');
    const progressDisplay = document.getElementById('shadowingProgress');

    if (sentenceDisplay) {
      sentenceDisplay.textContent = currentItem.sentence;
    }

    if (translationDisplay) {
      translationDisplay.textContent = currentItem.translation;
    }

    if (yourTurnIndicator) {
      yourTurnIndicator.style.display = isPausedForUser ? 'flex' : 'none';
    }

    if (progressDisplay) {
      progressDisplay.textContent = `${currentIndex + 1} / ${shadowingData.length}`;
    }

    document.querySelectorAll('.shadowing-item').forEach((item, i) => {
      item.classList.toggle('active', i === currentIndex);
    });
  }

  function selectSentence(index) {
    if (index >= 0 && index < shadowingData.length) {
      currentIndex = index;
      isPausedForUser = false;
      isPlaying = false;
      renderPlayer();
      renderSentenceList();
    }
  }

  function playCurrent() {
    const currentItem = shadowingData[currentIndex];
    if (!currentItem) return;

    isPlaying = true;
    isPausedForUser = false;
    renderPlayer();

    const duration = (currentItem.sentence.length * 80) / currentSpeed;

    Speech.speak(currentItem.sentence, currentSpeed);

    setTimeout(() => {
      isPausedForUser = true;
      isPlaying = false;
      renderPlayer();
      markCurrentCompleted();
    }, duration);

    Storage.incrementShadowingCompleted();
  }

  function markCurrentCompleted() {
    const currentItem = shadowingData[currentIndex];
    if (currentItem) {
      const key = `${currentDay}_${currentItem.id}`;
      completedShadowing.add(key);
      saveCompletedShadowing();
      renderSentenceList();
      checkDayCompletion();
    }
  }

  function checkDayCompletion() {
    const dayShadowingCount = shadowingData.length;
    const completedToday = shadowingData.filter(s => completedShadowing.has(`${currentDay}_${s.id}`)).length;
    
    if (completedToday >= dayShadowingCount * 0.8) {
      DayLoader.markDayCompleted(currentDay);
    }
  }

  function replayCurrent() {
    isPausedForUser = false;
    playCurrent();
  }

  function nextSentence() {
    if (currentIndex < shadowingData.length - 1) {
      currentIndex++;
      isPausedForUser = false;
      isPlaying = false;
      renderPlayer();
      renderSentenceList();
      setTimeout(() => playCurrent(), 300);
    }
  }

  function prevSentence() {
    if (currentIndex > 0) {
      currentIndex--;
      isPausedForUser = false;
      isPlaying = false;
      renderPlayer();
      renderSentenceList();
    }
  }

  function refresh() {
    loadCompletedShadowing();
    renderDaySelector();
    renderSentenceList();
    renderPlayer();
  }

  return {
    init,
    refresh,
    selectSentence,
    selectDay,
    playCurrent,
    replayCurrent,
    nextSentence,
    prevSentence
  };
})();


/* === src/pages/progress.js === */
/**
 * Learning Progress System
 * Track and display learning progress using LocalStorage
 */
const ProgressPage = (function() {
  function init() {
    updateProgressDisplay();
    renderHistory();
    renderAchievements();
  }

  function updateProgressDisplay() {
    const progress = Storage.getProgress();
    const streak = Storage.getStreak();

    // Update main stats
    updateStat('wordsLearned', progress.wordsLearned);
    updateStat('patternsPracticed', progress.patternsPracticed);
    updateStat('shadowingCompleted', progress.shadowingCompleted);
    updateStat('streakCount', streak.current);

    // Update progress bars
    updateProgressBar('wordsProgress', progress.wordsLearned, progress.totalWords || 20);
    updateProgressBar('patternsProgress', progress.patternsPracticed, progress.totalPatterns || 8);
    updateProgressBar('shadowingProgress', progress.shadowingCompleted, progress.totalShadowing || 10);
  }

  function updateStat(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
      // Animate the number
      animateNumber(element, parseInt(element.textContent) || 0, value);
    }
  }

  function animateNumber(element, start, end) {
    const duration = 500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      const current = Math.round(start + (end - start) * easeProgress);
      
      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  function updateProgressBar(elementId, current, total) {
    const bar = document.getElementById(elementId);
    const text = document.getElementById(elementId + 'Text');
    
    if (bar && total > 0) {
      const percentage = Math.min((current / total) * 100, 100);
      bar.style.width = percentage + '%';
    }
    
    if (text) {
      text.textContent = `${current}/${total}`;
    }
  }

  function renderHistory() {
    const container = document.getElementById('progressHistory');
    if (!container) return;

    const history = Storage.getHistory();
    
    if (history.length === 0) {
      container.innerHTML = `
        <div class="empty-history">
          <div class="empty-icon">📚</div>
          <p>开始学习，记录你的进步！</p>
        </div>
      `;
      return;
    }

    // Show last 7 days
    const recentHistory = history.slice(-7).reverse();
    
    container.innerHTML = recentHistory.map(day => `
      <div class="history-day">
        <div class="history-date">${formatDate(day.date)}</div>
        <div class="history-activities">
          ${day.words ? `<span class="activity-tag words">📚 ${day.words}</span>` : ''}
          ${day.patterns ? `<span class="activity-tag patterns">🔄 ${day.patterns}</span>` : ''}
          ${day.shadowing ? `<span class="activity-tag shadowing">🎤 ${day.shadowing}</span>` : ''}
        </div>
        <div class="history-total">${day.total || 0}</div>
      </div>
    `).join('');
  }

  function renderAchievements() {
    const container = document.getElementById('achievementsList');
    if (!container) return;

    const progress = Storage.getProgress();
    const streak = Storage.getStreak();

    const achievements = [
      {
        id: 'first_word',
        icon: '🎯',
        title: '初次学习',
        description: '学习第一个单词',
        unlocked: progress.wordsLearned >= 1
      },
      {
        id: 'word_master',
        icon: '📚',
        title: '词汇达人',
        description: '学习10个单词',
        unlocked: progress.wordsLearned >= 10
      },
      {
        id: 'pattern_pro',
        icon: '🔄',
        title: '句型高手',
        description: '完成10次句型练习',
        unlocked: progress.patternsPracticed >= 10
      },
      {
        id: 'shadowing_star',
        icon: '🎤',
        title: '跟读之星',
        description: '完成5次跟读练习',
        unlocked: progress.shadowingCompleted >= 5
      },
      {
        id: 'streak_3',
        icon: '🔥',
        title: '连续3天',
        description: '连续学习3天',
        unlocked: streak.current >= 3
      },
      {
        id: 'streak_7',
        icon: '🔥',
        title: '连续7天',
        description: '连续学习7天',
        unlocked: streak.current >= 7
      }
    ];

    container.innerHTML = achievements.map(achievement => `
      <div class="achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}">
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-info">
          <div class="achievement-title">${achievement.title}</div>
          <div class="achievement-desc">${achievement.description}</div>
        </div>
        <div class="achievement-status">
          ${achievement.unlocked ? '✅' : '🔒'}
        </div>
      </div>
    `).join('');
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) {
      return '今天';
    } else if (dateStr === yesterday.toISOString().split('T')[0]) {
      return '昨天';
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  }

  function refresh() {
    updateProgressDisplay();
    renderHistory();
    renderAchievements();
  }

  return {
    init,
    refresh
  };
})();

/* === src/app.js === */
/**
 * LinguaDrill Main Application
 * Initialize and coordinate all modules
 */
const App = (function() {
  let currentPage = 'home';

  function init() {
    initUtilities();
    Navigation.init();
    initPages();
    setupEventListeners();
    I18n.translatePage();
    console.log('🎯 LinguaDrill initialized successfully!');
  }

  function initUtilities() {
    const settings = Storage.getSettings();
    if (settings.speechRate) {
      Speech.setRate(settings.speechRate);
    }
    DayLoader.loadWeek1();
  }

  function initPages() {
    if (typeof HomePage !== 'undefined') {
      HomePage.init();
    }
    if (typeof WordsPage !== 'undefined') {
      WordsPage.init();
    }
    if (typeof PatternsPage !== 'undefined') {
      PatternsPage.init();
    }
    if (typeof ShadowingPage !== 'undefined') {
      ShadowingPage.init();
    }
    if (typeof ProgressPage !== 'undefined') {
      ProgressPage.init();
    }
  }

  function setupEventListeners() {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
      langToggle.addEventListener('click', toggleLanguage);
    }

    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        Navigation.navigateTo('words');
      });
    }

    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        Navigation.navigateTo('words');
      });
    }

    window.addEventListener('pageChange', (e) => {
      currentPage = e.detail.page;
      onPageChange(currentPage);
    });

    window.addEventListener('languageChange', () => {
      I18n.translatePage();
      updateLangToggle();
      refreshCurrentPage();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        Speech.pause();
      }
    });

    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  }

  function toggleLanguage() {
    const currentLang = I18n.getLanguage();
    const newLang = currentLang === 'zh' ? 'en' : 'zh';
    I18n.setLanguage(newLang);
    Navigation.setLanguage(newLang === 'en');
  }

  function updateLangToggle() {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
      const currentLang = I18n.getLanguage();
      langToggle.querySelector('span').textContent = currentLang === 'zh' ? 'English' : '中文';
    }
  }

  function refreshCurrentPage() {
    switch(currentPage) {
      case 'words':
        if (typeof WordsPage !== 'undefined') WordsPage.refresh();
        break;
      case 'patterns':
        if (typeof PatternsPage !== 'undefined') PatternsPage.refresh();
        break;
      case 'shadowing':
        if (typeof ShadowingPage !== 'undefined') ShadowingPage.refresh();
        break;
      case 'progress':
        if (typeof ProgressPage !== 'undefined') ProgressPage.refresh();
        break;
    }
  }

  function onPageChange(page) {
    localStorage.setItem('linguadrill_last_page', page);
    
    switch(page) {
      case 'words':
        if (typeof WordsPage !== 'undefined') WordsPage.refresh();
        break;
      case 'patterns':
        if (typeof PatternsPage !== 'undefined') PatternsPage.refresh();
        break;
      case 'shadowing':
        if (typeof ShadowingPage !== 'undefined') ShadowingPage.refresh();
        break;
      case 'progress':
        if (typeof ProgressPage !== 'undefined') ProgressPage.refresh();
        break;
    }

    Storage.updateStreak();
  }

  function getCurrentPage() {
    return currentPage;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    getCurrentPage
  };
})();


