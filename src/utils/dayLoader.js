/**
 * Day Loader - Dynamic content loader for daily learning data
 * Supports loading day1.json through day30.json
 */
const DayLoader = (function() {
  let currentDay = 1;
  let currentData = null;
  let loadingError = null;

  /**
   * Show error message to user in a page container
   */
  function showErrorMessage(containerId, message, retryCallback) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="loading-error">
        <div class="error-icon">⚠️</div>
        <div class="error-message">${message}</div>
        <div class="error-hint">请确保使用 HTTP 服务器运行（而非直接打开文件）</div>
        ${retryCallback ? `<button class="retry-btn" onclick="(${retryCallback.toString()})()">🔄 重试</button>` : ''}
      </div>
    `;
  }

  async function loadDay(dayNumber) {
    loadingError = null;
    
    try {
      const response = await fetch(`src/data/day${dayNumber}.json`);
      
      if (!response.ok) {
        throw new Error(`Day ${dayNumber} data not found (HTTP ${response.status})`);
      }
      
      currentData = await response.json();
      currentDay = dayNumber;
      loadingError = null;
      return currentData;
      
    } catch (error) {
      console.error(`Failed to load day ${dayNumber}:`, error);
      loadingError = error.message;
      currentData = null;
      
      // Show user-friendly error message
      let errorMessage = `加载 Day ${dayNumber} 数据失败`;
      
      if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
        errorMessage = '无法加载数据：请使用 HTTP 服务器运行（Python: python -m http.server 或 VS Code Live Server）';
      }
      
      return null;
    }
  }

  function getCurrentDay() {
    return currentDay;
  }

  function getCurrentData() {
    return currentData;
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
    return currentData ? {
      day: currentData.day,
      title: currentData.title,
      titleEn: currentData.titleEn
    } : null;
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

  return {
    loadDay,
    getCurrentDay,
    getCurrentData,
    getWords,
    getPatterns,
    getShadowing,
    getDayInfo,
    loadNextDay,
    loadPreviousDay
  };
})();