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

    // Update home page cards
    const wordsLearned = document.getElementById('wordsLearned');
    const patternsCompleted = document.getElementById('patternsCompleted');
    const shadowingComp = document.getElementById('shadowingCompleted');
    const streakCount = document.getElementById('streakCount');

    if (wordsLearned) wordsLearned.textContent = learnedWords + '/587';
    if (patternsCompleted) patternsCompleted.textContent = drillsCompleted;
    if (shadowingComp) shadowingComp.textContent = shadowingCompleted;
    if (streakCount) streakCount.textContent = streak;
  }

  return {
    init: init,
    refresh: refresh,
    updateStats: updateStats
  };
})();