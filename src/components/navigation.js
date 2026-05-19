/**
 * Navigation System
 * Metro-inspired floating bottom dock + desktop side nav
 * Uses AppState as single source of truth
 */
const Navigation = (function() {
  let isInitialized = false;

  function init() {
    if (isInitialized) return;
    
    setupEventListeners();
    restoreLastPage();
    isInitialized = true;
    console.log('🧭 Navigation initialized');
  }

  function setupEventListeners() {
    // Bottom nav (mobile/tablet)
    const bottomNav = document.getElementById('bottomNav');
    if (bottomNav) {
      bottomNav.addEventListener('click', (e) => {
        const navItem = e.target.closest('.nav-item');
        if (navItem) {
          const pageId = navItem.getAttribute('data-page');
          if (pageId) {
            navigateTo(pageId);
          }
        }
      });
    }

    // Side nav (desktop)
    const sideNav = document.getElementById('sideNav');
    if (sideNav) {
      sideNav.addEventListener('click', (e) => {
        const navItem = e.target.closest('.nav-item');
        if (navItem) {
          const pageId = navItem.getAttribute('data-page');
          if (pageId) {
            navigateTo(pageId);
          }
        }
      });
    }

    // Listen for page changes from AppState
    AppState.on('currentPage', (pageId) => {
      highlightCurrentPage(pageId);
    });
  }

  function navigateTo(pageId) {
    AppState.navigateTo(pageId);
  }

  function restoreLastPage() {
    // Navigate to last page or home
    const currentPage = AppState.get('currentPage');
    highlightCurrentPage(currentPage);
    
    // Show the current page
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    const targetPage = document.getElementById(currentPage);
    if (targetPage) {
      targetPage.classList.add('active');
    }
  }

  function highlightCurrentPage(pageId) {
    document.querySelectorAll('.nav-item').forEach(item => {
      const itemPage = item.getAttribute('data-page');
      item.classList.toggle('active', itemPage === pageId);
    });
  }

  function getCurrentPage() {
    return AppState.get('currentPage');
  }

  return {
    init,
    navigateTo,
    getCurrentPage
  };
})();
