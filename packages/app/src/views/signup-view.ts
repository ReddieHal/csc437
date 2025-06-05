import { html, customElement } from 'lit/decorators.js';
import { View } from '@calpoly/mustang';

@customElement('signup-view')
export class SignupView extends View {
  render() {
    return html`
      <ranch-header></ranch-header>
      <main><signup-form></signup-form></main>
    `;
  }
}
