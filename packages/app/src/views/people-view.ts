import { css, html, LitElement } from "lit";

export class PeopleViewElement extends LitElement {
  // Disable Shadow DOM to use global styles
  createRenderRoot() {
    return this;
  }

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
          <h3><a href="/people/farmhands/farmhand.html">Farmhand</a></h3>
          <p><strong>Role:</strong> Senior Farmhand</p>
          <p><strong>Experience:</strong> 8 years</p>
          <p><strong>Supervisor:</strong> <a href="/operators/john-smith.html">John Smith</a></p>
          <p><strong>Supervisor:</strong> <a href="/operators/josephine-smith.html">Josephine Smith</a></p>
          <p><a href="/people/farmhands/farmhand.html">View Details →</a></p>
        </div>
      </div>

      <h2>Veterinarians & Contractors</h2>
      
      <div class="person-list">
        <div class="person-card">
          <!-- Add veterinarian cards here when available -->
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
}
