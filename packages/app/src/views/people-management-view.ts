// src/views/people-management-view.ts
import { LitElement, html, css } from 'lit';
import { state } from 'lit/decorators.js';

interface RanchPerson {
  name: string;
  role: string;
  experience: string;
  detailLink: string;
}

export class PeopleManagementViewElement extends LitElement {
  @state() private people: RanchPerson[] = [];
  @state() private loading = true;
  @state() private activeTab = 'all';

  connectedCallback() {
    super.connectedCallback();
    this.loadPeople();
  }

  async loadPeople() {
    try {
      // Load from your JSON data or API
      const response = await fetch('/data/ranchPeople.json');
      if (response.ok) {
        this.people = await response.json();
      }
    } catch (error) {
      console.error('Error loading people:', error);
    } finally {
      this.loading = false;
    }
  }

  static styles = css`
    :host {
      display: block;
      padding: var(--spacing-lg);
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

    .person-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-lg);
    }

    .person-card {
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      padding: var(--spacing-md);
      width: 300px;
      background-color: var(--color-background-card);
    }

    .person-card h3 {
      margin-top: 0;
      color: var(--color-accent-hover);
    }

    .person-card a {
      color: var(--color-accent);
      text-decoration: none;
    }

    .person-card a:hover {
      text-decoration: underline;
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

    svg.icon {
      display: inline;
      width: 7em;
      height: 7em;
      fill: var(--color-accent-light);
      vertical-align: top;
    }
  `;

  render() {
    const filteredPeople = this.getFilteredPeople();

    return html`
      <div class="breadcrumb">
        <a href="/app">Home</a> &gt; <span>People Management</span>
      </div>

      <header>
        <svg class="icon">
          <use href="/icons/ntractor.svg#icon-tractor" />
        </svg>
        <h1>People Management</h1>
        <p>Manage ranch personnel, farmhands, and veterinary contractors</p>
      </header>

      <div class="tabs">
        <button 
          class=${this.activeTab === 'all' ? 'active' : ''} 
          @click=${() => this.activeTab = 'all'}>
          All Personnel
        </button>
        <button 
          class=${this.activeTab === 'farmhands' ? 'active' : ''} 
          @click=${() => this.activeTab = 'farmhands'}>
          Farmhands
        </button>
        <button 
          class=${this.activeTab === 'veterinarians' ? 'active' : ''} 
          @click=${() => this.activeTab = 'veterinarians'}>
          Veterinarians
        </button>
        <button 
          class=${this.activeTab === 'contractors' ? 'active' : ''} 
          @click=${() => this.activeTab = 'contractors'}>
          Contractors
        </button>
      </div>

      <h2>Farm Personnel</h2>
      
      ${this.loading ? 
        html`<p>Loading personnel...</p>` :
        html`
          <div class="person-list">
            ${filteredPeople.map(person => html`
              <div class="person-card">
                <h3><a href="${person.detailLink}">${person.name}</a></h3>
                <p><strong>Role:</strong> ${person.role}</p>
                <p><strong>Experience:</strong> ${person.experience}</p>
                <p><a href="${person.detailLink}">View Details →</a></p>
              </div>
            `)}
            
            <!-- Static example cards based on your proto -->
            <div class="person-card">
              <h3><a href="/app/people/farmhands/farmhand">Farmhand</a></h3>
              <p><strong>Role:</strong> Senior Farmhand</p>
              <p><strong>Experience:</strong> 8 years</p>
              <p><strong>Supervisor:</strong> <a href="/app/operators/john-smith">John Smith</a></p>
              <p><strong>Supervisor:</strong> <a href="/app/operators/josephine-smith">Josephine Smith</a></p>
              <p><a href="/app/people/farmhands/farmhand">View Details →</a></p>
            </div>
          </div>
        `
      }

      <h2>Veterinarians & Contractors</h2>
      <div class="person-list">
        <!-- Add contractor cards here based on your data -->
      </div>
    `;
  }

  private getFilteredPeople() {
    if (this.activeTab === 'all') {
      return this.people;
    }
    
    // Filter based on role - you can customize this logic
    return this.people.filter(person => {
      switch (this.activeTab) {
        case 'farmhands':
          return person.role.toLowerCase().includes('farmhand');
        case 'veterinarians':
          return person.role.toLowerCase().includes('veterinarian');
        case 'contractors':
          return person.role.toLowerCase().includes('contractor');
        default:
          return true;
      }
    });
  }
}

customElements.define('people-management-view', PeopleManagementViewElement);