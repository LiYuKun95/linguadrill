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
      'patterns.markPracticed': '已练习',
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
      'common.day': '天',
      'day': 'Day',
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
      'patterns.markPracticed': 'Practiced',
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
      'common.day': 'Day',
      'day': 'Day'
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
    const utterance = new SpeechSynthesisUtterance(text);
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
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
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
      const response = await fetch('data/week1.json');
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
      console.log(`DayLoader: currentWeek not loaded, loading Week 1 first...`);
      await loadWeek1();
    }
    
    if (currentWeek && currentWeek.days) {
      const dayData = currentWeek.days.find(d => d.day === dayNumber);
      if (dayData) {
        console.log(`DayLoader: Found Day ${dayNumber} in week data`);
        currentData = dayData;
        currentDay = dayNumber;
        return dayData;
      } else {
        console.warn(`DayLoader: Day ${dayNumber} not found in week data, trying individual file...`);
      }
    }
    
    // Fallback to individual day file
    try {
      console.log(`DayLoader: Trying to load data/day${dayNumber}.json...`);
      const response = await fetch(`data/day${dayNumber}.json`);
      if (!response.ok) {
        throw new Error(`Day ${dayNumber} data not found (HTTP ${response.status})`);
      }
      currentData = await response.json();
      currentDay = dayNumber;
      console.log(`DayLoader: Successfully loaded data/day${dayNumber}.json`);
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


/* === src/utils/appState.js === */
/**
 * AppState - Centralized Global State Management
 * Single source of truth for all application state
 */
const AppState = (function() {
  // Private state
  let state = {
    currentPage: 'home',
    currentDay: 1,
    weekData: null,
    dayData: null,
    learnedWords: new Set(),
    streak: 0,
    lastDate: null,
    wordsLearned: 0,
    patternsPracticed: 0,
    shadowingCompleted: 0,
    isLoading: false,
    error: null
  };

  // Listeners for state changes
  const listeners = {};

  /**
   * Subscribe to state changes
   */
  function on(key, callback) {
    if (!listeners[key]) listeners[key] = [];
    listeners[key].push(callback);
    return () => {
      listeners[key] = listeners[key].filter(cb => cb !== callback);
    };
  }

  /**
   * Emit state change event
   */
  function emit(key, value) {
    if (listeners[key]) {
      listeners[key].forEach(cb => cb(value));
    }
    // Also emit '*' for general updates
    if (listeners['*']) {
      listeners['*'].forEach(cb => cb({ key, value, state }));
    }
  }

  /**
   * Get a value from state
   */
  function get(key) {
    return key ? state[key] : { ...state };
  }

  /**
   * Set a value in state and notify listeners
   */
  function set(key, value) {
    const oldValue = state[key];
    state[key] = value;
    emit(key, value);
    saveToStorage();
  }

  /**
   * Initialize state from localStorage
   */
  function init() {
    loadFromStorage();
    
    // Also load learned words from localStorage
    try {
      const saved = localStorage.getItem('linguadrill_learned_words');
      if (saved) {
        state.learnedWords = new Set(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load learned words:', e);
    }

    // Load streak data
    try {
      const streakData = localStorage.getItem('linguadrill_streak');
      if (streakData) {
        const parsed = JSON.parse(streakData);
        state.streak = parsed.current || 0;
        state.lastDate = parsed.lastDate;
      }
    } catch (e) {
      console.error('Failed to load streak:', e);
    }

    // Load progress data
    try {
      const progressData = localStorage.getItem('linguadrill_progress');
      if (progressData) {
        const parsed = JSON.parse(progressData);
        state.wordsLearned = parsed.wordsLearned || 0;
        state.patternsPracticed = parsed.patternsPracticed || 0;
        state.shadowingCompleted = parsed.shadowingCompleted || 0;
      }
    } catch (e) {
      console.error('Failed to load progress:', e);
    }

    // Check and update streak
    updateStreak();

    console.log('📊 AppState initialized:', {
      learnedWords: state.learnedWords.size,
      streak: state.streak,
      wordsLearned: state.wordsLearned
    });
  }

  /**
   * Update streak based on current date
   */
  function updateStreak() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (state.lastDate === todayStr) {
      // Already updated today — no change
      return;
    } else if (state.lastDate === yesterdayStr) {
      // Consecutive day — increment streak
      state.streak += 1;
    } else if (state.lastDate === null) {
      // First ever day
      state.streak = 1;
    } else {
      // Gap detected — streak broken, restart at 1
      state.streak = 1;
    }

    state.lastDate = todayStr;
    saveToStorage();
    emit('streak', state.streak);
  }

  /**
   * Mark a word as learned
   */
  function markWordLearned(day, word) {
    const key = `${day}_${word}`;
    state.learnedWords.add(key);
    state.wordsLearned++;
    saveLearnedWords();
    saveToStorage();
    emit('learnedWords', state.learnedWords);
    emit('wordsLearned', state.wordsLearned);
    return true;
  }

  /**
   * Unmark a word as learned
   */
  function unmarkWordLearned(day, word) {
    const key = `${day}_${word}`;
    state.learnedWords.delete(key);
    state.wordsLearned = Math.max(0, state.wordsLearned - 1);
    saveLearnedWords();
    saveToStorage();
    emit('learnedWords', state.learnedWords);
    emit('wordsLearned', state.wordsLearned);
    return true;
  }

  /**
   * Check if a word is learned
   */
  function isWordLearned(day, word) {
    return state.learnedWords.has(`${day}_${word}`);
  }

  /**
   * Get learned words for a specific day
   */
  function getDayLearnedWords(day) {
    return [...state.learnedWords]
      .filter(key => key.startsWith(`${day}_`))
      .map(key => key.split('_')[1]);
  }

  /**
   * Increment patterns practiced
   */
  function incrementPatterns(count = 1) {
    state.patternsPracticed += count;
    saveToStorage();
    emit('patternsPracticed', state.patternsPracticed);
  }

  /**
   * Increment shadowing completed
   */
  function incrementShadowing(count = 1) {
    state.shadowingCompleted += count;
    saveToStorage();
    emit('shadowingCompleted', state.shadowingCompleted);
  }

  /**
   * Set week data (from DayLoader)
   */
  function setWeekData(data) {
    state.weekData = data;
    emit('weekData', data);
  }

  /**
   * Set current day data
   */
  function setDayData(data) {
    state.dayData = data;
    state.currentDay = data?.day || state.currentDay;
    emit('dayData', data);
    emit('currentDay', state.currentDay);
  }

  /**
   * Navigate to a page
   */
  function navigateTo(pageId) {
    if (state.currentPage === pageId) return;
    state.currentPage = pageId;
    emit('currentPage', pageId);
    handlePageNavigation(pageId);
  }

  /**
   * Handle page navigation DOM updates
   */
  function handlePageNavigation(pageId) {
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

    // Update all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-page') === pageId);
    });

    // Update header stats
    updateHeaderStats();

    // Trigger page-specific refresh
    refreshPage(pageId);

    // Save last page
    localStorage.setItem('linguadrill_last_page', pageId);
  }

  /**
   * Refresh page content
   */
  function refreshPage(pageId) {
    switch (pageId) {
      case 'home':
        if (typeof HomePage !== 'undefined' && HomePage.refresh) {
          HomePage.refresh();
        }
        break;
      case 'words':
        if (typeof WordsPage !== 'undefined' && WordsPage.refresh) {
          WordsPage.refresh();
        }
        break;
      case 'patterns':
        if (typeof PatternsPage !== 'undefined' && PatternsPage.refresh) {
          PatternsPage.refresh();
        }
        break;
      case 'shadowing':
        if (typeof ShadowingPage !== 'undefined' && ShadowingPage.refresh) {
          ShadowingPage.refresh();
        }
        break;
      case 'progress':
        if (typeof ProgressPage !== 'undefined' && ProgressPage.refresh) {
          ProgressPage.refresh();
        }
        break;
    }
  }

  /**
   * Update header statistics
   */
  function updateHeaderStats() {
    const headerStreak = document.getElementById('header-streak');
    const headerLearned = document.getElementById('header-learned');
    
    if (headerStreak) headerStreak.textContent = state.streak;
    if (headerLearned) headerLearned.textContent = state.learnedWords.size;
  }

  /**
   * Save learned words to localStorage
   */
  function saveLearnedWords() {
    try {
      localStorage.setItem('linguadrill_learned_words', 
        JSON.stringify([...state.learnedWords]));
    } catch (e) {
      console.error('Failed to save learned words:', e);
    }
  }

  /**
   * Save state to localStorage
   */
  function saveToStorage() {
    try {
      const progress = {
        wordsLearned: state.wordsLearned,
        patternsPracticed: state.patternsPracticed,
        shadowingCompleted: state.shadowingCompleted,
        currentStreak: state.streak
      };
      localStorage.setItem('linguadrill_progress', JSON.stringify(progress));

      const streak = {
        current: state.streak,
        lastDate: state.lastDate
      };
      localStorage.setItem('linguadrill_streak', JSON.stringify(streak));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }

  /**
   * Load state from localStorage
   */
  function loadFromStorage() {
    try {
      const lastPage = localStorage.getItem('linguadrill_last_page');
      if (lastPage) {
        state.currentPage = lastPage;
      }
    } catch (e) {
      console.error('Failed to load last page:', e);
    }
  }

  /**
   * Get summary stats for dashboard
   */
  function getStats() {
    return {
      learnedWords: state.learnedWords.size,
      streak: state.streak,
      patternsPracticed: state.patternsPracticed,
      shadowingCompleted: state.shadowingCompleted,
      totalWords: state.weekData?.days?.reduce((sum, d) => sum + (d.words?.length || 0), 0) || 0
    };
  }

  // Initialize on load
  init();

  // Return public API
  return {
    // Getters
    get,
    getStats,
    isWordLearned,
    getDayLearnedWords,
    
    // Setters
    set,
    setWeekData,
    setDayData,
    navigateTo,
    markWordLearned,
    unmarkWordLearned,
    incrementPatterns,
    incrementShadowing,
    
    // Event handling
    on,
    
    // Utility
    init,
    refreshPage,
    updateHeaderStats,
    updateStreak
  };
})();

// Expose navigateTo globally for onclick handlers
window.navigateTo = function(pageId) {
  AppState.navigateTo(pageId);
};

// Expose AppState globally
window.AppState = AppState;


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
 * Metro-inspired floating bottom dock + desktop side nav
 * Uses AppState as single source of truth
 */
const Navigation = (function() {
  let isInitialized = false;

  function init() {
    if (isInitialized) return;
    
    setupEventListeners();
    restoreLastPage();
    isInitialized = true;
    console.log('🧭 Navigation initialized');
  }

  function setupEventListeners() {
    // Bottom nav (mobile/tablet)
    const bottomNav = document.getElementById('bottomNav');
    if (bottomNav) {
      bottomNav.addEventListener('click', (e) => {
        const navItem = e.target.closest('.nav-item');
        if (navItem) {
          const pageId = navItem.getAttribute('data-page');
          if (pageId) {
            navigateTo(pageId);
          }
        }
      });
    }

    // Side nav (desktop)
    const sideNav = document.getElementById('sideNav');
    if (sideNav) {
      sideNav.addEventListener('click', (e) => {
        const navItem = e.target.closest('.nav-item');
        if (navItem) {
          const pageId = navItem.getAttribute('data-page');
          if (pageId) {
            navigateTo(pageId);
          }
        }
      });
    }

    // Listen for page changes from AppState
    AppState.on('currentPage', (pageId) => {
      highlightCurrentPage(pageId);
    });
  }

  function navigateTo(pageId) {
    AppState.navigateTo(pageId);
  }

  function restoreLastPage() {
    // Navigate to last page or home
    const currentPage = AppState.get('currentPage');
    highlightCurrentPage(currentPage);
    
    // Show the current page
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    const targetPage = document.getElementById(currentPage);
    if (targetPage) {
      targetPage.classList.add('active');
    }
  }

  function highlightCurrentPage(pageId) {
    document.querySelectorAll('.nav-item').forEach(item => {
      const itemPage = item.getAttribute('data-page');
      item.classList.toggle('active', itemPage === pageId);
    });
  }

  function getCurrentPage() {
    return AppState.get('currentPage');
  }

  return {
    init,
    navigateTo,
    getCurrentPage
  };
})();


/* === src/pages/home.js === */
/**
 * Home Page Module
 * Metro Dashboard with learning overview
 * Uses AppState for global state
 */
const HomePage = (function() {
  const DAILY_GOAL = 20;
  let isInitialized = false;

  function init() {
    if (isInitialized) return;
    
    console.log('🏠 Initializing HomePage...');
    
    setupEventListeners();
    updateStats();
    updateGoalProgress();
    
    // Listen for state changes
    AppState.on('learnedWords', updateStats);
    AppState.on('streak', updateStats);
    
    isInitialized = true;
    console.log('✅ HomePage initialized');
  }

  function refresh() {
    updateStats();
    updateGoalProgress();
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
      startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        AppState.navigateTo('words');
      });
    }

    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        AppState.navigateTo('words');
      });
    }
  }

  /**
   * Update all statistics displays
   */
  function updateStats() {
    const stats = AppState.getStats();
    const learnedWords = stats.learnedWords;
    const streak = stats.streak;
    const patternsCompleted = stats.patternsPracticed;
    const shadowingCompleted = stats.shadowingCompleted;
    const totalWords = stats.totalWords || 587;

    // Header stats
    const headerStreak = document.getElementById('header-streak');
    const headerLearned = document.getElementById('header-learned');
    if (headerStreak) headerStreak.textContent = streak;
    if (headerLearned) headerLearned.textContent = learnedWords;

    // Quick stats row
    const homeWordsCount = document.getElementById('homeWordsCount');
    const homePatternsCount = document.getElementById('homePatternsCount');
    const homeShadowingCount = document.getElementById('homeShadowingCount');
    if (homeWordsCount) homeWordsCount.textContent = learnedWords;
    if (homePatternsCount) homePatternsCount.textContent = patternsCompleted;
    if (homeShadowingCount) homeShadowingCount.textContent = shadowingCompleted;

    // Module stats - show meaningful text instead of 0 values
    const wordsLearned = document.getElementById('wordsLearned');
    const patternsCompletedEl = document.getElementById('patternsCompleted');
    const shadowingCompletedEl = document.getElementById('shadowingCompleted');

    if (wordsLearned) {
      wordsLearned.textContent = learnedWords > 0 ? `${learnedWords}/${totalWords}` : '开始学习';
    }
    if (patternsCompletedEl) {
      patternsCompletedEl.textContent = patternsCompleted > 0 ? patternsCompleted : '-';
    }
    if (shadowingCompletedEl) {
      shadowingCompletedEl.textContent = shadowingCompleted > 0 ? shadowingCompleted : '-';
    }

    // Streak display - show dash when 0
    const homeStreakDisplay = document.getElementById('homeStreakDisplay');
    if (homeStreakDisplay) {
      homeStreakDisplay.textContent = streak > 0 ? `${streak}天` : '-';
    }

    // Metro progress rings
    updateProgressRing('wordsProgress', learnedWords, totalWords);
    updateProgressRing('patternsProgress', patternsCompleted, 50);
    updateProgressRing('shadowingProgress', shadowingCompleted, 50);
    updateProgressRing('progressProgress', streak, 30);

    // Update day badge
    const currentDay = AppState.get('currentDay') || 1;
    const homeDayBadge = document.getElementById('homeDayBadge');
    if (homeDayBadge) homeDayBadge.textContent = `Day ${currentDay}`;
  }

  /**
   * Update a Metro progress ring
   */
  function updateProgressRing(id, current, total) {
    const el = document.getElementById(id);
    if (!el) return;
    
    const pct = Math.min((current / total) * 100, 100);
    const deg = (pct / 100) * 360;
    el.style.background = `conic-gradient(var(--primary-color) ${deg}deg, var(--border-color) ${deg}deg)`;
    el.textContent = current > 0 ? Math.round(pct) + '%' : '';
  }

  /**
   * Update daily goal progress
   */
  function updateGoalProgress() {
    const stats = AppState.getStats();
    const todayTotal = stats.learnedWords;
    const pct = Math.min((todayTotal / DAILY_GOAL) * 100, 100);

    const goalCurrent = document.getElementById('goalCurrent');
    const goalTarget = document.getElementById('goalTarget');
    const goalBarFill = document.getElementById('goalBarFill');
    const dailyGoalText = document.getElementById('dailyGoalText');

    if (goalCurrent) goalCurrent.textContent = todayTotal;
    if (goalTarget) goalTarget.textContent = DAILY_GOAL;
    if (goalBarFill) goalBarFill.style.width = pct + '%';
    if (dailyGoalText) {
      dailyGoalText.textContent = pct >= 100 
        ? '🎉 今日目标已完成！' 
        : `完成 ${DAILY_GOAL} 个词汇`;
    }
  }

  return {
    init,
    refresh,
    updateStats
  };
})();


/* === src/pages/words.js === */
/**
 * Vocabulary Training Module
 * Features: speech playback, day selection, adjustable speed, repeat mode, mark as learned
 * Uses AppState for global state management
 */
const WordsPage = (function() {
  let wordsData = [];
  let availableDays = [];
  let currentSpeed = 1;
  let isRepeatMode = false;
  let currentDay = 1;
  let isInitialized = false;
  let currentWordIndex = -1;
  let searchQuery = '';

  /**
   * Initialize the Words page
   */
  async function init() {
    if (isInitialized) return;
    
    console.log('📖 Initializing WordsPage...');
    
    setupEventListeners();
    
    // Wait for week data to be available
    await loadWeekData();
    
    // Load initial day
    await loadDay(currentDay);
    
    isInitialized = true;
    console.log('✅ WordsPage initialized');
  }

  /**
   * Called when week data is ready
   */
  async function onDataReady(weekData) {
    console.log('📚 WordsPage received week data');
    availableDays = weekData.days.map(d => ({
      day: d.day,
      title: d.title,
      titleCn: d.titleCn,
      titleEn: d.titleEn
    }));
    renderDaySelector();
    updateDayTitle();
  }

  /**
   * Load week data from AppState or DayLoader
   */
  async function loadWeekData() {
    // First check if AppState has the data
    const weekData = AppState.get('weekData');
    
    if (weekData && weekData.days) {
      availableDays = weekData.days.map(d => ({
        day: d.day,
        title: d.title,
        titleCn: d.titleCn,
        titleEn: d.titleEn
      }));
    } else {
      // Load from DayLoader
      const data = await DayLoader.loadWeek1();
      if (data && data.days) {
        AppState.setWeekData(data);
        availableDays = data.days.map(d => ({
          day: d.day,
          title: d.title,
          titleCn: d.titleCn,
          titleEn: d.titleEn
        }));
      }
    }
    
    renderDaySelector();
  }

  /**
   * Load a specific day's data
   */
  async function loadDay(dayNumber) {
    console.log(`📅 Loading day ${dayNumber}...`);
    
    try {
      // Load from DayLoader
      const data = await DayLoader.loadDay(dayNumber);
      
      if (data) {
        wordsData = data.words || [];
        currentDay = dayNumber;
        currentWordIndex = -1;
        
        // Update AppState
        AppState.setDayData(data);
        AppState.set('currentDay', dayNumber);
        
        updateDayTitle();
        renderWords();
        
        console.log(`✅ Day ${dayNumber} loaded: ${wordsData.length} words`);
      } else {
        console.error(`❌ Failed to load day ${dayNumber}`);
        showEmptyState();
      }
    } catch (error) {
      console.error('Error loading day:', error);
      showEmptyState();
    }
  }

  /**
   * Show empty state when no data
   */
  function showEmptyState() {
    const container = document.getElementById('wordsList');
    if (container) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📚</div>
          <p>加载数据中...</p>
          <button onclick="WordsPage.refresh()">重试</button>
        </div>
      `;
    }
  }

  /**
   * Update day title
   */
  function updateDayTitle() {
    const titleEl = document.getElementById('wordsDayTitle');
    if (titleEl && availableDays.length > 0) {
      const dayInfo = availableDays.find(d => d.day === currentDay);
      if (dayInfo) {
        titleEl.textContent = `Day ${currentDay}: ${dayInfo.titleCn || dayInfo.title}`;
      }
    }
  }

  /**
   * Render day selector buttons
   */
  function renderDaySelector() {
    const container = document.getElementById('daySelector');
    if (!container) return;

    if (availableDays.length === 0) {
      container.innerHTML = '<span class="loading-text">加载中...</span>';
      return;
    }

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

  /**
   * Select a day
   */
  function selectDay(dayNumber) {
    if (!DayLoader.isDayUnlocked(dayNumber)) {
      console.log(`Day ${dayNumber} is locked`);
      return;
    }
    loadDay(dayNumber);
    renderDaySelector();
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Speed slider
    const speedSlider = document.getElementById('wordSpeedSlider');
    const speedValue = document.getElementById('wordSpeedValue');
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        currentSpeed = parseFloat(e.target.value);
        if (speedValue) speedValue.textContent = `${currentSpeed.toFixed(1)}x`;
        if (typeof Speech !== 'undefined') {
          Speech.setRate(currentSpeed);
        }
      });
    }

    // Repeat mode toggle
    const repeatBtn = document.getElementById('repeatModeBtn');
    if (repeatBtn) {
      repeatBtn.addEventListener('click', () => {
        isRepeatMode = !isRepeatMode;
        repeatBtn.classList.toggle('active', isRepeatMode);
        repeatBtn.textContent = isRepeatMode ? '🔁 重复3次: 开' : '🔁 重复3次: 关';
      });
    }

    // Listen for data ready event
    AppState.on('weekData', (data) => {
      if (data && data.days) {
        availableDays = data.days.map(d => ({
          day: d.day,
          title: d.title,
          titleCn: d.titleCn,
          titleEn: d.titleEn
        }));
        renderDaySelector();
        updateDayTitle();
      }
    });

    // Search input
    const searchInput = document.getElementById('wordSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        renderWords();
      });
    }
  }

  /**
   * Render the vocabulary list
   */
  function renderWords() {
    const container = document.getElementById('wordsList');
    if (!container) return;

    if (wordsData.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📚</div>
          <p>暂无词汇数据</p>
        </div>
      `;
      return;
    }

    // Filter by search query
    let filtered = wordsData;
    if (searchQuery) {
      filtered = wordsData.filter(w =>
        w.word.toLowerCase().includes(searchQuery) ||
        (w.translation && w.translation.includes(searchQuery)) ||
        (w.phonetic && w.phonetic.toLowerCase().includes(searchQuery))
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <p>没有匹配的词汇</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map((word, index) => {
      const realIndex = wordsData.indexOf(word);
      const isLearned = AppState.isWordLearned(currentDay, word.word);
      return `
        <div class="word-card ${isLearned ? 'learned' : ''}" data-index="${realIndex}">
          <div class="word-header">
            <div class="word-main">
              <span class="word-text" onclick="WordsPage.playWord(${realIndex})">${word.word}</span>
              <span class="word-phonetic">${word.phonetic || ''}</span>
            </div>
            <button class="word-audio-btn" onclick="WordsPage.playWord(${realIndex})" aria-label="播放发音">
              🔊
            </button>
          </div>
          <div class="word-translation">${word.translation || ''}</div>
          <div class="word-example">"${word.example || ''}"</div>
          <div class="word-example-cn">${word.exampleCn || ''}</div>
          <div class="word-actions">
            <button class="word-action-btn ${isLearned ? 'learned' : ''}"
                    onclick="WordsPage.toggleLearned('${word.word.replace(/'/g, "\\'")}')">
              ${isLearned ? '✅ 已学会' : '⭕ 标记为已学'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Show filter result count if searching
    if (searchQuery) {
      const countEl = document.createElement('div');
      countEl.className = 'search-result-count';
      countEl.textContent = `找到 ${filtered.length} / ${wordsData.length} 个词汇`;
      container.prepend(countEl);
    }
  }

  /**
   * Play word pronunciation
   */
  function playWord(index) {
    const word = wordsData[index];
    if (!word || typeof Speech === 'undefined') return;

    currentWordIndex = index;

    if (isRepeatMode) {
      Speech.speak(word.word, currentSpeed);
      setTimeout(() => Speech.speak(word.word, currentSpeed), 1000);
      setTimeout(() => Speech.speak(word.word, currentSpeed), 2000);
    } else {
      Speech.speak(word.word, currentSpeed);
    }
  }

  /**
   * Play the current word (for keyboard shortcut)
   */
  function playCurrentWord() {
    if (currentWordIndex >= 0 && currentWordIndex < wordsData.length) {
      playWord(currentWordIndex);
    } else if (wordsData.length > 0) {
      playWord(0);
    }
  }

  /**
   * Toggle word learned status
   */
  function toggleLearned(word) {
    const isLearned = AppState.isWordLearned(currentDay, word);
    
    if (isLearned) {
      AppState.unmarkWordLearned(currentDay, word);
    } else {
      AppState.markWordLearned(currentDay, word);
    }

    // Re-render
    renderWords();
    
    // Check for day completion
    checkDayCompletion();
    
    // Update global stats display
    AppState.updateHeaderStats();
    
    // Update HomePage if available
    if (typeof HomePage !== 'undefined' && HomePage.updateStats) {
      HomePage.updateStats();
    }
  }

  /**
   * Check if day is completed (80% learned)
   */
  function checkDayCompletion() {
    const dayWordsCount = wordsData.length;
    const learnedToday = AppState.getDayLearnedWords(currentDay).length;
    
    if (dayWordsCount > 0 && learnedToday >= dayWordsCount * 0.8) {
      DayLoader.markDayCompleted(currentDay);
      console.log(`🎉 Day ${currentDay} completed! (${learnedToday}/${dayWordsCount})`);
      
      // Show completion message
      showDayCompletedMessage();
      
      // Refresh day selector to unlock next day
      renderDaySelector();
    }
  }

  /**
   * Show day completion message with animation
   */
  function showDayCompletedMessage() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'completion-overlay';
    overlay.innerHTML = `
      <div class="completion-modal">
        <div class="completion-icon-animated">🎉</div>
        <h3 class="completion-title">太棒了！</h3>
        <p class="completion-subtitle">Day ${currentDay} 已完成！</p>
        <p class="completion-detail">你已掌握 ${wordsData.length} 个新词汇</p>
        <button class="completion-btn" onclick="this.closest('.completion-overlay').remove()">
          继续学习 →
        </button>
      </div>
    `;
    document.body.appendChild(overlay);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.classList.add('completion-fade-out');
        setTimeout(() => overlay.remove(), 300);
      }
    }, 5000);
  }

  /**
   * Refresh the page
   */
  function refresh() {
    console.log('🔄 Refreshing WordsPage...');
    loadLearnedWords();
    renderDaySelector();
    renderWords();
    updateDayTitle();
  }

  /**
   * Load learned words from storage
   */
  function loadLearnedWords() {
    // Data is managed by AppState now
  }

  return {
    init,
    refresh,
    onDataReady,
    playWord,
    playCurrentWord,
    toggleLearned,
    selectDay
  };
})();


/* === src/pages/patterns.js === */
/**
 * Pattern Drill Module
 * Interactive pattern training with auto sentence generation and speech playback
 * Uses AppState for global state management
 */
const PatternsPage = (function() {
  let currentSpeed = 1;
  let currentSentence = null;
  let currentPattern = null;
  let isAutoPlay = false;
  let currentDay = 1;
  let availableDays = [];
  let isInitialized = false;

  async function init() {
    if (isInitialized) return;
    
    console.log('🔄 Initializing PatternsPage...');
    
    await loadWeekData();
    setupEventListeners();
    renderDaySelector();
    await loadDay(1);
    renderPatternList();
    generateNewSentence();
    
    isInitialized = true;
    console.log('✅ PatternsPage initialized');
  }

  async function loadWeekData() {
    const weekData = AppState.get('weekData');
    
    if (weekData && weekData.days) {
      availableDays = weekData.days.map(d => ({
        day: d.day,
        title: d.title,
        titleCn: d.titleCn,
        titleEn: d.titleEn
      }));
    } else {
      const data = await DayLoader.loadWeek1();
      if (data && data.days) {
        AppState.setWeekData(data);
        availableDays = data.days.map(d => ({
          day: d.day,
          title: d.title,
          titleCn: d.titleCn,
          titleEn: d.titleEn
        }));
      }
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

    if (availableDays.length === 0) {
      container.innerHTML = '<span class="loading-text">加载中...</span>';
      return;
    }

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
        if (typeof Speech !== 'undefined') {
          Speech.setRate(currentSpeed);
        }
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

    const markPracticedBtn = document.getElementById('markPracticedBtn');
    if (markPracticedBtn) {
      markPracticedBtn.addEventListener('click', markPatternPracticed);
    }

    // Listen for week data updates
    AppState.on('weekData', (data) => {
      if (data && data.days) {
        availableDays = data.days.map(d => ({
          day: d.day,
          title: d.title,
          titleCn: d.titleCn,
          titleEn: d.titleEn
        }));
        renderDaySelector();
        updateDayTitle();
      }
    });
  }

  function renderPatternList() {
    const container = document.getElementById('patternList');
    if (!container) return;

    const patterns = PatternEngine.getAllPatterns();
    if (patterns.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-icon">📝</div><p>暂无句型数据</p></div>';
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
    if (!result) {
      const sentenceDisplay = document.getElementById('sentenceDisplay');
      if (sentenceDisplay) {
        sentenceDisplay.textContent = '点击"生成句子"开始练习';
      }
      return;
    }

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

    if (isAutoPlay) {
      setTimeout(() => playCurrentSentence(), 500);
    }
  }

  /**
   * Mark current pattern as practiced (counts toward progress)
   */
  function markPatternPracticed() {
    AppState.incrementPatterns(1);
    Storage.incrementPatternsPracticed();

    // Flash feedback on the generate button
    const btn = document.getElementById('generateSentenceBtn');
    if (btn) {
      btn.textContent = '✅ 已练习';
      setTimeout(() => {
        btn.textContent = I18n.t('patterns.generate') || '🔄 生成新句子';
      }, 1200);
    }

    // Update HomePage if available
    if (typeof HomePage !== 'undefined' && HomePage.updateStats) {
      HomePage.updateStats();
    }
  }

  function playCurrentSentence() {
    if (!currentSentence || typeof Speech === 'undefined') return;
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
    playCurrentSentence,
    markPatternPracticed
  };
})();


/* === src/pages/shadowing.js === */
/**
 * Shadowing Module
 * Train listening rhythm and speaking rhythm with play/pause and "Your Turn" indicator
 * Uses AppState for global state management
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
  let isInitialized = false;

  async function init() {
    if (isInitialized) return;
    
    console.log('🎤 Initializing ShadowingPage...');
    
    await loadWeekData();
    loadCompletedShadowing();
    setupEventListeners();
    renderDaySelector();
    await loadDay(1);
    renderSentenceList();
    renderPlayer();
    
    isInitialized = true;
    console.log('✅ ShadowingPage initialized');
  }

  async function loadWeekData() {
    const weekData = AppState.get('weekData');
    
    if (weekData && weekData.days) {
      availableDays = weekData.days.map(d => ({
        day: d.day,
        title: d.title,
        titleCn: d.titleCn,
        titleEn: d.titleEn
      }));
    } else {
      const data = await DayLoader.loadWeek1();
      if (data && data.days) {
        AppState.setWeekData(data);
        availableDays = data.days.map(d => ({
          day: d.day,
          title: d.title,
          titleCn: d.titleCn,
          titleEn: d.titleEn
        }));
      }
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

    if (availableDays.length === 0) {
      container.innerHTML = '<span class="loading-text">加载中...</span>';
      return;
    }

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
    try {
      const saved = localStorage.getItem('linguadrill_completed_shadowing');
      if (saved) {
        completedShadowing = new Set(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load shadowing progress:', e);
    }
  }

  function saveCompletedShadowing() {
    try {
      localStorage.setItem('linguadrill_completed_shadowing', JSON.stringify([...completedShadowing]));
    } catch (e) {
      console.error('Failed to save shadowing progress:', e);
    }
  }

  function setupEventListeners() {
    const speedSlider = document.getElementById('shadowingSpeedSlider');
    const speedValue = document.getElementById('shadowingSpeedValue');
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        currentSpeed = parseFloat(e.target.value);
        if (speedValue) speedValue.textContent = `${currentSpeed.toFixed(1)}x`;
        if (typeof Speech !== 'undefined') {
          Speech.setRate(currentSpeed);
        }
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

    // Listen for week data updates
    AppState.on('weekData', (data) => {
      if (data && data.days) {
        availableDays = data.days.map(d => ({
          day: d.day,
          title: d.title,
          titleCn: d.titleCn,
          titleEn: d.titleEn
        }));
        renderDaySelector();
        updateDayTitle();
      }
    });
  }

  function renderSentenceList() {
    const container = document.getElementById('shadowingList');
    if (!container) return;

    if (shadowingData.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-icon">🎧</div><p>暂无跟读数据</p></div>';
      return;
    }

    container.innerHTML = shadowingData.map((item, index) => {
      const key = `${currentDay}_${item.id || index}`;
      const isCompleted = completedShadowing.has(key);
      return `
        <div class="shadowing-item ${index === currentIndex ? 'active' : ''} ${isCompleted ? 'completed' : ''}" 
             data-index="${index}" 
             onclick="ShadowingPage.selectSentence(${index})">
          <div class="shadowing-number">${index + 1}</div>
          <div class="shadowing-content">
            <div class="shadowing-sentence">${item.sentence || item.text || ''}</div>
            <div class="shadowing-translation">${item.translation || ''}</div>
          </div>
          <div class="shadowing-status">
            ${isCompleted ? '✅' : (item.difficulty === 'easy' ? '🟢' : '🟡')}
          </div>
        </div>
      `;
    }).join('');
  }

  function renderPlayer() {
    const currentItem = shadowingData[currentIndex];
    
    const sentenceDisplay = document.getElementById('shadowingSentenceDisplay');
    const translationDisplay = document.getElementById('shadowingTranslationDisplay');
    const yourTurnIndicator = document.getElementById('yourTurnIndicator');
    const progressDisplay = document.getElementById('shadowingProgress');

    if (!currentItem) {
      if (sentenceDisplay) sentenceDisplay.textContent = '选择一个句子开始跟读';
      if (translationDisplay) translationDisplay.textContent = '';
      if (progressDisplay) progressDisplay.textContent = '0 / 0';
      return;
    }

    if (sentenceDisplay) {
      sentenceDisplay.textContent = currentItem.sentence || currentItem.text || '';
    }

    if (translationDisplay) {
      translationDisplay.textContent = currentItem.translation || '';
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
    if (!currentItem || typeof Speech === 'undefined') return;

    isPlaying = true;
    isPausedForUser = false;
    renderPlayer();

    const text = currentItem.sentence || currentItem.text || '';
    const duration = (text.length * 80) / currentSpeed;

    Speech.speak(text, currentSpeed);

    setTimeout(() => {
      isPausedForUser = true;
      isPlaying = false;
      renderPlayer();
      markCurrentCompleted();
      // Count toward progress only when actually completing a shadowing exercise
      AppState.incrementShadowing(1);
      Storage.incrementShadowingCompleted();
      // Update HomePage if available
      if (typeof HomePage !== 'undefined' && HomePage.updateStats) {
        HomePage.updateStats();
      }
    }, duration);
  }

  function markCurrentCompleted() {
    const currentItem = shadowingData[currentIndex];
    if (currentItem) {
      const key = `${currentDay}_${currentItem.id || currentIndex}`;
      completedShadowing.add(key);
      saveCompletedShadowing();
      renderSentenceList();
      checkDayCompletion();
    }
  }

  function checkDayCompletion() {
    const dayShadowingCount = shadowingData.length;
    const completedToday = shadowingData.filter(s => completedShadowing.has(`${currentDay}_${s.id || shadowingData.indexOf(s)}`)).length;
    
    if (dayShadowingCount > 0 && completedToday >= dayShadowingCount * 0.8) {
      DayLoader.markDayCompleted(currentDay);
      console.log(`🎉 Day ${currentDay} shadowing completed!`);
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
 * Track and display learning progress using AppState and LocalStorage
 */
const ProgressPage = (function() {
  let isInitialized = false;

  function init() {
    if (isInitialized) return;
    
    console.log('📊 Initializing ProgressPage...');
    
    updateProgressDisplay();
    renderHistory();
    renderAchievements();
    setupEventListeners();
    
    // Listen for state changes
    AppState.on('learnedWords', updateProgressDisplay);
    AppState.on('patternsPracticed', updateProgressDisplay);
    AppState.on('shadowingCompleted', updateProgressDisplay);
    AppState.on('streak', updateProgressDisplay);
    
    isInitialized = true;
    console.log('✅ ProgressPage initialized');
  }

  function setupEventListeners() {
    const resetBtn = document.getElementById('resetProgressBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('确定要重置所有学习进度吗？此操作不可撤销。')) {
          Storage.clearAll();
          // Reset AppState
          location.reload();
        }
      });
    }
  }

  function updateProgressDisplay() {
    const stats = AppState.getStats();
    const progress = Storage.getProgress();
    const streak = Storage.getStreak();

    // Update main stats - use unique IDs for progress page
    updateStat('progressWordsLearned', stats.learnedWords);
    updateStat('progressPatternsPracticed', stats.patternsPracticed);
    updateStat('progressShadowingCompleted', stats.shadowingCompleted);
    updateStat('progressStreakCount', streak.current);

    // Update progress bars
    const totalWords = progress.totalWords || stats.totalWords || 587;
    const wordsTarget = Math.max(20, totalWords);
    
    updateProgressBar('progressWordsBar', stats.learnedWords, wordsTarget);
    updateProgressBar('progressPatternsBar', stats.patternsPracticed, 50);
    updateProgressBar('progressShadowingBar', stats.shadowingCompleted, 50);
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

  function updateProgressBar(barId, current, total) {
    const bar = document.getElementById(barId);
    const text = document.getElementById(barId.replace('Bar', 'Text'));
    
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

    const stats = AppState.getStats();
    const streak = Storage.getStreak();

    const achievements = [
      {
        id: 'first_word',
        icon: '🎯',
        title: '初次学习',
        description: '学习第一个单词',
        unlocked: stats.learnedWords >= 1
      },
      {
        id: 'word_master',
        icon: '📚',
        title: '词汇达人',
        description: '学习10个单词',
        unlocked: stats.learnedWords >= 10
      },
      {
        id: 'word_expert',
        icon: '📖',
        title: '词汇专家',
        description: '学习50个单词',
        unlocked: stats.learnedWords >= 50
      },
      {
        id: 'pattern_pro',
        icon: '🔄',
        title: '句型高手',
        description: '完成10次句型练习',
        unlocked: stats.patternsPracticed >= 10
      },
      {
        id: 'shadowing_star',
        icon: '🎤',
        title: '跟读之星',
        description: '完成5次跟读练习',
        unlocked: stats.shadowingCompleted >= 5
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
      },
      {
        id: 'streak_30',
        icon: '💎',
        title: '坚持30天',
        description: '连续学习30天',
        unlocked: streak.current >= 30
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
 * Thin coordinator using AppState as single source of truth
 */
const App = (function() {
  let isInitialized = false;

  async function init() {
    if (isInitialized) return;
    
    console.log('🚀 Initializing LinguaDrill...');

    // Initialize AppState first (this loads persisted state)
    AppState.init();

    // Initialize Navigation (uses AppState)
    Navigation.init();

    // Initialize utilities - await to ensure data is loaded before page init
    await initUtilities();

    // Initialize all pages - they will use pre-loaded data from AppState
    initPages();

    // Setup global event listeners
    setupGlobalListeners();

    // Translate UI
    if (typeof I18n !== 'undefined') {
      I18n.translatePage();
    }

    isInitialized = true;
    console.log('🎯 LinguaDrill initialized successfully!');
  }

  function initUtilities() {
    // Load speech settings
    const settings = Storage.getSettings();
    if (settings.speechRate && typeof Speech !== 'undefined') {
      Speech.setRate(settings.speechRate);
    }

    // Pre-load week data
    loadWeekData();
  }

  async function loadWeekData() {
    console.log('📚 Loading week data...');
    try {
      const weekData = await DayLoader.loadWeek1();
      if (weekData) {
        AppState.setWeekData(weekData);
        console.log('✅ Week data loaded:', {
          days: weekData.days?.length,
          totalWords: weekData.days?.reduce((sum, d) => sum + (d.words?.length || 0), 0)
        });
        
        // Notify pages that data is ready
        if (typeof WordsPage !== 'undefined' && WordsPage.onDataReady) {
          WordsPage.onDataReady(weekData);
        }
      }
    } catch (error) {
      console.error('❌ Failed to load week data:', error);
      AppState.set('error', error.message);
    }
  }

  async function initPages() {
    // WordsPage needs to wait for data before initializing
    const pagePromises = [];
    
    // WordsPage should initialize after data is loaded
    if (typeof WordsPage !== 'undefined' && WordsPage.init) {
      pagePromises.push(
        WordsPage.init().catch(e => console.error('Failed to init WordsPage:', e))
      );
    }
    
    // Other pages can initialize in parallel
    ['HomePage', 'PatternsPage', 'ShadowingPage', 'ProgressPage'].forEach(pageName => {
      if (typeof window[pageName] !== 'undefined' && window[pageName].init) {
        try {
          window[pageName].init();
        } catch (e) {
          console.error(`Failed to init ${pageName}:`, e);
        }
      }
    });
    
    // Wait for async page inits to complete
    await Promise.all(pagePromises);
  }

  function setupGlobalListeners() {
    // Language toggle
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
      langToggle.addEventListener('click', () => {
        if (typeof I18n !== 'undefined') {
          const currentLang = I18n.getLanguage();
          const newLang = currentLang === 'zh' ? 'en' : 'zh';
          I18n.setLanguage(newLang);
          I18n.translatePage();
          updateLangToggleText();
        }
      });
    }

    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // ESC to go home
      if (e.key === 'Escape') {
        navigateTo('home');
      }
      // Space to toggle play (when on words page)
      if (e.key === ' ' && AppState.get('currentPage') === 'words') {
        e.preventDefault();
        if (typeof WordsPage !== 'undefined' && WordsPage.playCurrentWord) {
          WordsPage.playCurrentWord();
        }
      }
      // Shadowing page keyboard shortcuts
      if (AppState.get('currentPage') === 'shadowing') {
        if (e.key === 'ArrowRight' || e.key === 'n') {
          e.preventDefault();
          if (typeof ShadowingPage !== 'undefined' && ShadowingPage.nextSentence) {
            ShadowingPage.nextSentence();
          }
        }
        if (e.key === 'ArrowLeft' || e.key === 'p') {
          e.preventDefault();
          if (typeof ShadowingPage !== 'undefined' && ShadowingPage.prevSentence) {
            ShadowingPage.prevSentence();
          }
        }
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          if (typeof ShadowingPage !== 'undefined' && ShadowingPage.playCurrent) {
            ShadowingPage.playCurrent();
          }
        }
      }
    });

    // Pause speech on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && typeof Speech !== 'undefined') {
        Speech.pause();
      }
    });

    // Prevent double-tap zoom on mobile
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, false);

    // Handle page visibility
    AppState.on('currentPage', (pageId) => {
      Storage.updateStreak();
      updateHeaderStats();
    });
  }

  function navigateTo(pageId) {
    AppState.navigateTo(pageId);
  }

  function updateLangToggleText() {
    const langToggle = document.getElementById('langToggle');
    if (langToggle && typeof I18n !== 'undefined') {
      const span = langToggle.querySelector('span');
      if (span) {
        span.textContent = I18n.getLanguage() === 'zh' ? 'English' : '中文';
      }
    }
  }

  function updateHeaderStats() {
    const stats = AppState.getStats();
    const headerStreak = document.getElementById('header-streak');
    const headerLearned = document.getElementById('header-learned');
    
    if (headerStreak) headerStreak.textContent = stats.streak;
    if (headerLearned) headerLearned.textContent = stats.learnedWords;
  }

  function toggleLanguage() {
    if (typeof I18n !== 'undefined') {
      const currentLang = I18n.getLanguage();
      const newLang = currentLang === 'zh' ? 'en' : 'zh';
      I18n.setLanguage(newLang);
      I18n.translatePage();
      updateLangToggleText();
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    navigateTo,
    toggleLanguage,
    refreshCurrentPage: () => AppState.refreshPage(AppState.get('currentPage'))
  };
})();

// Expose App globally
window.App = App;


