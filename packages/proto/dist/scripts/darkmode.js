
const darkModeToggle = document.getElementById('darkSwitch');

function initDarkMode() {
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  
  document.body.style.transition = 'none';
  document.body.classList.toggle('dark-mode', isDarkMode);
  darkModeToggle.checked = isDarkMode;
  
  void document.body.offsetWidth;
  
  setTimeout(() => {
    document.body.style.transition = '';
  }, 10);
  
  const darkModeLabel = darkModeToggle.closest('.dark-mode-toggle');
  darkModeLabel.addEventListener('change', handleDarkModeToggleChange);
  
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

document.addEventListener('DOMContentLoaded', initDarkMode);

export { initDarkMode, handleDarkModeToggle };