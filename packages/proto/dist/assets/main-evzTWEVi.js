import{i as g,a as u,x as s,n as c,r as x,d as f,R as b}from"./ranch-cattle-Bs8r2Xwi.js";var k=Object.defineProperty,p=(i,r,t,m)=>{for(var e=void 0,o=i.length-1,l;o>=0;o--)(l=i[o])&&(e=l(r,t,e)||e);return e&&k(r,t,e),e};const d=class d extends g{constructor(){super(...arguments),this.detailLink=""}render(){return s`
      <h3><a href=${this.detailLink||"#"}><slot></slot></a></h3>

      ${this.role?s`<p><strong>Role:</strong> ${this.role}</p>`:""}
      ${this.experience?s`<p><strong>Experience:</strong> ${this.experience}</p>`:""}

      <slot name="supervisors"></slot>
      <slot name="managed-resources"></slot>

      ${this.detailLink?s`<p><a href=${this.detailLink} class="detail-link">View Details →</a></p>`:""}
    `}};d.styles=u`
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
  `;let a=d;p([c()],a.prototype,"role");p([c()],a.prototype,"experience");p([c({attribute:"detail-link"})],a.prototype,"detailLink");customElements.define("ranch-person-card",a);var $=Object.defineProperty,v=(i,r,t,m)=>{for(var e=void 0,o=i.length-1,l;o>=0;o--)(l=i[o])&&(e=l(r,t,e)||e);return e&&$(r,t,e),e};const h=class h extends g{constructor(){super(...arguments),this.people=[]}connectedCallback(){super.connectedCallback(),this.src&&this.hydrate(this.src)}async hydrate(r){try{const t=await fetch(r);if(!t.ok)throw new Error(`${t.status} ${t.statusText}`);this.people=await t.json()}catch(t){console.error("ranch-people:",t)}}render(){return s`${this.people.map(r=>s`
      <ranch-person-card
        role=${r.role}
        experience=${r.experience}
        detail-link=${r.detailLink}>
        ${r.name}
      </ranch-person-card>
    `)}`}};h.styles=u`:host{display:block}`;let n=h;v([c()],n.prototype,"src");v([x()],n.prototype,"people");customElements.define("ranch-people",n);f({"ranch-person-card":a,"ranch-people":n});f({"ranch-cattle":b});
