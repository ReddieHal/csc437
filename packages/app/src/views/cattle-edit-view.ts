import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { define } from '@calpoly/mustang';
import { CattleEditFormElement } from '../components/cattle-edit-form';

define({
  "cattle-edit-form": CattleEditFormElement
});

export class CattleEditViewElement extends LitElement {
  @property({ attribute: "cattle-id" })
  cattleId?: string;

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <cattle-edit-form 
        cattle-id=${this.cattleId || ''}>
      </cattle-edit-form>
    `;
  }
}

customElements.define('cattle-edit-view', CattleEditViewElement);