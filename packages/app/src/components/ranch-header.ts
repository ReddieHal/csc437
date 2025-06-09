import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { Observer, Events } from '@calpoly/mustang';

export class HeaderElement extends LitElement {
  static _initialized = false;

  static initializeOnce() {
    if (!HeaderElement._initialized) {
      HeaderElement._initialized = true;
    }
  }

  constructor() {
    super();
    this.loggedIn = false;
    this.userid = undefined;
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
  `;

  render() {
    return html`
      <div class="logo">
        Ranch Hand - Cattle Management System
      </div>
      <div class="user-info">
        <p class="welcome-text">Hello, ${this.userid || "traveler"}</p>
        ${this.loggedIn
          ? this.renderSignOutButton()
          : this.renderSignInButton()}
      </div>
    `;
  }
}

customElements.define('ranch-header', HeaderElement);