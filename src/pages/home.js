const HomePage = (function() {

  // Daily goal target
  const DAILY_GOAL = 20;

  function init() {
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
      startBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        navigateTo('words');
      });
    }
    updateStats();
    updateGoalProgress();
  }

  function refresh() {
    updateStats();
    updateGoalProgress();
  }

  /**
   * Update all stat displays across the dashboard
   */
  function updateStats() {
    const learnedWords = Storage.getLearnedWords().length;
    const streak = Storage.getStreak();
    const drillsCompleted = Storage.getCompletedDrills().length;
    const shadowingCompleted = Storage.getShadowingSessions().length;

    // Header stats
    const headerStreak = document.getElementById('header-streak');
    const headerLearned = document.getElementById('header-learned');
    if (headerStreak) headerStreak.textContent = streak;
    if (headerLearned) headerLearned.textContent = learnedWords;

    // Quick stats row (Metro pills)
    const homeWordsCount = document.getElementById('homeWordsCount');
    const homePatternsCount = document.getElementById('homePatternsCount');
    const homeShadowingCount = document.getElementById('homeShadowingCount');
    if (homeWordsCount) homeWordsCount.textContent = learnedWords;
    if (homePatternsCount) homePatternsCount.textContent = drillsCompleted;
    if (homeShadowingCount) homeShadowingCount.textContent = shadowingCompleted;

    // Streak in progress tile
    const homeStreakDisplay = document.getElementById('homeStreakDisplay');
    if (homeStreakDisplay) homeStreakDisplay.textContent = streak + '天';

    // Module stats
    const wordsLearned = document.getElementById('wordsLearned');
    const patternsCompleted = document.getElementById('patternsCompleted');
    const shadowingComp = document.getElementById('shadowingCompleted');

    if (wordsLearned) wordsLearned.textContent = learnedWords + '/587';
    if (patternsCompleted) patternsCompleted.textContent = drillsCompleted;
    if (shadowingComp) shadowingComp.textContent = shadowingCompleted;

    // Metro progress rings
    updateProgressRing('wordsProgress', learnedWords, 587);
    updateProgressRing('patternsProgress', drillsCompleted, 50);
    updateProgressRing('shadowingProgress', shadowingCompleted, 50);
    updateProgressRing('progressProgress', streak, 30);
  }

  /**
   * Update a metro progress ring element
   * @param {string} id - Element ID
   * @param {number} current - Current value
   * @param {number} total - Total value
   */
  function updateProgressRing(id, current, total) {
    const el = document.getElementById(id);
    if (!el) return;
    const pct = Math.min((current / total) * 360, 360);
    const remaining = 360 - pct;
    el.style.background = `conic-gradient(var(--tile-color, var(--primary-color)) ${pct}deg, var(--border-color) ${pct}deg)`;
    el.textContent = current > 0 ? Math.round((current / total) * 100) + '%' : '';
  }

  /**
   * Update the daily goal progress bar and counter
   */
  function updateGoalProgress() {
    const learnedWords = Storage.getLearnedWords().length;
    const goalCurrent = document.getElementById('goalCurrent');
    const goalTarget = document.getElementById('goalTarget');
    const goalBarFill = document.getElementById('goalBarFill');
    const dailyGoalText = document.getElementById('dailyGoalText');

    const todayTotal = learnedWords; // simplified: use total learned as today's progress
    const pct = Math.min((todayTotal / DAILY_GOAL) * 100, 100);

    if (goalCurrent) goalCurrent.textContent = todayTotal;
    if (goalTarget) goalTarget.textContent = DAILY_GOAL;
    if (goalBarFill) goalBarFill.style.width = pct + '%';
    if (dailyGoalText) {
      if (pct >= 100) {
        dailyGoalText.textContent = '🎉 今日目标已完成！';
      } else {
        dailyGoalText.textContent = `完成 ${DAILY_GOAL} 个词汇`;
      }
    }
  }

  return {
    init: init,
    refresh: refresh,
    updateStats: updateStats
  };
})();
