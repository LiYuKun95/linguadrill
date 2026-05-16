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