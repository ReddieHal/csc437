import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('auth-guard')
export class AuthGuard extends LitElement {
  @property() redirect: string = '/login.html';

  connectedCallback() {
    super.connectedCallback();
    this.checkAuth();
  }

  private checkAuth() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      window.location.href = this.redirect;
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      
      if (Date.now() > exp) {
        localStorage.removeItem('token');
        window.location.href = this.redirect;
      }
    } catch (err) {
      localStorage.removeItem('token');
      window.location.href = this.redirect;
    }
  }

  static styles = css`
    :host {
      display: contents;
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}