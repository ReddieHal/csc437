import { View } from "@calpoly/mustang";
import { html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { Cattle } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class CattleDetailViewElement extends View<Model, Msg> {
  @property({ attribute: "cattle-id" })
  cattleId?: string;

  @state()
  get cattle(): Cattle | undefined {
    return this.model.selectedCattle;
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

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (
      name === "cattle-id" &&
      oldValue !== newValue &&
      newValue
    ) {
      this.dispatchMessage([
        "cattle/select",
        { cattleId: newValue }
      ]);
    }
  }

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

    .cattle-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-lg);
      margin-top: var(--spacing-lg);
    }

    .detail-card {
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      padding: var(--spacing-md);
      background-color: var(--color-background-card);
    }

    .detail-card h3 {
      margin-top: 0;
      color: var(--color-accent-hover);
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: var(--color-accent);
    }

    .error {
      background-color: #ffebee;
      color: #d32f2f;
      padding: 15px;
      border-radius: var(--border-radius);
      margin: 20px 0;
    }

    .not-found {
      text-align: center;
      padding: 40px;
      color: var(--color-text);
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
    if (this.loading) {
      return html`<div class="loading">Loading cattle details...</div>`;
    }

    if (this.error) {
      return html`
        <div class="error">
          <strong>Error:</strong> ${this.error}
        </div>
      `;
    }

    if (!this.cattle) {
      return html`
        <div class="not-found">
          <h2>Cattle Not Found</h2>
          <p>The cattle with ID "${this.cattleId}" was not found.</p>
          <a href="/app/cattle/database">← Back to Cattle Database</a>
        </div>
      `;
    }

    return html`
      <div class="breadcrumb">
        <a href="/app">Home</a> &gt; 
        <a href="/app/cattle">Cattle Management</a> &gt; 
        <a href="/app/cattle/database">Database</a> &gt; 
        <span>${this.cattle.name}</span>
      </div>

      <header>
        <svg class="icon">
          <use href="/icons/ncow.svg#icon-cow" />
        </svg>
        <h1>${this.cattle.name} (#${this.cattle.cattleId})</h1>
        <p>Detailed information for this ${this.cattle.gender === 'male' ? 'bull' : 'heifer'}</p>
      </header>

      <div class="cattle-details">
        <div class="detail-card">
          <h3>Basic Information</h3>
          <p><strong>Cattle ID:</strong> ${this.cattle.cattleId}</p>
          <p><strong>Name:</strong> ${this.cattle.name}</p>
          <p><strong>Breed:</strong> ${this.cattle.breed}</p>
          <p><strong>Gender:</strong> ${this.cattle.gender === 'male' ? 'Bull' : 'Heifer'}</p>
          ${this.cattle.dateOfBirth ? html`
            <p><strong>Date of Birth:</strong> ${new Date(this.cattle.dateOfBirth).toLocaleDateString()}</p>
            <p><strong>Age:</strong> ${this.calculateAge(this.cattle.dateOfBirth)} months</p>
          ` : ''}
        </div>

        <div class="detail-card">
          <h3>Physical Information</h3>
          ${this.cattle.weight ? html`
            <p><strong>Weight:</strong> ${this.cattle.weight} lbs</p>
          ` : html`<p>Weight not recorded</p>`}
          ${this.cattle.healthStatus ? html`
            <p><strong>Health Status:</strong> ${this.cattle.healthStatus}</p>
          ` : html`<p>Health status not recorded</p>`}
        </div>

        <div class="detail-card">
          <h3>Location & Care</h3>
          ${this.cattle.location ? html`
            <p><strong>Current Location:</strong> ${this.cattle.location}</p>
          ` : html`<p>Location not specified</p>`}
          ${this.cattle.caretakerId ? html`
            <p><strong>Caretaker ID:</strong> ${this.cattle.caretakerId}</p>
          ` : html`<p>No assigned caretaker</p>`}
        </div>

        <div class="detail-card">
          <h3>Actions</h3>
          <p>Management actions for this animal:</p>
          <ul>
            <li>Update health records</li>
            <li>Record weight measurements</li>
            <li>Update location</li>
            <li>Assign caretaker</li>
          </ul>
        </div>
      </div>
    `;
  }

  private calculateAge(dateOfBirth: Date | string): number {
    const birth = new Date(dateOfBirth);
    const now = new Date();
    const monthsDiff = (now.getFullYear() - birth.getFullYear()) * 12 + 
                      (now.getMonth() - birth.getMonth());
    return Math.max(0, monthsDiff);
  }
}

customElements.define('cattle-detail-view', CattleDetailViewElement);