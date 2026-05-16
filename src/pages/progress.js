/**
 * Learning Progress System
 * Track and display learning progress using LocalStorage
 */
const ProgressPage = (function() {
  function init() {
    updateProgressDisplay();
    renderHistory();
    renderAchievements();
  }

  function updateProgressDisplay() {
    const progress = Storage.getProgress();
    const streak = Storage.getStreak();

    // Update main stats
    updateStat('wordsLearned', progress.wordsLearned);
    updateStat('patternsPracticed', progress.patternsPracticed);
    updateStat('shadowingCompleted', progress.shadowingCompleted);
    updateStat('streakCount', streak.current);

    // Update progress bars
    updateProgressBar('wordsProgress', progress.wordsLearned, progress.totalWords || 20);
    updateProgressBar('patternsProgress', progress.patternsPracticed, progress.totalPatterns || 8);
    updateProgressBar('shadowingProgress', progress.shadowingCompleted, progress.totalShadowing || 10);
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

  function updateProgressBar(elementId, current, total) {
    const bar = document.getElementById(elementId);
    const text = document.getElementById(elementId + 'Text');
    
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

    const progress = Storage.getProgress();
    const streak = Storage.getStreak();

    const achievements = [
      {
        id: 'first_word',
        icon: '🎯',
        title: '初次学习',
        description: '学习第一个单词',
        unlocked: progress.wordsLearned >= 1
      },
      {
        id: 'word_master',
        icon: '📚',
        title: '词汇达人',
        description: '学习10个单词',
        unlocked: progress.wordsLearned >= 10
      },
      {
        id: 'pattern_pro',
        icon: '🔄',
        title: '句型高手',
        description: '完成10次句型练习',
        unlocked: progress.patternsPracticed >= 10
      },
      {
        id: 'shadowing_star',
        icon: '🎤',
        title: '跟读之星',
        description: '完成5次跟读练习',
        unlocked: progress.shadowingCompleted >= 5
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