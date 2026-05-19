/**
 * Navigation System
 * Metro-inspired floating bottom dock + desktop side nav
 * Syncs active state across both navigation modes
 */
const Navigation = (function() {
  const navItems = [
    { id: 'home', icon: '🏠', label: '首页', labelEn: 'Home' },
    { id: 'words', icon: '📚', label: '高频词汇', labelEn: 'Words' },
    { id: 'patterns', icon: '🔄', label: '句型操练', labelEn: 'Patterns' },
    { id: 'shadowing', icon: '🎤', label: '跟读训练', labelEn: 'Shadowing' },
    { id: 'progress', icon: '📊', label: '学习进度', labelEn: 'Progress' }
  ];

  let currentPage = 'home';
  let isEnglish = false;

  function init() {
    setupEventListeners();
    highlightCurrentPage();
    updateGlobalStats();
    updateSideNavStats();
  }

  function setupEventListeners() {
    // Bottom nav (mobile/tablet)
    const bottomNav = document.getElementById('bottomNav');
    if (bottomNav) {
      bottomNav.addEventListener('click', (e) => {
        const navItem = e.target.closest('.nav-item');
        if (navItem) {
          navigateTo(navItem.getAttribute('data-page'));
        }
      });
    }

    // Side nav (desktop)
    const sideNav = document.getElementById('sideNav');
    if (sideNav) {
      sideNav.addEventListener('click', (e) => {
        const navItem = e.target.closest('.nav-item');
        if (navItem) {
          navigateTo(navItem.getAttribute('data-page'));
        }
      });
    }
  }

  function navigateTo(pageId) {
    if (pageId === currentPage) return;

    currentPage = pageId;

    // Update all navigation instances
    highlightCurrentPage();

    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update global stats
    updateGlobalStats();
    updateSideNavStats();

    // Refresh page content
    refreshPage(pageId);

    window.dispatchEvent(new CustomEvent('pageChange', { detail: { page: pageId } }));
  }

  function updateGlobalStats() {
    const learnedWords = Storage.getLearnedWords().length;
    const streak = Storage.getStreak();

    const headerStreak = document.getElementById('header-streak');
    const headerLearned = document.getElementById('header-learned');
    if (headerStreak) headerStreak.textContent = streak;
    if (headerLearned) headerLearned.textContent = learnedWords;
  }

  function updateSideNavStats() {
    const streak = Storage.getStreak();
    const learned = Storage.getLearnedWords().length;

    const streakEl = document.getElementById('sideNavStreak');
    const learnedEl = document.getElementById('sideNavLearned');
    if (streakEl) streakEl.textContent = streak + ' 天连续';
    if (learnedEl) learnedEl.textContent = learned + ' 已学';
  }

  function highlightCurrentPage() {
    // Update all nav-item instances (both bottom and side)
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-page') === currentPage);
    });
  }

  function refreshPage(pageId) {
    switch (pageId) {
      case 'home':
        if (typeof HomePage !== 'undefined') HomePage.refresh();
        break;
      case 'words':
        if (typeof WordsPage !== 'undefined') WordsPage.refresh();
        break;
      case 'patterns':
        if (typeof PatternsPage !== 'undefined') PatternsPage.refresh();
        break;
      case 'shadowing':
        if (typeof ShadowingPage !== 'undefined') ShadowingPage.refresh();
        break;
      case 'progress':
        if (typeof ProgressPage !== 'undefined') ProgressPage.refresh();
        break;
    }
  }

  function setLanguage(isEn) {
    isEnglish = isEn;
  }

  function getCurrentPage() {
    return currentPage;
  }

  return {
    init,
    navigateTo,
    setLanguage,
    getCurrentPage
  };
})();
