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
