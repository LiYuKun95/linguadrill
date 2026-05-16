const HomePage = (function() {
  function init() {
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
      startBtn.addEventListener('click', function() {
        navigateTo('words');
      });
    }
  }

  function refresh() {
    init();
  }

  return {
    init: init,
    refresh: refresh
  };
})();