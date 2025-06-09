import { define, Form, View } from "@calpoly/mustang";
import { html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { Cattle } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class CattleEditFormElement extends View<Model, Msg> {
  static uses = define({
    "mu-form": Form.Element,
  });

  @property()
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

  connectedCallback() {
    super.connectedCallback();
    if (this.cattleId) {
      this.dispatchMessage(["cattle/select", { cattleId: this.cattleId }]);
    }
  }

  static styles = css`
    :host {
      display: block;
      padding: var(--spacing-lg);
    }

    .form-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: var(--color-background-card);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      padding: var(--spacing-xl);
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

    mu-form {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--spacing-md);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    label {
      font-weight: bold;
      color: var(--color-text);
    }

    input, select, textarea {
      padding: var(--spacing-sm);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      font-family: var(--font-body);
      background-color: var(--color-background-page);
      color: var(--color-text);
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: var(--color-accent);
    }

    button {
      padding: var(--spacing-sm) var(--spacing-lg);
      background-color: var(--color-accent);
      color: var(--color-text-light);
      border: none;
      border-radius: var(--border-radius);
      font-family: var(--font-body);
      font-size: 16px;
      cursor: pointer;
      margin-top: var(--spacing-md);
    }

    button:hover {
      background-color: var(--color-accent-hover);
    }

    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
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

    .actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: flex-start;
      margin-top: var(--spacing-lg);
    }

    .cancel-button {
      background-color: #6c757d;
    }

    .cancel-button:hover {
      background-color: #5a6268;
    }

    svg.icon {
      display: inline;
      width: 7em;
      height: 7em;
      fill: var(--color-accent-light);
      vertical-align: top;
    }

    .add-button {
      background-color: var(--color-accent);
      color: var(--color-text-light);
      padding: var(--spacing-sm) var(--spacing-lg);
      border-radius: var(--border-radius);
      text-decoration: none;
      font-family: var(--font-body);
      font-weight: bold;
      border: none;
      cursor: pointer;
    }

    .add-button:hover {
      background-color: var(--color-accent-hover);
      text-decoration: none;
    }

    .detail-link {
      color: var(--color-accent);
      text-decoration: none;
      font-weight: bold;
      margin-top: var(--spacing-sm);
      display: inline-block;
    }

    .detail-link:hover {
      text-decoration: underline;
    }
  `;

  render() {
    if (this.loading) {
      return html`<div class="loading">Loading cattle data...</div>`;
    }

    if (this.error) {
      return html`
        <div class="error">
          <strong>Error:</strong> ${this.error}
        </div>
      `;
    }

    const isEditing = !!this.cattle;
    const title = isEditing ? `Edit ${this.cattle?.name}` : "Add New Cattle";

    return html`
      <div class="breadcrumb">
        <a href="/app">Home</a> &gt; 
        <a href="/app/cattle">Cattle Management</a> &gt; 
        <a href="/app/cattle/database">Database</a> &gt; 
        <span>${title}</span>
      </div>

      <header>
        <svg class="icon">
          <use href="/icons/ncattle.svg#icon-cattle" />
        </svg>
        <h1>${title}</h1>
        <p>${isEditing ? 'Update cattle information' : 'Add a new cattle record to the database'}</p>
      </header>

      <div class="form-container">
        <mu-form
          .init=${this.cattle}
          @mu-form:submit=${this.handleSubmit}>
          
          <div class="form-row">
            <div class="form-group">
              <label>
                <span>Cattle ID *</span>
                <input 
                  name="cattleId" 
                  type="text" 
                  required 
                  ?disabled=${isEditing}
                  placeholder="e.g., C001">
              </label>
            </div>
            
            <div class="form-group">
              <label>
                <span>Name *</span>
                <input 
                  name="name" 
                  type="text" 
                  required
                  placeholder="e.g., Bessie">
              </label>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>
                <span>Breed *</span>
                <input 
                  name="breed" 
                  type="text" 
                  required
                  placeholder="e.g., Holstein">
              </label>
            </div>
            
            <div class="form-group">
              <label>
                <span>Gender *</span>
                <select name="gender" required>
                  <option value="">Select gender</option>
                  <option value="male">Bull</option>
                  <option value="female">Heifer</option>
                </select>
              </label>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>
                <span>Date of Birth</span>
                <input 
                  name="dateOfBirth" 
                  type="date">
              </label>
            </div>
            
            <div class="form-group">
              <label>
                <span>Weight (lbs)</span>
                <input 
                  name="weight" 
                  type="number" 
                  min="0" 
                  step="1"
                  placeholder="e.g., 1200">
              </label>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>
                <span>Health Status</span>
                <select name="healthStatus">
                  <option value="">Select status</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </label>
            </div>
            
            <div class="form-group">
              <label>
                <span>Location</span>
                <input 
                  name="location" 
                  type="text"
                  placeholder="e.g., North Pasture">
              </label>
            </div>
          </div>

          <div class="form-group full-width">
            <label>
              <span>Caretaker ID</span>
              <input 
                name="caretakerId" 
                type="text"
                placeholder="e.g., W001">
            </label>
          </div>

          <div class="actions">
            <button type="submit">
              ${isEditing ? 'Update Cattle' : 'Add Cattle'}
            </button>
            <button type="button" class="cancel-button" @click=${this.handleCancel}>
              Cancel
            </button>
          </div>
        </mu-form>
      </div>
    `;
  }

  handleSubmit(event: Form.SubmitEvent<Cattle>) {
    const cattleData = event.detail;
    
    if (cattleData.weight) {
      cattleData.weight = Number(cattleData.weight);
    }

    if (cattleData.dateOfBirth) {
      cattleData.dateOfBirth = new Date(cattleData.dateOfBirth);
    }

    if (this.cattle) {
      this.dispatchMessage([
        "cattle/save",
        {
          cattleId: this.cattle.cattleId,
          cattle: cattleData,
          onSuccess: () => {
            window.history.pushState(
              {},
              '',
              `/app/cattle/details/${this.cattle?.cattleId}`
            );
            window.dispatchEvent(new PopStateEvent('popstate'));
          },
          onFailure: (error: Error) => {
            console.log("ERROR:", error);
          }
        }
      ]);
    } else {
      this.dispatchMessage([
        "cattle/create",
        {
          cattle: cattleData,
          onSuccess: () => {
            window.history.pushState({}, '', '/app/cattle/database');
            window.dispatchEvent(new PopStateEvent('popstate'));
          },
          onFailure: (error: Error) => {
            console.log("ERROR:", error);
          }
        }
      ]);
    }
  }

  handleCancel() {
    if (this.cattle) {
      // Navigate back to cattle detail view
      window.history.pushState(
        {},
        '',
        `/app/cattle/details/${this.cattle.cattleId}`
      );
    } else {
      // Navigate back to cattle database
      window.history.pushState({}, '', '/app/cattle/database');
    }
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

customElements.define('cattle-edit-form', CattleEditFormElement);