import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
//import { Observer, Events } from '@calpoly/mustang';

export class HeaderElement extends LitElement {
  static _initialized = false;

  static initializeOnce() {
    if (!HeaderElement._initialized) {
      HeaderElement._initialized = true;
    }
  }

  @property({ type: Boolean }) loggedIn = false;
  @property() userid?: string;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    // Decode JWT directly from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        if (decoded?.username) {
          this.loggedIn = true;
          this.userid = decoded.username;
        }
      } catch (err) {
        console.error("Invalid token:", err);
        this.loggedIn = false;
        this.userid = undefined;
      }
    } else {
      this.loggedIn = false;
      this.userid = undefined;
    }

    this.requestUpdate();
    this.setupDarkMode();
  }

  setupDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', isDarkMode);
    
    this.updateComplete.then(() => {
      const darkSwitch = this.shadowRoot?.querySelector('#darkSwitch') as HTMLInputElement;
      if (darkSwitch) {
        darkSwitch.checked = isDarkMode;
      }
      this.updateIconOpacity(isDarkMode);
    });
  }

  updateIconOpacity(isDarkMode: boolean) {
    const sunIcon = this.shadowRoot?.querySelector('.toggle-icon.sun') as HTMLElement;
    const moonIcon = this.shadowRoot?.querySelector('.toggle-icon.moon') as HTMLElement;
    
    if (sunIcon && moonIcon) {
      if (isDarkMode) {
        sunIcon.style.opacity = '0.7';
        moonIcon.style.opacity = '1';
      } else {
        sunIcon.style.opacity = '1';
        moonIcon.style.opacity = '0.7';
      }
    }
  }

  handleDarkModeToggle(event: Event) {
    event.preventDefault();
    const target = event.target as HTMLInputElement;
    const isDark = target.checked;
    
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('darkMode', isDark.toString());
    
    // Update icon opacity
    this.updateIconOpacity(isDark);
    
    // Dispatch custom event for other components that might need to know
    const customEvent = new CustomEvent('darkmode:toggle', {
      bubbles: true,
      detail: { isDarkMode: isDark }
    });
    document.body.dispatchEvent(customEvent);
  }

  renderSignOutButton() {
    return html`
      <button
        @click=${() => {
          localStorage.removeItem("token");
          window.location.href = "/login.html";
        }}
        class="auth-button"
      >
        Sign Out
      </button>
    `;
  }

  renderSignInButton() {
    return html` <a href="/login.html" class="auth-button"> Sign In </a> `;
  }

  static styles = css`
    :host {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-md, 15px);
      background-color: var(--color-accent, #1a5632);
      color: var(--color-text-light, white);
      margin-bottom: var(--spacing-lg, 20px);
      border-radius: var(--border-radius, 5px);
    }

    .logo {
      font-family: var(--font-display);
      font-size: 1.5rem;
      margin: 0;
    }

    .header-controls {
      display: flex;
      align-items: center;
      gap: var(--spacing-lg, 20px);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-md, 15px);
    }

    .welcome-text {
      margin: 0;
    }

    .auth-button {
      background-color: var(--color-background-page, white);
      color: var(--color-accent, #1a5632);
      border: none;
      border-radius: var(--border-radius, 5px);
      padding: 8px 16px;
      cursor: pointer;
      font-family: var(--font-body);
      font-size: 1rem;
      text-decoration: none;
      display: inline-block;
    }

    .auth-button:hover {
      background-color: var(--color-background-muted, #f2f2f2);
      text-decoration: none;
    }

    a.auth-button {
      text-decoration: none;
    }

    .dark-mode-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      color: var(--color-text-light, white);
      user-select: none;
    }

    .dark-mode-toggle input[type="checkbox"] {
      position: relative;
      width: 50px;
      height: 25px;
      appearance: none;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 25px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .dark-mode-toggle input[type="checkbox"]:checked {
      background-color: rgba(255, 255, 255, 0.4);
    }

    .dark-mode-toggle input[type="checkbox"]::before {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 21px;
      height: 21px;
      background-color: white;
      border-radius: 50%;
      transition: transform 0.3s ease;
    }

    .dark-mode-toggle input[type="checkbox"]:checked::before {
      transform: translateX(25px);
    }

    .dark-mode-toggle:hover input[type="checkbox"] {
      background-color: rgba(255, 255, 255, 0.3);
    }

    .dark-mode-toggle:hover input[type="checkbox"]:checked {
      background-color: rgba(255, 255, 255, 0.5);
    }

    /* Icons for the toggle - use :host context for shadow DOM */
    .toggle-icon {
      font-size: 1.1rem;
      transition: opacity 0.3s ease;
    }

    .toggle-icon.sun {
      opacity: 1;
    }

    .toggle-icon.moon {
      opacity: 0.7;
    }

    /* These won't work in shadow DOM, but we'll handle this in JS */
  `;

  render() {
    return html`
      <div class="logo">
        Ranch Hand - Cattle Management System
      </div>
      <div class="header-controls">
        <label class="dark-mode-toggle">
          <span class="toggle-icon sun">☀️</span>
          <input 
            type="checkbox" 
            id="darkSwitch"
            @change=${this.handleDarkModeToggle}
          />
          <span class="toggle-icon moon">🌙</span>
        </label>
        <div class="user-info">
          <p class="welcome-text">Hello, ${this.userid || "traveler"}</p>
          ${this.loggedIn
            ? this.renderSignOutButton()
            : this.renderSignInButton()}
        </div>
      </div>
    `;
  }
}

customElements.define('ranch-header', HeaderElement);