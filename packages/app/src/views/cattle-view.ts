import { css, html, LitElement } from "lit";

export class CattleViewElement extends LitElement {
  render() {
    return html`
      <div class="breadcrumb">
        <a href="/app">Home</a> &gt; <span>Cattle Management</span>
      </div>

      <header>
        <svg class="icon">
          <use href="/icons/nfield.svg#icon-field" />
        </svg>
        <h1>Cattle Management</h1>
        <p>Manage herds, track individual cattle, and monitor health status</p>
      </header>

      <div class="stats">
        <div class="stat-card">
          <h3>440</h3>
          <p>Total Cattle</p>
        </div>
        <div class="stat-card">
          <h3>4</h3>
          <p>Herds</p>
        </div>
        <div class="stat-card">
          <h3>8</h3>
          <p>Bulls</p>
        </div>
        <div class="stat-card">
          <h3>26</h3>
          <p>Calves (less than 6 months)</p>
        </div>
      </div>

      <div class="tabs">
        <button class="active">Herds</button>
        <button>Individual Cattle</button>
      </div>

      <h2>Active Herds</h2>
      
      <div class="herd-list">
        <div class="herd-card">
          <h3><a href="/cattle/herds/examplepasture.html">Example Herd</a></h3>
          <p><strong>Count:</strong> 150 cattle</p>
          <p><strong>Type:</strong> Mixed</p>
          <p><strong>Location:</strong> Example Pasture (250 acres)</p>
          <p><strong>Primary Caretaker:</strong> <a href="/people/farmhands/farmhand.html">Farmhand</a></p>
          <p><a href="/cattle/herds/examplepasture.html">View Herd Details →</a></p>
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
  `;
}