// src/components/ranch-cattle.ts
import { View } from "@calpoly/mustang";
import { html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { Cattle } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class RanchCattle extends View<Model, Msg> {
  @property() src?: string;

  @state()
  get cattle(): Cattle[] {
    return this.model.cattle || [];
  }

  @state()
  get loading(): boolean {
    return this.model.loading || false;
  }

  @state()
  get error(): string | undefined {
    return this.model.error;
  }

  constructor() {
    super("ranch:model");
  }

  connectedCallback() {
    super.connectedCallback();
    // Load cattle data when component connects
    this.dispatchMessage(["cattle/load", {}]);
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
      color: var(--color-accent);
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
                  <a href="/app/cattle/details/${animal.cattleId}" class="detail-link">View Details →</a>
                </div>
              `)}
            </div>
          `
      }
    `;
  }
}

customElements.define('ranch-cattle', RanchCattle);