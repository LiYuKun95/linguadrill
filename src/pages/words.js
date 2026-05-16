/**
 * Vocabulary Training Module
 * Features: speech playback, adjustable speed, repeat mode, mark as learned
 */
const WordsPage = (function() {
  let wordsData = [];
  let learnedWords = new Set();
  let currentSpeed = 1;
  let isRepeatMode = false;

  async function init() {
    await loadWords();
    loadLearnedWords();
    setupEventListeners();
    renderWords();
  }

  async function loadWords() {
    const data = await DayLoader.loadDay(1);
    if (data) {
      wordsData = data.words;
    }
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
    // Speed slider
    const speedSlider = document.getElementById('wordSpeedSlider');
    const speedValue = document.getElementById('wordSpeedValue');
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        currentSpeed = parseFloat(e.target.value);
        if (speedValue) speedValue.textContent = `${currentSpeed.toFixed(1)}x`;
        Speech.setRate(currentSpeed);
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
  }

  function renderWords() {
    const container = document.getElementById('wordsList');
    if (!container) return;

    container.innerHTML = wordsData.map((word, index) => {
      const isLearned = learnedWords.has(word.word);
      return `
        <div class="word-card ${isLearned ? 'learned' : ''}" data-index="${index}">
          <div class="word-header">
            <div class="word-main">
              <span class="word-text">${word.word}</span>
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
      // Play 3 times with small pause
      Speech.speak(word.word, currentSpeed);
      setTimeout(() => {
        Speech.speak(word.word, currentSpeed);
      }, 1000);
      setTimeout(() => {
        Speech.speak(word.word, currentSpeed);
      }, 2000);
    } else {
      Speech.speak(word.word, currentSpeed);
    }

    // Track progress
    Storage.incrementWordsLearned();
  }

  function toggleLearned(word) {
    if (learnedWords.has(word)) {
      learnedWords.delete(word);
    } else {
      learnedWords.add(word);
    }
    saveLearnedWords();
    renderWords();
  }

  function refresh() {
    loadLearnedWords();
    renderWords();
  }

  return {
    init,
    refresh,
    playWord,
    toggleLearned
  };
})();