/**
 * Pattern Drill Engine
 * Core engine for template replacement and random sentence generation
 */
const PatternEngine = (function() {
  let patterns = [];
  let currentPatternIndex = 0;

  function loadPatterns(patternData) {
    patterns = patternData;
    currentPatternIndex = 0;
  }

  function getCurrentPattern() {
    return patterns[currentPatternIndex] || null;
  }

  function selectPattern(index) {
    if (index >= 0 && index < patterns.length) {
      currentPatternIndex = index;
      return patterns[index];
    }
    return null;
  }

  function getAllPatterns() {
    return patterns;
  }

  /**
   * Generate a sentence from the current pattern
   * Replaces {placeholder} with random values from placeholders
   */
  function generateSentence(patternIndex = null) {
    const pattern = patternIndex !== null ? patterns[patternIndex] : getCurrentPattern();
    if (!pattern) return null;

    let sentence = pattern.template;
    const usedValues = {};

    // Find all placeholders in template: {key}
    const placeholderMatches = sentence.match(/\{([^}]+)\}/g);
    
    if (placeholderMatches && pattern.placeholders) {
      placeholderMatches.forEach(match => {
        const key = match.slice(1, -1); // Remove { and }
        const values = pattern.placeholders[key];
        
        if (values && values.length > 0) {
          // Get random value, avoid repeating if possible
          let availableValues = values;
          if (usedValues[key]) {
            availableValues = values.filter(v => v !== usedValues[key]);
            if (availableValues.length === 0) availableValues = values;
          }
          
          const randomValue = availableValues[Math.floor(Math.random() * availableValues.length)];
          usedValues[key] = randomValue;
          
          // Replace all occurrences of this placeholder
          sentence = sentence.replace(new RegExp(`\\{${key}\\}`, 'g'), randomValue);
        }
      });
    }

    return {
      sentence: sentence,
      pattern: pattern,
      template: pattern.template
    };
  }

  /**
   * Generate multiple unique sentences from the same pattern
   */
  function generateMultipleSentences(count = 3, patternIndex = null) {
    const sentences = [];
    const usedSentences = new Set();
    let attempts = 0;
    const maxAttempts = count * 10;

    while (sentences.length < count && attempts < maxAttempts) {
      const result = generateSentence(patternIndex);
      if (result && !usedSentences.has(result.sentence)) {
        sentences.push(result);
        usedSentences.add(result.sentence);
      }
      attempts++;
    }

    return sentences;
  }

  /**
   * Get next pattern (for cycling through patterns)
   */
  function nextPattern() {
    currentPatternIndex = (currentPatternIndex + 1) % patterns.length;
    return getCurrentPattern();
  }

  /**
   * Get previous pattern
   */
  function previousPattern() {
    currentPatternIndex = (currentPatternIndex - 1 + patterns.length) % patterns.length;
    return getCurrentPattern();
  }

  function getCurrentPatternIndex() {
    return currentPatternIndex;
  }

  /**
   * Get pattern statistics
   */
  function getStats() {
    return {
      totalPatterns: patterns.length,
      currentIndex: currentPatternIndex,
      currentPattern: getCurrentPattern()
    };
  }

  return {
    loadPatterns,
    getCurrentPattern,
    selectPattern,
    getCurrentPatternIndex,
    getAllPatterns,
    generateSentence,
    generateMultipleSentences,
    nextPattern,
    previousPattern,
    getStats
  };
})();