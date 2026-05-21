/**
 * Pattern Drill Module
 * Interactive pattern training with auto sentence generation and speech playback
 * Uses AppState for global state management
 */
const PatternsPage = (function() {
  let currentSpeed = 1;
  let currentSentence = null;
  let currentPattern = null;
  let isAutoPlay = false;
  let currentDay = 1;
  let availableDays = [];
  let isInitialized = false;

  async function init() {
    if (isInitialized) return;
    
    console.log('🔄 Initializing PatternsPage...');
    
    await loadWeekData();
    setupEventListeners();
    renderDaySelector();
    await loadDay(1);
    renderPatternList();
    generateNewSentence();
    
    isInitialized = true;
    console.log('✅ PatternsPage initialized');
  }

  async function loadWeekData() {
    const weekData = AppState.get('weekData');
    
    if (weekData && weekData.days) {
      availableDays = weekData.days.map(d => ({
        day: d.day,
        title: d.title,
        titleCn: d.titleCn,
        titleEn: d.titleEn
      }));
    } else {
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

  async function loadDay(dayNumber) {
    const data = await DayLoader.loadDay(dayNumber);
    if (data && data.patterns) {
      PatternEngine.loadPatterns(data.patterns);
      currentDay = dayNumber;
      updateDayTitle();
      renderPatternList();
      generateNewSentence();
    }
  }

  function updateDayTitle() {
    const titleEl = document.getElementById('patternsDayTitle');
    if (titleEl && availableDays.length > 0) {
      const dayInfo = availableDays.find(d => d.day === currentDay);
      if (dayInfo) {
        titleEl.textContent = `${I18n.t('day')} ${currentDay}: ${dayInfo.titleCn || dayInfo.title}`;
      }
    }
  }

  function renderDaySelector() {
    const container = document.getElementById('patternsDaySelector');
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
                onclick="PatternsPage.selectDay(${day.day})"
                ${!isUnlocked ? 'disabled' : ''}>
          ${I18n.t('day')} ${day.day}
        </button>
      `;
    }).join('');
  }

  function selectDay(dayNumber) {
    if (!DayLoader.isDayUnlocked(dayNumber)) return;
    loadDay(dayNumber);
    renderDaySelector();
  }

  function setupEventListeners() {
    const speedSlider = document.getElementById('patternSpeedSlider');
    const speedValue = document.getElementById('patternSpeedValue');
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        currentSpeed = parseFloat(e.target.value);
        if (speedValue) speedValue.textContent = `${currentSpeed.toFixed(1)}x`;
        if (typeof Speech !== 'undefined') {
          Speech.setRate(currentSpeed);
        }
      });
    }

    const generateBtn = document.getElementById('generateSentenceBtn');
    if (generateBtn) {
      generateBtn.addEventListener('click', generateNewSentence);
    }

    const playBtn = document.getElementById('playSentenceBtn');
    if (playBtn) {
      playBtn.addEventListener('click', playCurrentSentence);
    }

    const autoPlayBtn = document.getElementById('autoPlayBtn');
    if (autoPlayBtn) {
      autoPlayBtn.addEventListener('click', toggleAutoPlay);
    }

    const markPracticedBtn = document.getElementById('markPracticedBtn');
    if (markPracticedBtn) {
      markPracticedBtn.addEventListener('click', markPatternPracticed);
    }

    // Listen for week data updates
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
  }

  function renderPatternList() {
    const container = document.getElementById('patternList');
    if (!container) return;

    const patterns = PatternEngine.getAllPatterns();
    if (patterns.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-icon">📝</div><p>暂无句型数据</p></div>';
      return;
    }

    container.innerHTML = patterns.map((pattern, index) => `
      <div class="pattern-item ${index === PatternEngine.getCurrentPatternIndex() ? 'active' : ''}" 
           data-index="${index}" 
           onclick="PatternsPage.selectPattern(${index})">
        <div class="pattern-template">${pattern.template}</div>
        <div class="pattern-desc">${pattern.description || pattern.descriptionCn || ''}</div>
      </div>
    `).join('');
  }

  function selectPattern(index) {
    PatternEngine.selectPattern(index);
    renderPatternList();
    generateNewSentence();
  }

  function generateNewSentence() {
    const result = PatternEngine.generateSentence();
    if (!result) {
      const sentenceDisplay = document.getElementById('sentenceDisplay');
      if (sentenceDisplay) {
        sentenceDisplay.textContent = '点击"生成句子"开始练习';
      }
      return;
    }

    currentSentence = result.sentence;
    currentPattern = result.template;

    const sentenceDisplay = document.getElementById('sentenceDisplay');
    const templateDisplay = document.getElementById('templateDisplay');

    if (sentenceDisplay) {
      sentenceDisplay.textContent = currentSentence;
      sentenceDisplay.classList.remove('fade-in');
      void sentenceDisplay.offsetWidth;
      sentenceDisplay.classList.add('fade-in');
    }

    if (templateDisplay) {
      templateDisplay.textContent = `模板: ${currentPattern}`;
    }

    if (isAutoPlay) {
      setTimeout(() => playCurrentSentence(), 500);
    }
  }

  /**
   * Mark current pattern as practiced (counts toward progress)
   */
  function markPatternPracticed() {
    AppState.incrementPatterns(1);
    Storage.incrementPatternsPracticed();

    // Flash feedback on the generate button
    const btn = document.getElementById('generateSentenceBtn');
    if (btn) {
      btn.textContent = '✅ 已练习';
      setTimeout(() => {
        btn.textContent = I18n.t('patterns.generate') || '🔄 生成新句子';
      }, 1200);
    }

    // Update HomePage if available
    if (typeof HomePage !== 'undefined' && HomePage.updateStats) {
      HomePage.updateStats();
    }
  }

  function playCurrentSentence() {
    if (!currentSentence || typeof Speech === 'undefined') return;
    Speech.speak(currentSentence, currentSpeed);
  }

  function toggleAutoPlay() {
    isAutoPlay = !isAutoPlay;
    const btn = document.getElementById('autoPlayBtn');
    if (btn) {
      btn.classList.toggle('active', isAutoPlay);
      btn.textContent = isAutoPlay ? '🔊 自动播放: 开' : '🔊 自动播放: 关';
    }
  }

  function refresh() {
    renderDaySelector();
    renderPatternList();
    if (!currentSentence) {
      generateNewSentence();
    }
  }

  return {
    init,
    refresh,
    selectPattern,
    selectDay,
    generateNewSentence,
    playCurrentSentence,
    markPatternPracticed
  };
})();
