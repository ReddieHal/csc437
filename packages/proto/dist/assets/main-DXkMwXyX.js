import{i as u,a as g,x as s,n as c,r as b,d as x,b as k,H as m,R as $}from"./header-DuR1A3YQ.js";var y=Object.defineProperty,p=(n,r,t,f)=>{for(var e=void 0,a=n.length-1,l;a>=0;a--)(l=n[a])&&(e=l(r,t,e)||e);return e&&y(r,t,e),e};const d=class d extends u{constructor(){super(...arguments),this.detailLink=""}render(){return s`
      <h3><a href=${this.detailLink||"#"}><slot></slot></a></h3>

      ${this.role?s`<p><strong>Role:</strong> ${this.role}</p>`:""}
      ${this.experience?s`<p><strong>Experience:</strong> ${this.experience}</p>`:""}

      <slot name="supervisors"></slot>
      <slot name="managed-resources"></slot>

      ${this.detailLink?s`<p><a href=${this.detailLink} class="detail-link">View Details →</a></p>`:""}
    `}};d.styles=g`
    :host {
      display: block;
      background-color: var(--color-background-card, white);
      border: 1px solid var(--color-border, #ddd);
      border-radius: var(--border-radius, 5px);
      padding: var(--spacing-lg, 20px);
      margin-bottom: var(--spacing-lg, 20px);
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: background-color 0.3s ease, border-color 0.3s ease;
    }

    h3 {
      font-family: var(--font-display, serif);
      margin-top: 0;
      margin-bottom: var(--spacing-sm, 10px);
    }

    a {
      color: var(--color-accent, #1a5632);
      text-decoration: none;
    }

    a:hover {
      color: var(--color-accent-hover, #123b22);
      text-decoration: underline;
    }

    p {
      margin: var(--spacing-xs, 8px) 0;
    }

    strong {
      font-weight: bold;
    }

    .detail-link {
      display: block;
      margin-top: var(--spacing-md, 15px);
    }
  `;let o=d;p([c()],o.prototype,"role");p([c()],o.prototype,"experience");p([c({attribute:"detail-link"})],o.prototype,"detailLink");customElements.define("ranch-person-card",o);var w=Object.defineProperty,v=(n,r,t,f)=>{for(var e=void 0,a=n.length-1,l;a>=0;a--)(l=n[a])&&(e=l(r,t,e)||e);return e&&w(r,t,e),e};const h=class h extends u{constructor(){super(...arguments),this.people=[]}connectedCallback(){super.connectedCallback(),this.src&&this.hydrate(this.src)}async hydrate(r){try{const t=await fetch(r);if(!t.ok)throw new Error(`${t.status} ${t.statusText}`);this.people=await t.json()}catch(t){console.error("ranch-people:",t)}}render(){return s`${this.people.map(r=>s`
      <ranch-person-card
        role=${r.role}
        experience=${r.experience}
        detail-link=${r.detailLink}>
        ${r.name}
      </ranch-person-card>
    `)}`}};h.styles=g`:host{display:block}`;let i=h;v([c()],i.prototype,"src");v([b()],i.prototype,"people");customElements.define("ranch-people",i);x({"ranch-person-card":o,"ranch-people":i,"ranch-cattle":$,"ranch-header":m,"mu-auth":k.Provider});m.initializeOnce();
