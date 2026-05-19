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
