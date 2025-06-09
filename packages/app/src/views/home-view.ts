import { LitElement, html, css } from 'lit';

export class HomeViewElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: var(--spacing-lg);
    }

    .dashboard-links {
      display: flex;
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-xl);
    }

    .dashboard-links a {
      background-color: var(--color-accent);
      color: var(--color-text-light);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--border-radius);
      flex: 1;
      text-align: center;
      text-decoration: none;
    }

    .dashboard-links a:hover {
      background-color: var(--color-accent-hover);
    }

    .card {
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      padding: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }
  `;

  render() {
    return html`
      <header>
        <svg class="icon">
          <use href="/icons/ncattle.svg#icon-cattle" />
        </svg>
        <h1>Ranch Hand - Cattle Management System</h1>
        <p>Complete management solution for your cattle ranch operations</p>
      </header>

      <div class="dashboard-links">
        <a href="/app/people">People Management</a>
        <a href="/app/cattle">Cattle Management</a>
        <a href="/app/cattle/database">Cattle Database</a>
      </div>

      <div class="card">
        <h2>System Overview</h2>
        <p>The Ranch Hand Cattle Management System provides comprehensive tools for tracking:</p>
        <ul>
          <li>Ranch personnel including farmhands and veterinary contractors</li>
          <li>Cattle herds and individual animal records</li>
          <li>Medical history and treatments</li>
          <li>Breeding programs and genealogy</li>
          <li>Growth and production data</li>
          <li><strong>NEW:</strong> MongoDB database integration for real-time data management</li>
        </ul>
      </div>
    `;
  }
}

customElements.define('home-view', HomeViewElement);