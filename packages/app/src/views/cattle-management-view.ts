// src/views/cattle-management-view.ts
import { LitElement, html, css } from 'lit';
import { state } from 'lit/decorators.js';

export class CattleManagementViewElement extends LitElement {
  @state() private activeTab = 'herds';
  @state() private stats = {
    totalCattle: 440,
    herds: 4,
    bulls: 8,
    calves: 26
  };

  static styles = css`
    :host {
      display: block;
      padding: var(--spacing-lg);
    }

    .breadcrumb {
      margin-bottom: var(--spacing-lg);
    }

    .breadcrumb a {
      color: var(--color-accent);
      text-decoration: none;
    }

    .breadcrumb a:hover {
      text-decoration: underline;
    }

    .stats {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-lg);
    }

    .stat-card {
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      padding: var(--spacing-md);
      width: 200px;
      background-color: var(--color-background-card);
      text-align: center;
    }

    .stat-card h3 {
      margin-top: 0;
      color: var(--color-accent-hover);
      font-size: 2rem;
    }

    .tabs {
      display: flex;
      border-bottom: 1px solid var(--color-border);
      margin-bottom: var(--spacing-lg);
    }

    .tabs button {
      background-color: var(--color-background-muted);
      border: none;
      padding: var(--spacing-sm) var(--spacing-md);
      cursor: pointer;
      font-size: 16px;
      border-radius: var(--border-radius) var(--border-radius) 0 0;
    }

    .tabs button.active {
      background-color: var(--color-accent);
      color: var(--color-text-light);
    }

    .herd-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-lg);
    }

    .herd-card {
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      padding: var(--spacing-md);
      width: 300px;
      background-color: var(--color-background-card);
    }

    .herd-card h3 {
      margin-top: 0;
      color: var(--color-accent-hover);
    }

    .herd-card a {
      color: var(--color-accent);
      text-decoration: none;
    }

    .herd-card a:hover {
      text-decoration: underline;
    }

    svg.icon {
      display: inline;
      width: 7em;
      height: 7em;
      fill: var(--color-accent-light);
      vertical-align: top;
    }
  `;

  render() {
    return html`
      <div class="breadcrumb">
        <a href="/app">Home</a> &gt; <span>Cattle Management</span>
      </div>

      <header>
        <svg class="icon">
          <use href="/public/icons/nfield.svg#icon-field" />
        </svg>
        <h1>Cattle Management</h1>
        <p>Manage herds, track individual cattle, and monitor health status</p>
      </header>

      <div class="stats">
        <div class="stat-card">
          <h3>${this.stats.totalCattle}</h3>
          <p>Total Cattle</p>
        </div>
        <div class="stat-card">
          <h3>${this.stats.herds}</h3>
          <p>Herds</p>
        </div>
        <div class="stat-card">
          <h3>${this.stats.bulls}</h3>
          <p>Bulls</p>
        </div>
        <div class="stat-card">
          <h3>${this.stats.calves}</h3>
          <p>Calves (less than 6 months)</p>
        </div>
      </div>

      <div class="tabs">
        <button 
          class=${this.activeTab === 'herds' ? 'active' : ''} 
          @click=${() => this.activeTab = 'herds'}>
          Herds
        </button>
        <button 
          class=${this.activeTab === 'individual' ? 'active' : ''} 
          @click=${() => this.activeTab = 'individual'}>
          Individual Cattle
        </button>
      </div>

      ${this.activeTab === 'herds' ? this.renderHerds() : this.renderIndividualCattle()}
    `;
  }

  private renderHerds() {
    return html`
      <h2>Active Herds</h2>
      
      <div class="herd-list">
        <div class="herd-card">
          <h3><a href="/app/cattle/herds/example">Example Herd</a></h3>
          <p><strong>Count:</strong> 150 cattle</p>
          <p><strong>Type:</strong> Mixed</p>
          <p><strong>Location:</strong> Example Pasture (250 acres)</p>
          <p><strong>Primary Caretaker:</strong> <a href="/app/people/farmhands/farmhand">Farmhand</a></p>
          <p><a href="/app/cattle/herds/example">View Herd Details →</a></p>
        </div>

        <!-- Additional herd cards can be added here -->
        <div class="herd-card">
          <h3><a href="/app/cattle/herds/north-pasture">North Pasture Herd</a></h3>
          <p><strong>Count:</strong> 120 cattle</p>
          <p><strong>Type:</strong> Breeding</p>
          <p><strong>Location:</strong> North Pasture (180 acres)</p>
          <p><strong>Primary Caretaker:</strong> <a href="/app/people/farmhands/farmhand">Farmhand</a></p>
          <p><a href="/app/cattle/herds/north-pasture">View Herd Details →</a></p>
        </div>

        <div class="herd-card">
          <h3><a href="/app/cattle/herds/south-field">South Field Herd</a></h3>
          <p><strong>Count:</strong> 90 cattle</p>
          <p><strong>Type:</strong> Grazing</p>
          <p><strong>Location:</strong> South Field (200 acres)</p>
          <p><strong>Primary Caretaker:</strong> <a href="/app/people/farmhands/farmhand">Farmhand</a></p>
          <p><a href="/app/cattle/herds/south-field">View Herd Details →</a></p>
        </div>
      </div>
    `;
  }

  private renderIndividualCattle() {
    return html`
      <h2>Individual Cattle Management</h2>
      
      <div style="margin-bottom: var(--spacing-lg);">
        <p>Use the <a href="/app/cattle/database">Cattle Database</a> to view and manage individual cattle records.</p>
        <p>Key features:</p>
        <ul>
          <li>View all cattle with detailed information</li>
          <li>Add new cattle to the system</li>
          <li>Filter by gender, age, and other criteria</li>
          <li>Track health status and breeding records</li>
        </ul>
      </div>

      <div class="herd-card">
        <h3><a href="/app/cattle/database">Access Cattle Database</a></h3>
        <p>Complete database of all cattle with MongoDB integration</p>
        <p><a href="/app/cattle/database">Open Database →</a></p>
      </div>
    `;
  }
}

customElements.define('cattle-management-view', CattleManagementViewElement);