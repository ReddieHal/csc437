import { View } from "@calpoly/mustang";
import { html, css } from "lit";
import { state } from "lit/decorators.js";
import { Cattle } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class CattleDatabaseViewElement extends View<Model, Msg> {
  
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
    this.dispatchMessage(["cattle/load", {}]);
  }

  static styles = css`
    :host {
      display: block;
      padding: var(--spacing-lg);
    }

    .cattle-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .cattle-card {
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      padding: 15px;
      background-color: var(--color-background-card);
    }

    .form {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-top: 20px;
    }

    .form label {
      display: flex;
      flex-direction: column;
    }

    .form input, .form select {
      padding: 8px;
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
    }

    .form button {
      grid-column: 1 / -1;
      padding: 10px;
      background-color: var(--color-accent);
      color: var(--color-text-light);
      border: none;
      border-radius: var(--border-radius);
      cursor: pointer;
      width: 200px;
    }

    .loading {
      text-align: center;
      padding: 20px;
      color: var(--color-accent);
    }

    .error {
      background-color: #ffebee;
      color: #d32f2f;
      padding: 15px;
      border-radius: var(--border-radius);
      margin: 20px 0;
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
      <header>
        <svg class="icon">
          <use href="/icons/ncattle.svg#icon-cattle" />
        </svg>
        <h1>Cattle Database</h1>
        <p>View and manage cattle records from the MongoDB database</p>
      </header>

      ${this.error ? html`
        <div class="error">
          <strong>Error:</strong> ${this.error}
        </div>
      ` : ''}

      <section>
        <h2>Cattle Records</h2>
        ${this.loading ? 
          html`<div class="loading">Loading cattle data...</div>` :
          html`
            <div class="cattle-grid">
              ${this.cattle.map(animal => html`
                <div class="cattle-card">
                  <h3>${animal.name} (#${animal.cattleId})</h3>
                  <p><strong>Breed:</strong> ${animal.breed}</p>
                  <p><strong>Gender:</strong> ${animal.gender === 'male' ? 'Bull' : 'Heifer'}</p>
                  ${animal.weight ? html`<p><strong>Weight:</strong> ${animal.weight} lbs</p>` : ''}
                  ${animal.healthStatus ? html`<p><strong>Health:</strong> ${animal.healthStatus}</p>` : ''}
                </div>
              `)}
            </div>
          `
        }
      </section>

      <section>
        <h2>Add New Cattle</h2>
        <form class="form" @submit=${this._handleSubmit}>
          <label>
            <span>Cattle ID:</span>
            <input type="text" name="cattleId" required>
          </label>
          <label>
            <span>Name:</span>
            <input type="text" name="name" required>
          </label>
          <label>
            <span>Breed:</span>
            <input type="text" name="breed" required>
          </label>
          <label>
            <span>Gender:</span>
            <select name="gender" required>
              <option value="male">Bull</option>
              <option value="female">Heifer</option>
            </select>
          </label>
          <label>
            <span>Weight (lbs):</span>
            <input type="number" name="weight">
          </label>
          <label>
            <span>Date of Birth:</span>
            <input type="date" name="dateOfBirth">
          </label>
          <label>
            <span>Health Status:</span>
            <select name="healthStatus">
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </label>
          <label>
            <span>Location:</span>
            <input type="text" name="location">
          </label>
          <button type="submit">Add Cattle</button>
        </form>
      </section>
    `;
  }

  private _handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const cattleData: any = {};

    for (const [key, value] of formData.entries()) {
      if (value !== null && value !== '') {
        cattleData[key] = value;
      }
    }

    if (cattleData.weight) {
      cattleData.weight = Number(cattleData.weight);
    }

    if (cattleData.dateOfBirth) {
      cattleData.dateOfBirth = new Date(cattleData.dateOfBirth);
    }

    this.dispatchMessage(["cattle/create", { cattle: cattleData }]);
    
    form.reset();
  }
}

customElements.define('cattle-database-view', CattleDatabaseViewElement);