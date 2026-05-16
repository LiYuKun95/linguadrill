/**
 * Pattern Drill Module
 * Interactive pattern training with auto sentence generation and speech playback
 */
const PatternsPage = (function() {
  let currentSpeed = 1;
  let currentSentence = null;
  let isAutoPlay = false;

  async function init() {
    await loadPatterns();
    setupEventListeners();
    renderPatternList();
    generateNewSentence();
  }

  async function loadPatterns() {
    const data = await DayLoader.loadDay(1);
    if (data && data.patterns) {
      PatternEngine.loadPatterns(data.patterns);
    }
  }

  function setupEventListeners() {
    // Speed slider
    const speedSlider = document.getElementById('patternSpeedSlider');
    const speedValue = document.getElementById('patternSpeedValue');
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        currentSpeed = parseFloat(e.target.value);
        if (speedValue) speedValue.textContent = `${currentSpeed.toFixed(1)}x`;
        Speech.setRate(currentSpeed);
      });
    }

    // Generate button
    const generateBtn = document.getElementById('generateSentenceBtn');
    if (generateBtn) {
      generateBtn.addEventListener('click', generateNewSentence);
    }

    // Play button
    const playBtn = document.getElementById('playSentenceBtn');
    if (playBtn) {
      playBtn.addEventListener('click', playCurrentSentence);
    }

    // Auto-play toggle
    const autoPlayBtn = document.getElementById('autoPlayBtn');
    if (autoPlayBtn) {
      autoPlayBtn.addEventListener('click', toggleAutoPlay);
    }
  }

  function renderPatternList() {
    const container = document.getElementById('patternList');
    if (!container) return;

    const patterns = PatternEngine.getAllPatterns();
    container.innerHTML = patterns.map((pattern, index) => `
      <div class="pattern-item" data-index="${index}" onclick="PatternsPage.selectPattern(${index})">
        <div class="pattern-template">${pattern.template}</div>
        <div class="pattern-desc">${pattern.description}</div>
      </div>
    `).join('');
  }

  function selectPattern(index) {
    PatternEngine.selectPattern(index);
    
    // Update active state in UI
    document.querySelectorAll('.pattern-item').forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
    
    generateNewSentence();
  }

  function generateNewSentence() {
    const result = PatternEngine.generateSentence();
    if (!result) return;

    currentSentence = result.sentence;
    
    // Update display
    const sentenceDisplay = document.getElementById('sentenceDisplay');
    const templateDisplay = document.getElementById('templateDisplay');
    
    if (sentenceDisplay) {
      sentenceDisplay.textContent = currentSentence;
      sentenceDisplay.classList.remove('fade-in');
      void sentenceDisplay.offsetWidth; // Trigger reflow
      sentenceDisplay.classList.add('fade-in');
    }
    
    if (templateDisplay) {
      templateDisplay.textContent = `模板: ${result.template}`;
    }

    // Track progress
    Storage.incrementPatternsPracticed();

    // Auto-play if enabled
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
    renderPatternList();
    if (!currentSentence) {
      generateNewSentence();
    }
  }

  return {
    init,
    refresh,
    selectPattern,
    generateNewSentence,
    playCurrentSentence
  };
})();