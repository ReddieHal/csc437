import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';

interface Cattle {
  cattleId: string;
  name: string;
  breed: string;
  dateOfBirth?: string;
  weight?: number;
  gender: 'male' | 'female';
  healthStatus?: string;
  location?: string;
  caretakerId?: string;
}

export class RanchCattle extends LitElement {
  @property() src?: string;

  @state() private cattle: Cattle[] = [];
  @state() private loading = true;
  @state() private error: string | null = null;

  connectedCallback() {
    super.connectedCallback();
    if (this.src) this.fetchCattle(this.src);
  }
  public async fetchCattle(url: string) {
    try {
      this.loading = true;
      this.error = null;
      
      const res = await fetch(url);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`${res.status} ${res.statusText}: ${errorText}`);
      }
      
      this.cattle = await res.json();
      this.loading = false;
    } catch (err) {
      console.error('Error fetching cattle:', err);
      this.error = err instanceof Error ? err.message : 'Unknown error';
      this.loading = false;
    }
  }

  static styles = css`
    :host {
      display: block;
      padding: 20px;
    }
    
    .cattle-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    .cattle-card {
      border: 1px solid var(--color-border, #ddd);
      border-radius: var(--border-radius, 5px);
      padding: 15px;
      background-color: var(--color-background-card, white);
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: transform 0.3s ease;
    }
    
    .cattle-card:hover {
      transform: translateY(-5px);
    }
    
    h3 {
      margin-top: 0;
      color: var(--color-accent-hover, #123b22);
      font-family: var(--font-display, serif);
    }
    
    .loading, .error {
      padding: 20px;
      text-align: center;
      border-radius: var(--border-radius, 5px);
      margin: 20px 0;
    }
    
    .loading {
      background-color: #f8f9fa;
    }
    
    .error {
      background-color: #f8d7da;
      color: #721c24;
    }
    
    .detail-link {
      margin-top: 10px;
      display: block;
      color: var(--color-accent, #1a5632);
      text-decoration: none;
    }
    
    .detail-link:hover {
      text-decoration: underline;
    }
  `;

  render() {
    return html`
      ${this.loading ? 
        html`<div class="loading">Loading cattle data...</div>` : 
        this.error ? 
          html`<div class="error">Error: ${this.error}</div>` :
          html`
            <div class="cattle-grid">
              ${this.cattle.map(animal => html`
                <div class="cattle-card">
                  <h3>${animal.name} (#${animal.cattleId})</h3>
                  <p><strong>Breed:</strong> ${animal.breed}</p>
                  <p><strong>Gender:</strong> ${animal.gender === 'male' ? 'Bull' : 'Heifer'}</p>
                  ${animal.weight ? html`<p><strong>Weight:</strong> ${animal.weight} lbs</p>` : ''}
                  ${animal.dateOfBirth ? html`<p><strong>DOB:</strong> ${new Date(animal.dateOfBirth).toLocaleDateString()}</p>` : ''}
                  ${animal.healthStatus ? html`<p><strong>Health:</strong> ${animal.healthStatus}</p>` : ''}
                  ${animal.location ? html`<p><strong>Location:</strong> ${animal.location}</p>` : ''}
                  <a href="/cattle/details/${animal.cattleId}" class="detail-link">View Details →</a>
                </div>
              `)}
            </div>
          `
      }
    `;
  }
}

customElements.define('ranch-cattle', RanchCattle);