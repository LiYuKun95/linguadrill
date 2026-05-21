/**
 * Vocabulary Training Module
 * Features: speech playback, day selection, adjustable speed, repeat mode, mark as learned
 * Uses AppState for global state management
 */
const WordsPage = (function() {
  let wordsData = [];
  let availableDays = [];
  let currentSpeed = 1;
  let isRepeatMode = false;
  let currentDay = 1;
  let isInitialized = false;
  let currentWordIndex = -1;
  let searchQuery = '';

  /**
   * Initialize the Words page
   */
  async function init() {
    if (isInitialized) return;
    
    console.log('📖 Initializing WordsPage...');
    
    setupEventListeners();
    
    // Wait for week data to be available
    await loadWeekData();
    
    // Load initial day
    await loadDay(currentDay);
    
    isInitialized = true;
    console.log('✅ WordsPage initialized');
  }

  /**
   * Called when week data is ready
   */
  async function onDataReady(weekData) {
    console.log('📚 WordsPage received week data');
    availableDays = weekData.days.map(d => ({
      day: d.day,
      title: d.title,
      titleCn: d.titleCn,
      titleEn: d.titleEn
    }));
    renderDaySelector();
    updateDayTitle();
  }

  /**
   * Load week data from AppState or DayLoader
   */
  async function loadWeekData() {
    // First check if AppState has the data
    const weekData = AppState.get('weekData');
    
    if (weekData && weekData.days) {
      availableDays = weekData.days.map(d => ({
        day: d.day,
        title: d.title,
        titleCn: d.titleCn,
        titleEn: d.titleEn
      }));
    } else {
      // Load from DayLoader
      const data = await DayLoader.loadWeek1();
      if (data && data.days) {
        AppState.setWeekData(data);
        availableDays = data.days.map(d => ({
          day: d.day,
          title: d.title,
          titleCn: d.titleCn,
          titleEn: d.titleEn
        }));
      }
    }
    
    renderDaySelector();
  }

  /**
   * Load a specific day's data
   */
  async function loadDay(dayNumber) {
    console.log(`📅 Loading day ${dayNumber}...`);
    
    try {
      // Load from DayLoader
      const data = await DayLoader.loadDay(dayNumber);
      
      if (data) {
        wordsData = data.words || [];
        currentDay = dayNumber;
        currentWordIndex = -1;
        
        // Update AppState
        AppState.setDayData(data);
        AppState.set('currentDay', dayNumber);
        
        updateDayTitle();
        renderWords();
        
        console.log(`✅ Day ${dayNumber} loaded: ${wordsData.length} words`);
      } else {
        console.error(`❌ Failed to load day ${dayNumber}`);
        showEmptyState();
      }
    } catch (error) {
      console.error('Error loading day:', error);
      showEmptyState();
    }
  }

  /**
   * Show empty state when no data
   */
  function showEmptyState() {
    const container = document.getElementById('wordsList');
    if (container) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📚</div>
          <p>加载数据中...</p>
          <button onclick="WordsPage.refresh()">重试</button>
        </div>
      `;
    }
  }

  /**
   * Update day title
   */
  function updateDayTitle() {
    const titleEl = document.getElementById('wordsDayTitle');
    if (titleEl && availableDays.length > 0) {
      const dayInfo = availableDays.find(d => d.day === currentDay);
      if (dayInfo) {
        titleEl.textContent = `Day ${currentDay}: ${dayInfo.titleCn || dayInfo.title}`;
      }
    }
  }

  /**
   * Render day selector buttons
   */
  function renderDaySelector() {
    const container = document.getElementById('daySelector');
    if (!container) return;

    if (availableDays.length === 0) {
      container.innerHTML = '<span class="loading-text">加载中...</span>';
      return;
    }

    container.innerHTML = availableDays.map(day => {
      const isActive = day.day === currentDay;
      const isUnlocked = DayLoader.isDayUnlocked(day.day);
      return `
        <button class="day-btn ${isActive ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}"
                onclick="WordsPage.selectDay(${day.day})"
                ${!isUnlocked ? 'disabled' : ''}>
          ${I18n.t('day')} ${day.day}
        </button>
      `;
    }).join('');
  }

  /**
   * Select a day
   */
  function selectDay(dayNumber) {
    if (!DayLoader.isDayUnlocked(dayNumber)) {
      console.log(`Day ${dayNumber} is locked`);
      return;
    }
    loadDay(dayNumber);
    renderDaySelector();
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Speed slider
    const speedSlider = document.getElementById('wordSpeedSlider');
    const speedValue = document.getElementById('wordSpeedValue');
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        currentSpeed = parseFloat(e.target.value);
        if (speedValue) speedValue.textContent = `${currentSpeed.toFixed(1)}x`;
        if (typeof Speech !== 'undefined') {
          Speech.setRate(currentSpeed);
        }
      });
    }

    // Repeat mode toggle
    const repeatBtn = document.getElementById('repeatModeBtn');
    if (repeatBtn) {
      repeatBtn.addEventListener('click', () => {
        isRepeatMode = !isRepeatMode;
        repeatBtn.classList.toggle('active', isRepeatMode);
        repeatBtn.textContent = isRepeatMode ? '🔁 重复3次: 开' : '🔁 重复3次: 关';
      });
    }

    // Listen for data ready event
    AppState.on('weekData', (data) => {
      if (data && data.days) {
        availableDays = data.days.map(d => ({
          day: d.day,
          title: d.title,
          titleCn: d.titleCn,
          titleEn: d.titleEn
        }));
        renderDaySelector();
        updateDayTitle();
      }
    });

    // Search input
    const searchInput = document.getElementById('wordSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        renderWords();
      });
    }
  }

  /**
   * Render the vocabulary list
   */
  function renderWords() {
    const container = document.getElementById('wordsList');
    if (!container) return;

    if (wordsData.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📚</div>
          <p>暂无词汇数据</p>
        </div>
      `;
      return;
    }

    // Filter by search query
    let filtered = wordsData;
    if (searchQuery) {
      filtered = wordsData.filter(w =>
        w.word.toLowerCase().includes(searchQuery) ||
        (w.translation && w.translation.includes(searchQuery)) ||
        (w.phonetic && w.phonetic.toLowerCase().includes(searchQuery))
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <p>没有匹配的词汇</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map((word, index) => {
      const realIndex = wordsData.indexOf(word);
      const isLearned = AppState.isWordLearned(currentDay, word.word);
      return `
        <div class="word-card ${isLearned ? 'learned' : ''}" data-index="${realIndex}">
          <div class="word-header">
            <div class="word-main">
              <span class="word-text" onclick="WordsPage.playWord(${realIndex})">${word.word}</span>
              <span class="word-phonetic">${word.phonetic || ''}</span>
            </div>
            <button class="word-audio-btn" onclick="WordsPage.playWord(${realIndex})" aria-label="播放发音">
              🔊
            </button>
          </div>
          <div class="word-translation">${word.translation || ''}</div>
          <div class="word-example">"${word.example || ''}"</div>
          <div class="word-example-cn">${word.exampleCn || ''}</div>
          <div class="word-actions">
            <button class="word-action-btn ${isLearned ? 'learned' : ''}"
                    onclick="WordsPage.toggleLearned('${word.word.replace(/'/g, "\\'")}')">
              ${isLearned ? '✅ 已学会' : '⭕ 标记为已学'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Show filter result count if searching
    if (searchQuery) {
      const countEl = document.createElement('div');
      countEl.className = 'search-result-count';
      countEl.textContent = `找到 ${filtered.length} / ${wordsData.length} 个词汇`;
      container.prepend(countEl);
    }
  }

  /**
   * Play word pronunciation
   */
  function playWord(index) {
    const word = wordsData[index];
    if (!word || typeof Speech === 'undefined') return;

    currentWordIndex = index;

    if (isRepeatMode) {
      Speech.speak(word.word, currentSpeed);
      setTimeout(() => Speech.speak(word.word, currentSpeed), 1000);
      setTimeout(() => Speech.speak(word.word, currentSpeed), 2000);
    } else {
      Speech.speak(word.word, currentSpeed);
    }
  }

  /**
   * Play the current word (for keyboard shortcut)
   */
  function playCurrentWord() {
    if (currentWordIndex >= 0 && currentWordIndex < wordsData.length) {
      playWord(currentWordIndex);
    } else if (wordsData.length > 0) {
      playWord(0);
    }
  }

  /**
   * Toggle word learned status
   */
  function toggleLearned(word) {
    const isLearned = AppState.isWordLearned(currentDay, word);
    
    if (isLearned) {
      AppState.unmarkWordLearned(currentDay, word);
    } else {
      AppState.markWordLearned(currentDay, word);
    }

    // Re-render
    renderWords();
    
    // Check for day completion
    checkDayCompletion();
    
    // Update global stats display
    AppState.updateHeaderStats();
    
    // Update HomePage if available
    if (typeof HomePage !== 'undefined' && HomePage.updateStats) {
      HomePage.updateStats();
    }
  }

  /**
   * Check if day is completed (80% learned)
   */
  function checkDayCompletion() {
    const dayWordsCount = wordsData.length;
    const learnedToday = AppState.getDayLearnedWords(currentDay).length;
    
    if (dayWordsCount > 0 && learnedToday >= dayWordsCount * 0.8) {
      DayLoader.markDayCompleted(currentDay);
      console.log(`🎉 Day ${currentDay} completed! (${learnedToday}/${dayWordsCount})`);
      
      // Show completion message
      showDayCompletedMessage();
      
      // Refresh day selector to unlock next day
      renderDaySelector();
    }
  }

  /**
   * Show day completion message with animation
   */
  function showDayCompletedMessage() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'completion-overlay';
    overlay.innerHTML = `
      <div class="completion-modal">
        <div class="completion-icon-animated">🎉</div>
        <h3 class="completion-title">太棒了！</h3>
        <p class="completion-subtitle">Day ${currentDay} 已完成！</p>
        <p class="completion-detail">你已掌握 ${wordsData.length} 个新词汇</p>
        <button class="completion-btn" onclick="this.closest('.completion-overlay').remove()">
          继续学习 →
        </button>
      </div>
    `;
    document.body.appendChild(overlay);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.classList.add('completion-fade-out');
        setTimeout(() => overlay.remove(), 300);
      }
    }, 5000);
  }

  /**
   * Refresh the page
   */
  function refresh() {
    console.log('🔄 Refreshing WordsPage...');
    loadLearnedWords();
    renderDaySelector();
    renderWords();
    updateDayTitle();
  }

  /**
   * Load learned words from storage
   */
  function loadLearnedWords() {
    // Data is managed by AppState now
  }

  return {
    init,
    refresh,
    onDataReady,
    playWord,
    playCurrentWord,
    toggleLearned,
    selectDay
  };
})();
