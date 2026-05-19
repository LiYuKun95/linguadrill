/**
 * Vocabulary Training Module
 * Features: speech playback, day selection, adjustable speed, repeat mode, mark as learned
 */
const WordsPage = (function() {
  let wordsData = [];
  let learnedWords = new Set();
  let currentSpeed = 1;
  let isRepeatMode = false;
  let currentDay = 1;
  let availableDays = [];

  async function init() {
    await loadWeekData();
    loadLearnedWords();
    setupEventListeners();
    renderDaySelector();
    await loadDay(1);
    renderWords();
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
    if (data) {
      wordsData = data.words || [];
      currentDay = dayNumber;
      updateDayTitle();
      renderWords();
    }
  }

  function updateDayTitle() {
    const titleEl = document.getElementById('wordsDayTitle');
    if (titleEl && availableDays.length > 0) {
      const dayInfo = availableDays.find(d => d.day === currentDay);
      if (dayInfo) {
        titleEl.textContent = `${I18n.t('day')} ${currentDay}: ${dayInfo.titleCn || dayInfo.title}`;
      }
    }
  }

  function renderDaySelector() {
    const container = document.getElementById('daySelector');
    if (!container) return;

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

  function selectDay(dayNumber) {
    if (!DayLoader.isDayUnlocked(dayNumber)) return;
    loadDay(dayNumber);
    renderDaySelector();
  }

  function loadLearnedWords() {
    const saved = localStorage.getItem('linguadrill_learned_words');
    if (saved) {
      learnedWords = new Set(JSON.parse(saved));
    }
  }

  function saveLearnedWords() {
    localStorage.setItem('linguadrill_learned_words', JSON.stringify([...learnedWords]));
  }

  function setupEventListeners() {
    const speedSlider = document.getElementById('wordSpeedSlider');
    const speedValue = document.getElementById('wordSpeedValue');
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        currentSpeed = parseFloat(e.target.value);
        if (speedValue) speedValue.textContent = `${currentSpeed.toFixed(1)}x`;
        Speech.setRate(currentSpeed);
      });
    }

    const repeatBtn = document.getElementById('repeatModeBtn');
    if (repeatBtn) {
      repeatBtn.addEventListener('click', () => {
        isRepeatMode = !isRepeatMode;
        repeatBtn.classList.toggle('active', isRepeatMode);
        repeatBtn.textContent = isRepeatMode ? '🔁 重复3次: 开' : '🔁 重复3次: 关';
      });
    }
  }

  function renderWords() {
    const container = document.getElementById('wordsList');
    if (!container) return;

    if (wordsData.length === 0) {
      container.innerHTML = '<div class="empty-state">📚 No words loaded. Please select a day.</div>';
      return;
    }

    container.innerHTML = wordsData.map((word, index) => {
      const isLearned = learnedWords.has(`${currentDay}_${word.word}`);
      return `
        <div class="word-card ${isLearned ? 'learned' : ''}" data-index="${index}">
          <div class="word-header">
            <div class="word-main">
              <span class="word-text" onclick="WordsPage.playWord(${index})">${word.word}</span>
              <span class="word-phonetic">${word.phonetic}</span>
            </div>
            <button class="word-audio-btn" onclick="WordsPage.playWord(${index})" aria-label="Play pronunciation">
              🔊
            </button>
          </div>
          <div class="word-translation">${word.translation}</div>
          <div class="word-example">"${word.example}"</div>
          <div class="word-example-cn">${word.exampleCn}</div>
          <div class="word-actions">
            <button class="word-action-btn ${isLearned ? 'learned' : ''}" 
                    onclick="WordsPage.toggleLearned('${word.word}')">
              ${isLearned ? '✅ 已学会' : '⭕ 标记为已学'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function playWord(index) {
    const word = wordsData[index];
    if (!word) return;

    if (isRepeatMode) {
      Speech.speak(word.word, currentSpeed);
      setTimeout(() => Speech.speak(word.word, currentSpeed), 1000);
      setTimeout(() => Speech.speak(word.word, currentSpeed), 2000);
    } else {
      Speech.speak(word.word, currentSpeed);
    }

    Storage.incrementWordsLearned();
  }

  function playExample(index) {
    const word = wordsData[index];
    if (!word || !word.example) return;
    Speech.speak(word.example, currentSpeed);
  }

  function toggleLearned(word) {
    const key = `${currentDay}_${word}`;
    if (learnedWords.has(key)) {
      learnedWords.delete(key);
    } else {
      learnedWords.add(key);
    }
    saveLearnedWords();
    renderWords();
    checkDayCompletion();
    // Update global stats
    if (typeof Navigation !== 'undefined' && Navigation.updateGlobalStats) {
      Navigation.updateGlobalStats();
    }
    // Also update home page stats if available
    if (typeof HomePage !== 'undefined' && HomePage.updateStats) {
      HomePage.updateStats();
    }
  }

  function checkDayCompletion() {
    const dayWordsCount = wordsData.length;
    const learnedToday = wordsData.filter(w => learnedWords.has(`${currentDay}_${w.word}`)).length;
    
    if (learnedToday >= dayWordsCount * 0.8) {
      DayLoader.markDayCompleted(currentDay);
    }
  }

  function refresh() {
    loadLearnedWords();
    renderDaySelector();
    renderWords();
  }

  return {
    init,
    refresh,
    playWord,
    playExample,
    toggleLearned,
    selectDay
  };
})();
