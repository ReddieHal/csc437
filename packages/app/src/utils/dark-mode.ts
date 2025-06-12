export function setupDarkMode() {
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  document.body.classList.toggle('dark-mode', isDarkMode);
  
  const setupToggles = () => {
    const darkSwitches = document.querySelectorAll('#darkSwitch');
    
    darkSwitches.forEach(darkSwitch => {
      if (darkSwitch instanceof HTMLInputElement) {
        darkSwitch.checked = isDarkMode;
        
        darkSwitch.removeEventListener('change', handleToggle);
        darkSwitch.addEventListener('change', handleToggle);
      }
    });
  };
  
  const handleToggle = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const isDark = target.checked;
    
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('darkMode', isDark.toString());
    
    const otherToggles = document.querySelectorAll('#darkSwitch');
    otherToggles.forEach(toggle => {
      if (toggle !== target && toggle instanceof HTMLInputElement) {
        toggle.checked = isDark;
      }
    });
  };
  
  setupToggles();
  
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            const darkSwitch = element.querySelector('#darkSwitch') || 
                             (element.id === 'darkSwitch' ? element : null);
            if (darkSwitch) {
              setupToggles();
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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupDarkMode);
} else {
  setupDarkMode();
}