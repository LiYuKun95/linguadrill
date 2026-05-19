/**
 * Day Loader - Dynamic content loader for learning data
 * Supports loading week1.json (full week) and individual days
 */
const DayLoader = (function() {
  let currentWeek = null;
  let currentDay = 1;
  let currentData = null;
  let loadingError = null;

  async function loadWeek1() {
    loadingError = null;
    try {
      const response = await fetch('data/week1.json');
      if (!response.ok) {
        throw new Error(`Week 1 data not found (HTTP ${response.status})`);
      }
      currentWeek = await response.json();
      return currentWeek;
    } catch (error) {
      console.error('Failed to load week 1:', error);
      loadingError = error.message;
      currentWeek = null;
      return null;
    }
  }

  async function loadDay(dayNumber) {
    loadingError = null;
    if (!currentWeek) {
      console.log(`DayLoader: currentWeek not loaded, loading Week 1 first...`);
      await loadWeek1();
    }
    
    if (currentWeek && currentWeek.days) {
      const dayData = currentWeek.days.find(d => d.day === dayNumber);
      if (dayData) {
        console.log(`DayLoader: Found Day ${dayNumber} in week data`);
        currentData = dayData;
        currentDay = dayNumber;
        return dayData;
      } else {
        console.warn(`DayLoader: Day ${dayNumber} not found in week data, trying individual file...`);
      }
    }
    
    // Fallback to individual day file
    try {
      console.log(`DayLoader: Trying to load data/day${dayNumber}.json...`);
      const response = await fetch(`data/day${dayNumber}.json`);
      if (!response.ok) {
        throw new Error(`Day ${dayNumber} data not found (HTTP ${response.status})`);
      }
      currentData = await response.json();
      currentDay = dayNumber;
      console.log(`DayLoader: Successfully loaded data/day${dayNumber}.json`);
      return currentData;
    } catch (error) {
      console.error(`Failed to load day ${dayNumber}:`, error);
      loadingError = error.message;
      currentData = null;
      return null;
    }
  }

  function getCurrentDay() {
    return currentDay;
  }

  function getCurrentData() {
    return currentData;
  }

  function getWeekData() {
    return currentWeek;
  }

  function getWords() {
    return currentData ? currentData.words : [];
  }

  function getPatterns() {
    return currentData ? currentData.patterns : [];
  }

  function getShadowing() {
    return currentData ? currentData.shadowing : [];
  }

  function getDayInfo() {
    if (currentData) {
      return {
        day: currentData.day,
        title: currentData.title || currentData.titleCn,
        titleCn: currentData.titleCn,
        titleEn: currentData.titleEn || currentData.title,
        focus: currentData.focus,
        focusCn: currentData.focusCn
      };
    }
    return null;
  }

  function getAvailableDays() {
    if (currentWeek && currentWeek.days) {
      return currentWeek.days.map(d => ({
        day: d.day,
        title: d.title,
        titleCn: d.titleCn
      }));
    }
    return [];
  }

  async function loadNextDay() {
    const nextDay = currentDay + 1;
    const data = await loadDay(nextDay);
    if (data) {
      return data;
    }
    return null;
  }

  async function loadPreviousDay() {
    if (currentDay > 1) {
      const prevDay = currentDay - 1;
      return await loadDay(prevDay);
    }
    return null;
  }

  function isDayUnlocked(dayNumber) {
    if (dayNumber <= 1) return true;
    const progress = Storage.getProgress();
    return progress.completedDays && progress.completedDays.includes(dayNumber - 1);
  }

  function markDayCompleted(dayNumber) {
    const progress = Storage.getProgress();
    if (!progress.completedDays) {
      progress.completedDays = [];
    }
    if (!progress.completedDays.includes(dayNumber)) {
      progress.completedDays.push(dayNumber);
      Storage.saveProgress(progress);
    }
  }

  return {
    loadWeek1,
    loadDay,
    getCurrentDay,
    getCurrentData,
    getWeekData,
    getWords,
    getPatterns,
    getShadowing,
    getDayInfo,
    getAvailableDays,
    loadNextDay,
    loadPreviousDay,
    isDayUnlocked,
    markDayCompleted
  };
})();
