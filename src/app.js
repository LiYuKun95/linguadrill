/**
 * LinguaDrill Main Application
 * Initialize and coordinate all modules
 */
const App = (function() {
  let currentPage = 'home';

  function init() {
    // Initialize utilities first
    initUtilities();
    
    // Initialize navigation
    Navigation.init();
    
    // Initialize all pages
    initPages();
    
    // Setup global event listeners
    setupEventListeners();
    
    // Apply initial translations
    I18n.translatePage();
    
    console.log('🎯 LinguaDrill initialized successfully!');
  }

  function initUtilities() {
    // Set initial speech rate from storage
    const settings = Storage.getSettings();
    if (settings.speechRate) {
      Speech.setRate(settings.speechRate);
    }
  }

  function initPages() {
    // Initialize each page module
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
    // Language toggle
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
      langToggle.addEventListener('click', toggleLanguage);
    }

    // Start button on home page
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        Navigation.navigateTo('words');
      });
    }

    // Listen for page changes
    window.addEventListener('pageChange', (e) => {
      currentPage = e.detail.page;
      onPageChange(currentPage);
    });

    // Listen for language changes
    window.addEventListener('languageChange', () => {
      I18n.translatePage();
      updateLangToggle();
    });

    // Handle visibility change (pause speech when tab hidden)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        Speech.pause();
      }
    });

    // Prevent zoom on double tap for mobile
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

  function onPageChange(page) {
    // Save current page to storage
    localStorage.setItem('linguadrill_last_page', page);
    
    // Refresh progress page when navigated to
    if (page === 'progress' && typeof ProgressPage !== 'undefined') {
      ProgressPage.refresh();
    }

    // Track study session
    Storage.updateStreak();
  }

  function getCurrentPage() {
    return currentPage;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    getCurrentPage
  };
})();