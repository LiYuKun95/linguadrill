const Storage = (function() {
  const STORAGE_KEYS = {
    PROGRESS: 'linguadrill_progress',
    HISTORY: 'linguadrill_history',
    STREAK: 'linguadrill_streak',
    SETTINGS: 'linguadrill_settings'
  };

  function getDefaultProgress() {
    return {
      wordsLearned: 0,
      patternsPracticed: 0,
      shadowingCompleted: 0,
      totalWords: 0,
      totalPatterns: 0,
      totalShadowing: 0,
      completedDays: [],
      currentStreak: 0
    };
  }

  function getDefaultSettings() {
    return {
      language: 'zh',
      speechRate: 1,
      darkMode: false
    };
  }

  return {
    getProgress: function() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
        return data ? JSON.parse(data) : getDefaultProgress();
      } catch {
        return getDefaultProgress();
      }
    },

    saveProgress: function(progress) {
      try {
        localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
      } catch (e) {
        console.error('Failed to save progress:', e);
      }
    },

    incrementWordsLearned: function(count = 1) {
      const progress = this.getProgress();
      progress.wordsLearned += count;
      this.saveProgress(progress);
      this.updateHistory('words', count);
    },

    incrementPatternsPracticed: function(count = 1) {
      const progress = this.getProgress();
      progress.patternsPracticed += count;
      this.saveProgress(progress);
      this.updateHistory('patterns', count);
    },

    incrementShadowingCompleted: function(count = 1) {
      const progress = this.getProgress();
      progress.shadowingCompleted += count;
      this.saveProgress(progress);
      this.updateHistory('shadowing', count);
    },

    setTotalCounts: function(words, patterns, shadowing) {
      const progress = this.getProgress();
      progress.totalWords = words;
      progress.totalPatterns = patterns;
      progress.totalShadowing = shadowing;
      this.saveProgress(progress);
    },

    getHistory: function() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
        return data ? JSON.parse(data) : [];
      } catch {
        return [];
      }
    },

    updateHistory: function(type, count) {
      const history = this.getHistory();
      const today = new Date().toISOString().split('T')[0];
      const todayEntry = history.find(h => h.date === today);

      if (todayEntry) {
        todayEntry[type] = (todayEntry[type] || 0) + count;
        todayEntry.total = (todayEntry.total || 0) + count;
      } else {
        history.push({
          date: today,
          words: type === 'words' ? count : 0,
          patterns: type === 'patterns' ? count : 0,
          shadowing: type === 'shadowing' ? count : 0,
          total: count
        });
      }

      try {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(-30)));
      } catch (e) {
        console.error('Failed to save history:', e);
      }

      this.updateStreak();
    },

    getStreak: function() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.STREAK);
        return data ? JSON.parse(data) : { current: 0, lastDate: null };
      } catch {
        return { current: 0, lastDate: null };
      }
    },

    updateStreak: function() {
      const streak = this.getStreak();
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      if (streak.lastDate === todayStr) {
        return;
      }

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (streak.lastDate === yesterdayStr) {
        streak.current += 1;
      } else if (streak.lastDate !== todayStr) {
        streak.current = 1;
      }

      streak.lastDate = todayStr;

      try {
        localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
      } catch (e) {
        console.error('Failed to save streak:', e);
      }
    },

    getSettings: function() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return data ? JSON.parse(data) : getDefaultSettings();
      } catch {
        return getDefaultSettings();
      }
    },

    saveSettings: function(settings) {
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      } catch (e) {
        console.error('Failed to save settings:', e);
      }
    },

    setSpeechRate: function(rate) {
      const settings = this.getSettings();
      settings.speechRate = rate;
      this.saveSettings(settings);
    },

    getSpeechRate: function() {
      return this.getSettings().speechRate;
    },

    clearAll: function() {
      try {
        localStorage.removeItem(STORAGE_KEYS.PROGRESS);
        localStorage.removeItem(STORAGE_KEYS.HISTORY);
        localStorage.removeItem(STORAGE_KEYS.STREAK);
        localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      } catch (e) {
        console.error('Failed to clear storage:', e);
      }
    }
  };
})();