import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

export class RanchPersonCard extends LitElement {
  @property() role!: string;                              
  @property() experience!: string;                        
  @property({ attribute: 'detail-link' }) detailLink = '';

  static styles = css`
    :host {
      display: block;
      background-color: var(--color-background-card, white);
      border: 1px solid var(--color-border, #ddd);
      border-radius: var(--border-radius, 5px);
      padding: var(--spacing-lg, 20px);
      margin-bottom: var(--spacing-lg, 20px);
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: background-color 0.3s ease, border-color 0.3s ease;
    }

    h3 {
      font-family: var(--font-display, serif);
      margin-top: 0;
      margin-bottom: var(--spacing-sm, 10px);
    }

    a {
      color: var(--color-accent, #1a5632);
      text-decoration: none;
    }

    a:hover {
      color: var(--color-accent-hover, #123b22);
      text-decoration: underline;
    }

    p {
      margin: var(--spacing-xs, 8px) 0;
    }

    strong {
      font-weight: bold;
    }

    .detail-link {
      display: block;
      margin-top: var(--spacing-md, 15px);
    }
  `;

  override render() {
    return html`
      <h3><a href=${this.detailLink || '#'}><slot></slot></a></h3>

      ${this.role        ? html`<p><strong>Role:</strong> ${this.role}</p>` : ''}
      ${this.experience  ? html`<p><strong>Experience:</strong> ${this.experience}</p>` : ''}

      <slot name="supervisors"></slot>
      <slot name="managed-resources"></slot>

      ${this.detailLink
        ? html`<p><a href=${this.detailLink} class="detail-link">View Details →</a></p>`
        : ''}
    `;
  }
}