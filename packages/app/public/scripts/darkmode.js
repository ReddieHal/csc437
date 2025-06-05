const darkModeToggle = document.getElementById('darkSwitch');

function initDarkMode() {
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  
  document.body.style.transition = 'none';
  document.body.classList.toggle('dark-mode', isDarkMode);
  
  if (darkModeToggle) {
    darkModeToggle.checked = isDarkMode;
  }
  
  void document.body.offsetWidth;
  
  setTimeout(() => {
    document.body.style.transition = '';
  }, 10);
  
  if (darkModeToggle) {
    const darkModeLabel = darkModeToggle.closest('.dark-mode-toggle');
    if (darkModeLabel) {
      darkModeLabel.addEventListener('change', handleDarkModeToggleChange);
    }
  }
  
  document.body.addEventListener('darkmode:toggle', handleDarkModeToggle);
}

function handleDarkModeToggleChange(event) {
  event.stopPropagation();
  
  const isDarkMode = event.target.checked;
  
  const customEvent = new CustomEvent('darkmode:toggle', {
    bubbles: true,
    detail: { isDarkMode }
  });
  
  document.body.dispatchEvent(customEvent);
}

function handleDarkModeToggle(event) {
  const isDarkMode = event.detail.isDarkMode;
  
  document.body.classList.toggle('dark-mode', isDarkMode);
  
  localStorage.setItem('darkMode', isDarkMode);
}

// Initialize when DOM is loaded or immediately if already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
  initDarkMode();
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const darkSwitch = node.querySelector('#darkSwitch') || 
                           (node.id === 'darkSwitch' ? node : null);
          if (darkSwitch) {
            initDarkMode();
          }
        }
      });
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

export { initDarkMode, handleDarkModeToggle };