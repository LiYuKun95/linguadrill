/**
 * Navigation System
 * Sticky bottom mobile navigation with 5 main sections
 */
const Navigation = (function() {
  const navItems = [
    { id: 'home', icon: '🏠', label: '首页', labelEn: 'Home' },
    { id: 'words', icon: '📚', label: '词汇', labelEn: 'Words' },
    { id: 'patterns', icon: '🔄', label: '句型', labelEn: 'Patterns' },
    { id: 'shadowing', icon: '🎤', label: '跟读', labelEn: 'Shadowing' },
    { id: 'progress', icon: '📊', label: '进度', labelEn: 'Progress' }
  ];

  let currentPage = 'home';
  let isEnglish = false;

  function init() {
    renderNavigation();
    setupEventListeners();
    highlightCurrentPage();
  }

  function renderNavigation() {
    const container = document.getElementById('bottomNav');
    if (!container) return;

    container.innerHTML = navItems.map(item => `
      <button class="nav-item ${item.id === currentPage ? 'active' : ''}" 
              data-page="${item.id}"
              aria-label="${isEnglish ? item.labelEn : item.label}">
        <span class="nav-icon">${item.icon}</span>
        <span class="nav-label">${isEnglish ? item.labelEn : item.label}</span>
      </button>
    `).join('');
  }

  function setupEventListeners() {
    const container = document.getElementById('bottomNav');
    if (!container) return;

    container.addEventListener('click', (e) => {
      const navItem = e.target.closest('.nav-item');
      if (navItem) {
        const pageId = navItem.getAttribute('data-page');
        navigateTo(pageId);
      }
    });
  }

  function navigateTo(pageId) {
    if (pageId === currentPage) return;

    // Update current page
    currentPage = pageId;

    // Update navigation UI
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

    // Refresh page content
    refreshPage(pageId);

    // Dispatch navigation event
    window.dispatchEvent(new CustomEvent('pageChange', { detail: { page: pageId } }));
  }

  function highlightCurrentPage() {
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
    renderNavigation();
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