/**
 * Shadowing Module
 * Train listening rhythm and speaking rhythm with play/pause and "Your Turn" indicator
 * Uses AppState for global state management
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
  let isInitialized = false;

  async function init() {
    if (isInitialized) return;
    
    console.log('🎤 Initializing ShadowingPage...');
    
    await loadWeekData();
    loadCompletedShadowing();
    setupEventListeners();
    renderDaySelector();
    await loadDay(1);
    renderSentenceList();
    renderPlayer();
    
    isInitialized = true;
    console.log('✅ ShadowingPage initialized');
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

    if (availableDays.length === 0) {
      container.innerHTML = '<span class="loading-text">加载中...</span>';
      return;
    }

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
    try {
      const saved = localStorage.getItem('linguadrill_completed_shadowing');
      if (saved) {
        completedShadowing = new Set(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load shadowing progress:', e);
    }
  }

  function saveCompletedShadowing() {
    try {
      localStorage.setItem('linguadrill_completed_shadowing', JSON.stringify([...completedShadowing]));
    } catch (e) {
      console.error('Failed to save shadowing progress:', e);
    }
  }

  function setupEventListeners() {
    const speedSlider = document.getElementById('shadowingSpeedSlider');
    const speedValue = document.getElementById('shadowingSpeedValue');
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        currentSpeed = parseFloat(e.target.value);
        if (speedValue) speedValue.textContent = `${currentSpeed.toFixed(1)}x`;
        if (typeof Speech !== 'undefined') {
          Speech.setRate(currentSpeed);
        }
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

  function renderSentenceList() {
    const container = document.getElementById('shadowingList');
    if (!container) return;

    if (shadowingData.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-icon">🎧</div><p>暂无跟读数据</p></div>';
      return;
    }

    container.innerHTML = shadowingData.map((item, index) => {
      const key = `${currentDay}_${item.id || index}`;
      const isCompleted = completedShadowing.has(key);
      return `
        <div class="shadowing-item ${index === currentIndex ? 'active' : ''} ${isCompleted ? 'completed' : ''}" 
             data-index="${index}" 
             onclick="ShadowingPage.selectSentence(${index})">
          <div class="shadowing-number">${index + 1}</div>
          <div class="shadowing-content">
            <div class="shadowing-sentence">${item.sentence || item.text || ''}</div>
            <div class="shadowing-translation">${item.translation || ''}</div>
          </div>
          <div class="shadowing-status">
            ${isCompleted ? '✅' : (item.difficulty === 'easy' ? '🟢' : '🟡')}
          </div>
        </div>
      `;
    }).join('');
  }

  function renderPlayer() {
    const currentItem = shadowingData[currentIndex];
    
    const sentenceDisplay = document.getElementById('shadowingSentenceDisplay');
    const translationDisplay = document.getElementById('shadowingTranslationDisplay');
    const yourTurnIndicator = document.getElementById('yourTurnIndicator');
    const progressDisplay = document.getElementById('shadowingProgress');

    if (!currentItem) {
      if (sentenceDisplay) sentenceDisplay.textContent = '选择一个句子开始跟读';
      if (translationDisplay) translationDisplay.textContent = '';
      if (progressDisplay) progressDisplay.textContent = '0 / 0';
      return;
    }

    if (sentenceDisplay) {
      sentenceDisplay.textContent = currentItem.sentence || currentItem.text || '';
    }

    if (translationDisplay) {
      translationDisplay.textContent = currentItem.translation || '';
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
    if (!currentItem || typeof Speech === 'undefined') return;

    isPlaying = true;
    isPausedForUser = false;
    renderPlayer();

    const text = currentItem.sentence || currentItem.text || '';
    const duration = (text.length * 80) / currentSpeed;

    Speech.speak(text, currentSpeed);

    setTimeout(() => {
      isPausedForUser = true;
      isPlaying = false;
      renderPlayer();
      markCurrentCompleted();
    }, duration);

    // Update stats via AppState
    AppState.incrementShadowing(1);
    Storage.incrementShadowingCompleted();

    // Update HomePage if available
    if (typeof HomePage !== 'undefined' && HomePage.updateStats) {
      HomePage.updateStats();
    }
  }

  function markCurrentCompleted() {
    const currentItem = shadowingData[currentIndex];
    if (currentItem) {
      const key = `${currentDay}_${currentItem.id || currentIndex}`;
      completedShadowing.add(key);
      saveCompletedShadowing();
      renderSentenceList();
      checkDayCompletion();
    }
  }

  function checkDayCompletion() {
    const dayShadowingCount = shadowingData.length;
    const completedToday = shadowingData.filter(s => completedShadowing.has(`${currentDay}_${s.id || shadowingData.indexOf(s)}`)).length;
    
    if (dayShadowingCount > 0 && completedToday >= dayShadowingCount * 0.8) {
      DayLoader.markDayCompleted(currentDay);
      console.log(`🎉 Day ${currentDay} shadowing completed!`);
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
