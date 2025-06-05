import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";

export class OperatorViewElement extends LitElement {
  @property({ attribute: 'operator-id' }) operatorId = '';

  // Disable Shadow DOM to use global styles
  createRenderRoot() {
    return this;
  }

  getOperatorData() {
    // Simple mock data based on operator ID
    const operators: Record<string, any> = {
      'john-smith': {
        name: 'John Smith',
        role: 'Ranch Manager',
        experience: '15 years',
        email: 'john.smith@ranchhand.com',
        phone: '(555) 123-4567',
        farmhands: 3,
        herds: 2,
        cattle: 240
      },
      'josephine-smith': {
        name: 'Josephine Smith',
        role: 'Ranch Manager',
        experience: '15 years',
        email: 'josephine.smith@ranchhand.com',
        phone: '(555) 123-4568',
        farmhands: 3,
        herds: 2,
        cattle: 240
      }
    };
    
    return operators[this.operatorId] || operators['john-smith'];
  }

  render() {
    const operator = this.getOperatorData();
    
    return html`
      <div class="breadcrumb">
        <a href="/app">Home</a> &gt; <span>${operator.name}</span>
      </div>

      <header>
        <h1>${operator.name}</h1>
        <p>${operator.role}</p>
      </header>

      <div class="stats">
        <div class="stat-card">
          <h3>${operator.experience.split(' ')[0]}</h3>
          <p>Years Experience</p>
        </div>
        <div class="stat-card">
          <h3>${operator.farmhands}</h3>
          <p>Farmhands</p>
        </div>
        <div class="stat-card">
          <h3>${operator.herds}</h3>
          <p>Herds</p>
        </div>
        <div class="stat-card">
          <h3>${operator.cattle}</h3>
          <p>Total Cattle</p>
        </div>
      </div>

      <div class="section">
        <h2>Contact Information</h2>
        <p><strong>Email:</strong> ${operator.email}</p>
        <p><strong>Phone:</strong> ${operator.phone}</p>
        <p><strong>Office:</strong> Main Ranch Office</p>
      </div>

      <div class="section">
        <h2>Managed Personnel</h2>
        <div class="resource-list">
          <div class="resource-card">
            <h3><a href="/app/people/farmhands/farmhand">Farmhand</a></h3>
            <p><strong>Role:</strong> Senior Farmhand</p>
            <p><strong>Years:</strong> 8</p>
            <p><a href="/app/people/farmhands/farmhand">View Details →</a></p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Managed Herds</h2>
        <div class="resource-list">
          <div class="resource-card">
            <h3><a href="/app/cattle/herds/example">Example Herd</a></h3>
            <p><strong>Count:</strong> 150 cattle</p>
            <p><strong>Type:</strong> Mixed</p>
            <p><a href="/app/cattle/herds/example">View Details →</a></p>
          </div>
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