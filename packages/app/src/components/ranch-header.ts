import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { Observer, Events } from '@calpoly/mustang';

export class HeaderElement extends LitElement {
  @state() loggedIn = false;
  @state() userid?: string;

  private _authObserver?: Observer;

  connectedCallback() {
    super.connectedCallback();
    
    // Create observer after element is connected
    this._authObserver = new Observer(this, "ranch:auth");
    
    this._authObserver.observe((auth: any) => {
      const { user } = auth;

      if (user && user.authenticated) {
        this.loggedIn = true;
        this.userid = user.username;
      } else {
        this.loggedIn = false;
        this.userid = undefined;
      }
      
      // Request update to reflect the new state
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._authObserver = undefined;
  }

  renderSignOutButton() {
    return html`
      <button
        @click=${(e: Event) => {
          Events.relay(e, "auth:message", ["auth/signout"])
        }}
        class="auth-button"
      >
        Sign Out
      </button>
    `;
  }

  renderSignInButton() {
    return html`
      <a href="/login.html" class="auth-button">
        Sign In
      </a>
    `;
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
        <slot></slot>
      </div>
      <div class="user-info">
        <p class="welcome-text">
          Hello, ${this.userid || "traveler"}
        </p>
        ${this.loggedIn ? 
          this.renderSignOutButton() : 
          this.renderSignInButton()
        }
      </div>
    `;
  }
}