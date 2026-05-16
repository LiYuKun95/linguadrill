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
