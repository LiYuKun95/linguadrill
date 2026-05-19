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
      // Already updated today
      return;
    } else if (state.lastDate === yesterdayStr) {
      // Consecutive day
      state.streak++;
    } else {
      // Streak broken or first day
      state.streak = Math.max(1, state.streak);
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
