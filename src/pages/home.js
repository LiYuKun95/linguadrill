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