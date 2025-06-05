import { css, html, LitElement } from "lit";
import { define } from "@calpoly/mustang";
import { RanchPeople } from "../components/ranch-people";

define({
  "ranch-people": RanchPeople
});

export class HomeViewElement extends LitElement {
  // Disable Shadow DOM to use global styles
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <header>
        <svg class="icon">
          <use href="/icons/ncattle.svg#icon-cattle" />
        </svg>          
          
        <h1>Ranch Hand - Cattle Management System</h1>
        <p>Complete management solution for your cattle ranch operations</p>
      </header>

      <div class="dashboard-links">
        <a href="/app/people">People Management</a>
        <a href="/app/cattle">Cattle Management</a>
        <a href="/app/cattle/database">Cattle Database</a>
      </div>

      <h2>Ranch Operators</h2>
      <p>Select an operator to view their managed resources:</p>

      <div class="operator-list">
        <div class="operator-card">
          <h3><a href="/operators/john-smith.html">John Smith</a></h3>
          <p><strong>Role:</strong> Ranch Manager</p>
          <p><strong>Experience:</strong> 15 years</p>
          <p><strong>Managing:</strong> 3 farmhands, 240 cattle</p>
          <p><a href="/operators/john-smith.html">View Details →</a></p>
        </div>

        <div class="operator-card">
          <h3><a href="/operators/john-smith.html">John Smith</a></h3>
          <p><strong>Role:</strong> Ranch Manager</p>
          <p><strong>Experience:</strong> 15 years</p>
          <p><strong>Managing:</strong> 3 farmhands, 240 cattle</p>
          <p><a href="/operators/john-smith.html">View Details →</a></p>
        </div>

        <div class="operator-card">
          <h3><a href="/operators/josephine-smith.html">Josephine Smith</a></h3>
          <p><strong>Role:</strong> Ranch Manager</p>
          <p><strong>Experience:</strong> 15 years</p>
          <p><strong>Managing:</strong> 3 farmhands, 240 cattle</p>
          <p><a href="/operators/josephine-smith.html">View Details →</a></p>
        </div>

        <!-- using the module -->
        <ranch-people src="/data/ranchPeople.json"></ranch-people>
      </div>

      <div class="card">
        <h2>System Overview</h2>
        <p>The Ranch Hand Cattle Management System provides comprehensive tools for tracking:</p>
        <ul>
          <li>Ranch personnel including farmhands and veterinary contractors</li>
          <li>Cattle herds and individual animal records</li>
          <li>Medical history and treatments</li>
          <li>Breeding programs and genealogy</li>
          <li>Growth and production data</li>
          <li><strong>NEW:</strong> MongoDB database integration for real-time data management</li>
        </ul>
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
