/**
 * Pattern Drill Module
 * Interactive pattern training with auto sentence generation and speech playback
 */
const PatternsPage = (function() {
  let currentSpeed = 1;
  let currentSentence = null;
  let currentPattern = null;
  let isAutoPlay = false;
  let currentDay = 1;
  let availableDays = [];

  async function init() {
    await loadWeekData();
    setupEventListeners();
    renderDaySelector();
    await loadDay(1);
    renderPatternList();
    generateNewSentence();
  }

  async function loadWeekData() {
    const weekData = await DayLoader.loadWeek1();
    if (weekData && weekData.days) {
      availableDays = weekData.days.map(d => ({
        day: d.day,
        title: d.title,
        titleCn: d.titleCn,
        titleEn: d.titleEn
      }));
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
        Speech.setRate(currentSpeed);
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
  }

  function renderPatternList() {
    const container = document.getElementById('patternList');
    if (!container) return;

    const patterns = PatternEngine.getAllPatterns();
    if (patterns.length === 0) {
      container.innerHTML = '<div class="empty-state">📝 No patterns loaded. Please select a day.</div>';
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
    if (!result) return;

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

    Storage.incrementPatternsPracticed();

    if (isAutoPlay) {
      setTimeout(() => playCurrentSentence(), 500);
    }
  }

  function playCurrentSentence() {
    if (!currentSentence) return;
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
    playCurrentSentence
  };
})();
