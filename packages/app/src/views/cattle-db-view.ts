import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { define, Observer } from "@calpoly/mustang";
import { RanchCattle } from "../components/ranch-cattle";

define({
  "ranch-cattle": RanchCattle
});

export class CattleDbViewElement extends LitElement {
  @state() private cattleUrl = "/api/cattle";
  @state() private refreshKey = 0;

  _authObserver = new Observer(this, "ranch:auth");

  connectedCallback() {
    super.connectedCallback();
    this.setupDarkMode();
  }

  setupDarkMode() {
    const darkSwitch = this.shadowRoot?.querySelector('#darkSwitch') || 
                      document.querySelector('#darkSwitch') as HTMLInputElement;
    
    if (darkSwitch) {
      const isDarkMode = localStorage.getItem('darkMode') === 'true';
      darkSwitch.checked = isDarkMode;
      document.body.classList.toggle('dark-mode', isDarkMode);
      
      darkSwitch.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        const isDark = target.checked;
        document.body.classList.toggle('dark-mode', isDark);
        localStorage.setItem('darkMode', isDark.toString());
      });
    }
  }

  handleTabClick(filter: string) {
    // Remove active class from all tabs
    const tabs = this.shadowRoot?.querySelectorAll('.tabs button');
    tabs?.forEach(tab => tab.classList.remove('active'));
    
    // Add active class to clicked tab
    const clickedTab = this.shadowRoot?.querySelector(`[data-filter="${filter}"]`);
    clickedTab?.classList.add('active');
    
    // Update URL based on filter
    switch (filter) {
      case 'bulls':
        this.cattleUrl = '/api/cattle?gender=male';
        break;
      case 'heifers':
        this.cattleUrl = '/api/cattle?gender=female';
        break;
      case 'calves':
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        this.cattleUrl = `/api/cattle?dateOfBirth[gte]=${oneYearAgo.toISOString()}`;
        break;
      default:
        this.cattleUrl = '/api/cattle';
    }
    
    // Force refresh by incrementing key
    this.refreshKey++;
  }

  async handleFormSubmit(event: Event) {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const cattleData: any = {};
    
    for (const [key, value] of formData.entries()) {
      if (value !== null && value !== '') {
        cattleData[key] = value;
      }
    }
    
    const requiredFields = ['cattleId', 'name', 'breed', 'gender'];
    const missingFields = requiredFields.filter(field => !cattleData[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    // Convert dateOfBirth to proper date format if present
    if (cattleData.dateOfBirth) {
      cattleData.dateOfBirth = new Date(cattleData.dateOfBirth).toISOString();
    }
    
    // Convert weight to number if present
    if (cattleData.weight) {
      cattleData.weight = Number(cattleData.weight);
    }
    
    console.log('Submitting cattle data:', cattleData);
    
    try {
      const response = await fetch('/api/cattle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cattleData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error: ${response.status}`);
      }
      
      // Success - reset form and refresh data
      form.reset();
      alert('Cattle added successfully!');
      
      // Force refresh of cattle list
      this.refreshKey++;
      
    } catch (error) {
      console.error('Error adding cattle:', error);
      alert(`Failed to add cattle: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  render() {
    return html`
      <div class="breadcrumb">
        <a href="/app">Home</a> &gt; <span>Cattle Database</span>
      </div>

      <header>
        <svg class="icon">
          <use href="/icons/ncattle.svg#icon-cattle" />
        </svg>          
        <h1>Cattle Database</h1>
        <p>View and manage cattle records from the MongoDB database</p>
      </header>

      <div class="tabs">
        <button class="active" data-filter="all" @click=${() => this.handleTabClick('all')}>All Cattle</button>
        <button data-filter="bulls" @click=${() => this.handleTabClick('bulls')}>Bulls</button>
        <button data-filter="heifers" @click=${() => this.handleTabClick('heifers')}>Heifers</button>
        <button data-filter="calves" @click=${() => this.handleTabClick('calves')}>Calves</button>
      </div>

      <section class="section">
        <h2>Cattle Records</h2>
        <p>Below are the cattle records stored in the MongoDB database:</p>
        
        <ranch-cattle src="${this.cattleUrl}" .key=${this.refreshKey}></ranch-cattle>
      </section>

      <section class="section">
        <h2>Add New Cattle</h2>
        <form class="form" @submit=${this.handleFormSubmit}>
          <label>
            <span>Cattle ID:</span>
            <input type="text" name="cattleId" required>
          </label>
          <label>
            <span>Name:</span>
            <input type="text" name="name" required>
          </label>
          <label>
            <span>Breed:</span>
            <input type="text" name="breed" required>
          </label>
          <label>
            <span>Gender:</span>
            <select name="gender" required>
              <option value="male">Bull</option>
              <option value="female">Heifer</option>
            </select>
          </label>
          <label>
            <span>Weight (lbs):</span>
            <input type="number" name="weight">
          </label>
          <label>
            <span>Date of Birth:</span>
            <input type="date" name="dateOfBirth">
          </label>
          <label>
            <span>Health Status:</span>
            <select name="healthStatus">
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </label>
          <label>
            <span>Location:</span>
            <input type="text" name="location">
          </label>
          <button type="submit">Add Cattle</button>
        </form>
      </section>

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