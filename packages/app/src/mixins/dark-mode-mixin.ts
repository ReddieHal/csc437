// packages/app/src/mixins/dark-mode-mixin.ts
import { LitElement } from "lit";

export interface DarkModeMixinInterface {
  setupDarkMode(): void;
}

export const DarkModeMixin = <T extends new (...args: any[]) => LitElement>(
  Base: T
) => {
  return class extends Base implements DarkModeMixinInterface {
    connectedCallback() {
      super.connectedCallback();
      this.setupDarkMode();
    }

    setupDarkMode() {
      // Wait for the element to be fully rendered
      this.updateComplete.then(() => {
        const darkSwitch = this.shadowRoot?.querySelector('#darkSwitch') as HTMLInputElement;
        
        if (darkSwitch) {
          const isDarkMode = localStorage.getItem('darkMode') === 'true';
          darkSwitch.checked = isDarkMode;
          
          darkSwitch.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement;
            const isDark = target.checked;
            document.body.classList.toggle('dark-mode', isDark);
            localStorage.setItem('darkMode', isDark.toString());
          });
        }
      });
    }
  };
};