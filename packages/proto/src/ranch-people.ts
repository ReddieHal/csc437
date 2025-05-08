import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import './ranch-person.js';           // compile target created in Lab 8

interface RanchPerson {
  name: string;
  role: string;
  experience: string;
  detailLink: string;
}

export class RanchPeople extends LitElement {
  @property() src?: string;

  @state() private people: RanchPerson[] = [];

  connectedCallback() {
    super.connectedCallback();
    if (this.src) this.hydrate(this.src);
  }

  private async hydrate(url: string) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      this.people = (await res.json()) as RanchPerson[];
    } catch (err) {
      console.error('ranch-people:', err);
    }
  }

  static styles = css`:host{display:block}`;

  override render() {
    return html`${this.people.map(p => html`
      <ranch-person-card
        role=${p.role}
        experience=${p.experience}
        detail-link=${p.detailLink}>
        ${p.name}
      </ranch-person-card>
    `)}`;
  }
}

customElements.define('ranch-people', RanchPeople);
