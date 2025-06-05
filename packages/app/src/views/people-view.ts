import { css, html, LitElement } from "lit";
import { DarkModeMixin } from "../mixins/dark-mode-mixin";

export class PeopleViewElement extends DarkModeMixin(LitElement) {
  render() {
    return html`
      <div class="breadcrumb">
        <a href="/app">Home</a> &gt; <span>People Management</span>
      </div>

      <header>
        <svg class="icon">
          <use href="/icons/ntractor.svg#icon-tractor" />
        </svg>
        <h1>People Management</h1>
        <p>Manage ranch personnel, farmhands, and veterinary contractors</p>
      </header>

      <div class="tabs">
        <button class="active">All Personnel</button>
        <button>Farmhands</button>
        <button>Veterinarians</button>
        <button>Contractors</button>
      </div>

      <h2>Farm Personnel</h2>
      
      <div class="person-list">
        <div class="person-card">
          <h3><a href="/app/people/farmhands/farmhand">Farmhand</a></h3>
          <p><strong>Role:</strong> Senior Farmhand</p>
          <p><strong>Experience:</strong> 8 years</p>
          <p><strong>Supervisor:</strong> <a href="/app/operators/john-smith">John Smith</a></p>
          <p><strong>Supervisor:</strong> <a href="/app/operators/josephine-smith">Josephine Smith</a></p>
          <p><a href="/app/people/farmhands/farmhand">View Details →</a></p>
        </div>
      </div>

      <h2>Veterinarians & Contractors</h2>
      
      <div class="person-list">
        <div class="person-card">
          <h3><a href="/app/people/veterinarians/ava-ramirez">Ava Ramirez</a></h3>
          <p><strong>Role:</strong> Veterinarian</p>
          <p><strong>Experience:</strong> 7 years</p>
          <p><a href="/app/people/veterinarians/ava-ramirez">View Details →</a></p>
        </div>
      </div>

      <footer>
        <label class="dark-mode-toggle">
          <input id="darkSwitch" type="checkbox" autocomplete="off">
          Dark mode
        </label>
      </footer>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    
    .dark-mode-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      margin-top: 20px;
    }
    
    .dark-mode-toggle input {
      cursor: pointer;
    }
  `;
}