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

  async function init() {
    await loadData();
    setupEventListeners();
    renderSentenceList();
    renderPlayer();
  }

  async function loadData() {
    const data = await DayLoader.loadDay(1);
    if (data && data.shadowing) {
      shadowingData = data.shadowing;
    }
  }

  function setupEventListeners() {
    // Speed slider
    const speedSlider = document.getElementById('shadowingSpeedSlider');
    const speedValue = document.getElementById('shadowingSpeedValue');
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        currentSpeed = parseFloat(e.target.value);
        if (speedValue) speedValue.textContent = `${currentSpeed.toFixed(1)}x`;
        Speech.setRate(currentSpeed);
      });
    }

    // Control buttons
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

    container.innerHTML = shadowingData.map((item, index) => `
      <div class="shadowing-item ${index === currentIndex ? 'active' : ''}" 
           data-index="${index}" 
           onclick="ShadowingPage.selectSentence(${index})">
        <div class="shadowing-number">${index + 1}</div>
        <div class="shadowing-content">
          <div class="shadowing-sentence">${item.sentence}</div>
          <div class="shadowing-translation">${item.translation}</div>
        </div>
        <div class="shadowing-difficulty ${item.difficulty}">
          ${item.difficulty === 'easy' ? '简单' : '中等'}
        </div>
      </div>
    `).join('');
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

    // Update active state in list
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
    }
  }

  function playCurrent() {
    const currentItem = shadowingData[currentIndex];
    if (!currentItem) return;

    isPlaying = true;
    isPausedForUser = false;
    renderPlayer();

    // Calculate duration based on sentence length and speed
    const duration = (currentItem.sentence.length * 80) / currentSpeed;

    Speech.speak(currentItem.sentence, currentSpeed);

    // Show "Your Turn" after playback
    setTimeout(() => {
      isPausedForUser = true;
      isPlaying = false;
      renderPlayer();
    }, duration);

    // Track progress
    Storage.incrementShadowingCompleted();
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
      // Auto-play next sentence
      setTimeout(() => playCurrent(), 300);
    }
  }

  function prevSentence() {
    if (currentIndex > 0) {
      currentIndex--;
      isPausedForUser = false;
      isPlaying = false;
      renderPlayer();
    }
  }

  function refresh() {
    renderSentenceList();
    renderPlayer();
  }

  return {
    init,
    refresh,
    selectSentence,
    playCurrent,
    replayCurrent,
    nextSentence,
    prevSentence
  };
})();