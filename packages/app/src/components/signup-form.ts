import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('signup-form')
export class SignupForm extends LitElement {
  @state() private err = '';

  private async handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const res = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fd.get('name'),
        email: fd.get('email'),
        password: fd.get('password'),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      window.dispatchEvent(
        new CustomEvent('auth:message', { detail: { token: data.token } })
      );
      location.href = '/app';             // bounce to home
    } else {
      this.err = (await res.json()).message ?? 'Sign-up failed';
    }
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <h2>Create account</h2>
        ${this.err && html`<p class="error">${this.err}</p>`}
        <label>
          Name
          <input name="name" required />
        </label>
        <label>
          Email
          <input type="email" name="email" required />
        </label>
        <label>
          Password
          <input type="password" name="password" minlength="8" required />
        </label>
        <button type="submit">Sign up</button>
      </form>
    `;
  }
}
