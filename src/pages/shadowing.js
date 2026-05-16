/**
 * Shadowing Module
 * Train listening rhythm and speaking rhythm with play/pause and "Your Turn" indicator
 */
const ShadowingPage = (function() {
  let shadowingData = [];
  let currentIndex = 0;
  let currentSpeed = 1;
  let isPlaying = false;
  let isPausedForUser = false;
  let currentDay = 1;
  let availableDays = [];
  let completedShadowing = new Set();

  async function init() {
    await loadWeekData();
    loadCompletedShadowing();
    setupEventListeners();
    renderDaySelector();
    await loadDay(1);
    renderSentenceList();
    renderPlayer();
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
    if (data && data.shadowing) {
      shadowingData = data.shadowing;
      currentDay = dayNumber;
      currentIndex = 0;
      isPausedForUser = false;
      isPlaying = false;
      updateDayTitle();
      renderSentenceList();
      renderPlayer();
    }
  }

  function updateDayTitle() {
    const titleEl = document.getElementById('shadowingDayTitle');
    if (titleEl && availableDays.length > 0) {
      const dayInfo = availableDays.find(d => d.day === currentDay);
      if (dayInfo) {
        titleEl.textContent = `${I18n.t('day')} ${currentDay}: ${dayInfo.titleCn || dayInfo.title}`;
      }
    }
  }

  function renderDaySelector() {
    const container = document.getElementById('shadowingDaySelector');
    if (!container) return;

    container.innerHTML = availableDays.map(day => {
      const isActive = day.day === currentDay;
      const isUnlocked = DayLoader.isDayUnlocked(day.day);
      return `
        <button class="day-btn ${isActive ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}"
                onclick="ShadowingPage.selectDay(${day.day})"
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

  function loadCompletedShadowing() {
    const saved = localStorage.getItem('linguadrill_completed_shadowing');
    if (saved) {
      completedShadowing = new Set(JSON.parse(saved));
    }
  }

  function saveCompletedShadowing() {
    localStorage.setItem('linguadrill_completed_shadowing', JSON.stringify([...completedShadowing]));
  }

  function setupEventListeners() {
    const speedSlider = document.getElementById('shadowingSpeedSlider');
    const speedValue = document.getElementById('shadowingSpeedValue');
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        currentSpeed = parseFloat(e.target.value);
        if (speedValue) speedValue.textContent = `${currentSpeed.toFixed(1)}x`;
        Speech.setRate(currentSpeed);
      });
    }

    const playBtn = document.getElementById('shadowingPlayBtn');
    const replayBtn = document.getElementById('shadowingReplayBtn');
    const nextBtn = document.getElementById('shadowingNextBtn');
    const prevBtn = document.getElementById('shadowingPrevBtn');

    if (playBtn) playBtn.addEventListener('click', playCurrent);
    if (replayBtn) replayBtn.addEventListener('click', replayCurrent);
    if (nextBtn) nextBtn.addEventListener('click', nextSentence);
    if (prevBtn) prevBtn.addEventListener('click', prevSentence);
  }

  function renderSentenceList() {
    const container = document.getElementById('shadowingList');
    if (!container) return;

    if (shadowingData.length === 0) {
      container.innerHTML = '<div class="empty-state">🎧 No sentences loaded. Please select a day.</div>';
      return;
    }

    container.innerHTML = shadowingData.map((item, index) => {
      const key = `${currentDay}_${item.id}`;
      const isCompleted = completedShadowing.has(key);
      return `
        <div class="shadowing-item ${index === currentIndex ? 'active' : ''} ${isCompleted ? 'completed' : ''}" 
             data-index="${index}" 
             onclick="ShadowingPage.selectSentence(${index})">
          <div class="shadowing-number">${index + 1}</div>
          <div class="shadowing-content">
            <div class="shadowing-sentence">${item.sentence}</div>
            <div class="shadowing-translation">${item.translation}</div>
          </div>
          <div class="shadowing-status">
            ${isCompleted ? '✅' : item.difficulty === 'easy' ? '🟢' : '🟡'}
          </div>
        </div>
      `;
    }).join('');
  }

  function renderPlayer() {
    const currentItem = shadowingData[currentIndex];
    if (!currentItem) return;

    const sentenceDisplay = document.getElementById('shadowingSentenceDisplay');
    const translationDisplay = document.getElementById('shadowingTranslationDisplay');
    const yourTurnIndicator = document.getElementById('yourTurnIndicator');
    const progressDisplay = document.getElementById('shadowingProgress');

    if (sentenceDisplay) {
      sentenceDisplay.textContent = currentItem.sentence;
    }

    if (translationDisplay) {
      translationDisplay.textContent = currentItem.translation;
    }

    if (yourTurnIndicator) {
      yourTurnIndicator.style.display = isPausedForUser ? 'flex' : 'none';
    }

    if (progressDisplay) {
      progressDisplay.textContent = `${currentIndex + 1} / ${shadowingData.length}`;
    }

    document.querySelectorAll('.shadowing-item').forEach((item, i) => {
      item.classList.toggle('active', i === currentIndex);
    });
  }

  function selectSentence(index) {
    if (index >= 0 && index < shadowingData.length) {
      currentIndex = index;
      isPausedForUser = false;
      isPlaying = false;
      renderPlayer();
      renderSentenceList();
    }
  }

  function playCurrent() {
    const currentItem = shadowingData[currentIndex];
    if (!currentItem) return;

    isPlaying = true;
    isPausedForUser = false;
    renderPlayer();

    const duration = (currentItem.sentence.length * 80) / currentSpeed;

    Speech.speak(currentItem.sentence, currentSpeed);

    setTimeout(() => {
      isPausedForUser = true;
      isPlaying = false;
      renderPlayer();
      markCurrentCompleted();
    }, duration);

    Storage.incrementShadowingCompleted();
  }

  function markCurrentCompleted() {
    const currentItem = shadowingData[currentIndex];
    if (currentItem) {
      const key = `${currentDay}_${currentItem.id}`;
      completedShadowing.add(key);
      saveCompletedShadowing();
      renderSentenceList();
      checkDayCompletion();
    }
  }

  function checkDayCompletion() {
    const dayShadowingCount = shadowingData.length;
    const completedToday = shadowingData.filter(s => completedShadowing.has(`${currentDay}_${s.id}`)).length;
    
    if (completedToday >= dayShadowingCount * 0.8) {
      DayLoader.markDayCompleted(currentDay);
    }
  }

  function replayCurrent() {
    isPausedForUser = false;
    playCurrent();
  }

  function nextSentence() {
    if (currentIndex < shadowingData.length - 1) {
      currentIndex++;
      isPausedForUser = false;
      isPlaying = false;
      renderPlayer();
      renderSentenceList();
      setTimeout(() => playCurrent(), 300);
    }
  }

  function prevSentence() {
    if (currentIndex > 0) {
      currentIndex--;
      isPausedForUser = false;
      isPlaying = false;
      renderPlayer();
      renderSentenceList();
    }
  }

  function refresh() {
    loadCompletedShadowing();
    renderDaySelector();
    renderSentenceList();
    renderPlayer();
  }

  return {
    init,
    refresh,
    selectSentence,
    selectDay,
    playCurrent,
    replayCurrent,
    nextSentence,
    prevSentence
  };
})();
