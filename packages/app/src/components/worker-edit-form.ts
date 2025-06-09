import { define, Form, View } from "@calpoly/mustang";
import { html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { RanchWorker } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class WorkerEditFormElement extends View<Model, Msg> {
  static uses = define({
    "mu-form": Form.Element,
  });

  @property()
  workerId?: string;

  @state()
  get worker(): RanchWorker | undefined {
    return this.model.selectedWorker;
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
    if (this.workerId) {
      this.dispatchMessage(["worker/select", { workerId: this.workerId }]);
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

    textarea {
      resize: vertical;
      min-height: 100px;
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
  `;

  render() {
    if (this.loading) {
      return html`<div class="loading">Loading worker data...</div>`;
    }

    if (this.error) {
      return html`
        <div class="error">
          <strong>Error:</strong> ${this.error}
        </div>
      `;
    }

    const isEditing = !!this.worker;
    const title = isEditing ? `Edit ${this.worker?.name}` : "Add New Ranch Worker";

    return html`
      <div class="breadcrumb">
        <a href="/app">Home</a> &gt; 
        <a href="/app/people">People Management</a> &gt; 
        <span>${title}</span>
      </div>

      <header>
        <svg class="icon">
          <use href="/icons/ntractor.svg#icon-tractor" />
        </svg>
        <h1>${title}</h1>
        <p>${isEditing ? 'Update worker information' : 'Add a new ranch worker to the team'}</p>
      </header>

      <div class="form-container">
        <mu-form
          .init=${this.worker}
          @mu-form:submit=${this.handleSubmit}>
          
          <div class="form-row">
            <div class="form-group">
              <label>
                <span>Worker ID *</span>
                <input 
                  name="userid" 
                  type="text" 
                  required 
                  ?disabled=${isEditing}
                  placeholder="e.g., W001">
              </label>
            </div>
            
            <div class="form-group">
              <label>
                <span>Ranch ID *</span>
                <input 
                  name="ranchid" 
                  type="text" 
                  required
                  placeholder="e.g., R001">
              </label>
            </div>
          </div>

          <div class="form-group full-width">
            <label>
              <span>Full Name *</span>
              <input 
                name="name" 
                type="text" 
                required
                placeholder="e.g., John Smith">
            </label>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>
                <span>Role *</span>
                <select name="role" required>
                  <option value="">Select role</option>
                  <option value="Senior Farmhand">Senior Farmhand</option>
                  <option value="Farmhand">Farmhand</option>
                  <option value="Veterinarian">Veterinarian</option>
                  <option value="Ranch Manager">Ranch Manager</option>
                  <option value="Equipment Operator">Equipment Operator</option>
                  <option value="Feed Specialist">Feed Specialist</option>
                </select>
              </label>
            </div>
            
            <div class="form-group">
              <label>
                <span>Experience</span>
                <input 
                  name="experience" 
                  type="text"
                  placeholder="e.g., 5 years">
              </label>
            </div>
          </div>

          <div class="form-group full-width">
            <label>
              <span>Profile Image URL</span>
              <input 
                name="image" 
                type="url"
                placeholder="https://example.com/profile.jpg">
            </label>
          </div>

          <div class="actions">
            <button type="submit">
              ${isEditing ? 'Update Worker' : 'Add Worker'}
            </button>
            <button type="button" class="cancel-button" @click=${this.handleCancel}>
              Cancel
            </button>
          </div>
        </mu-form>
      </div>
    `;
  }

  handleSubmit(event: Form.SubmitEvent<RanchWorker>) {
    const workerData = event.detail;

    if (this.worker) {
      this.dispatchMessage([
        "worker/save",
        {
          workerId: this.worker.userid,
          worker: workerData,
          onSuccess: () => {
            window.history.pushState({}, '', '/app/people');
            window.dispatchEvent(new PopStateEvent('popstate'));
          },
          onFailure: (error: Error) => {
            console.log("ERROR:", error);
          }
        }
      ]);
    } else {
      console.log("Creating new worker:", workerData);
      window.history.pushState({}, '', '/app/people');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }

  handleCancel() {
    window.history.pushState({}, '', '/app/people');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

customElements.define('worker-edit-form', WorkerEditFormElement);