(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=e(s);fetch(s.href,n)}})();var V,Ee;class lt extends Error{}lt.prototype.name="InvalidTokenError";function qr(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let r=e.charCodeAt(0).toString(16).toUpperCase();return r.length<2&&(r="0"+r),"%"+r}))}function Vr(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return qr(t)}catch{return atob(t)}}function Xe(i,t){if(typeof i!="string")throw new lt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,r=i.split(".")[e];if(typeof r!="string")throw new lt(`Invalid token specified: missing part #${e+1}`);let s;try{s=Vr(r)}catch(n){throw new lt(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(s)}catch(n){throw new lt(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const Wr="mu:context",Kt=`${Wr}:change`;class Yr{constructor(t,e){this._proxy=Jr(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class tr extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Yr(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Kt,t),t}detach(t){this.removeEventListener(Kt,t)}}function Jr(i,t){return new Proxy(i,{get:(r,s,n)=>{if(s==="then")return;const o=Reflect.get(r,s,n);return console.log(`Context['${s}'] => `,o),o},set:(r,s,n,o)=>{const l=i[s];console.log(`Context['${s.toString()}'] <= `,n);const a=Reflect.set(r,s,n,o);if(a){let u=new CustomEvent(Kt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(u,{property:s,oldValue:l,value:n}),t.dispatchEvent(u)}else console.log(`Context['${s}] was not set to ${n}`);return a}})}function Gr(i,t){const e=er(t,i);return new Promise((r,s)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>r(e))}else s({context:t,reason:`No provider for this context "${t}:`})})}function er(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const r=t.closest(e);if(r)return r;const s=t.getRootNode();if(s instanceof ShadowRoot)return er(i,s.host)}class Kr extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function rr(i="mu:message"){return(t,...e)=>t.dispatchEvent(new Kr(e,i))}class re{constructor(t,e,r="service:message",s=!0){this._pending=[],this._context=e,this._update=t,this._eventType=r,this._running=s}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const r=e.detail;this.consume(r)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function Zr(i){return t=>({...t,...i})}const Zt="mu:auth:jwt",sr=class ir extends re{constructor(t,e){super((r,s)=>this.update(r,s),t,ir.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:r,redirect:s}=t[1];return e(Xr(r)),qt(s);case"auth/signout":return e(ts()),qt(this._redirectForLogin);case"auth/redirect":return qt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};sr.EVENT_TYPE="auth:message";let nr=sr;const or=rr(nr.EVENT_TYPE);function qt(i,t={}){if(!i)return;const e=window.location.href,r=new URL(i,e);return Object.entries(t).forEach(([s,n])=>r.searchParams.set(s,n)),()=>{console.log("Redirecting to ",i),window.location.assign(r)}}class Qr extends tr{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=K.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new nr(this.context,this.redirect).attach(this)}}class ut{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(Zt),t}}class K extends ut{constructor(t){super();const e=Xe(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new K(t);return localStorage.setItem(Zt,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(Zt);return t?K.authenticate(t):new ut}}function Xr(i){return Zr({user:K.authenticate(i),token:i})}function ts(){return i=>{const t=i.user;return{user:t&&t.authenticated?ut.deauthenticate(t):t,token:""}}}function es(i){return i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function rs(i){return i.authenticated?Xe(i.token||""):{}}const ss=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:K,Provider:Qr,User:ut,dispatch:or,headers:es,payload:rs},Symbol.toStringTag,{value:"Module"}));function Qt(i,t,e){const r=i.target,s=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${i.type}:`,s),r.dispatchEvent(s),i.stopPropagation()}function Ae(i,t="*"){return i.composedPath().find(r=>{const s=r;return s.tagName&&s.matches(t)})}function ar(i,...t){const e=i.map((s,n)=>n?[t[n-1],s]:[s]).flat().join("");let r=new CSSStyleSheet;return r.replaceSync(e),r}const is=new DOMParser;function j(i,...t){const e=t.map(l),r=i.map((a,u)=>{if(u===0)return[a];const f=e[u-1];return f instanceof Node?[`<ins id="mu-html-${u-1}"></ins>`,a]:[f,a]}).flat().join(""),s=is.parseFromString(r,"text/html"),n=s.head.childElementCount?s.head.children:s.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,u)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${u}`);if(f){const d=f.parentNode;d==null||d.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${u}`)}}),o;function l(a,u){if(a===null)return"";switch(typeof a){case"string":return xe(a);case"bigint":case"boolean":case"number":case"symbol":return xe(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,d=a.map(l);return f.replaceChildren(...d),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function xe(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Nt(i,t={mode:"open"}){const e=i.attachShadow(t),r={template:s,styles:n};return r;function s(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),r}function n(...o){e.adoptedStyleSheets=o}}V=class extends HTMLElement{constructor(){super(),this._state={},Nt(this).template(V.template).styles(V.styles),this.addEventListener("change",i=>{const t=i.target;if(t){const e=t.name,r=t.value;e&&(this._state[e]=r)}}),this.form&&this.form.addEventListener("submit",i=>{i.preventDefault(),Qt(i,"mu-form:submit",this._state)})}set init(i){this._state=i||{},ns(this._state,this)}get form(){var i;return(i=this.shadowRoot)==null?void 0:i.querySelector("form")}},V.template=j`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,V.styles=ar`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `;function ns(i,t){const e=Object.entries(i);for(const[r,s]of e){const n=t.querySelector(`[name="${r}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!s;break;case"date":o.value=s.toISOString().substr(0,10);break;default:o.value=s;break}}}return i}const lr=class cr extends re{constructor(t){super((e,r)=>this.update(e,r),t,cr.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:r,state:s}=t[1];e(as(r,s));break}case"history/redirect":{const{href:r,state:s}=t[1];e(ls(r,s));break}}}};lr.EVENT_TYPE="history:message";let se=lr;class Se extends tr{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=os(t);if(e){const r=new URL(e.href);r.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ie(e,"history/navigate",{href:r.pathname+r.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new se(this.context).attach(this)}}function os(i){const t=i.currentTarget,e=r=>r.tagName=="A"&&r.href;if(i.button===0)if(i.composed){const s=i.composedPath().find(e);return s||void 0}else{for(let r=i.target;r;r===t?null:r.parentElement)if(e(r))return r;return}}function as(i,t={}){return history.pushState(t,"",i),()=>({location:document.location,state:history.state})}function ls(i,t={}){return history.replaceState(t,"",i),()=>({location:document.location,state:history.state})}const ie=rr(se.EVENT_TYPE),cs=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Se,Provider:Se,Service:se,dispatch:ie},Symbol.toStringTag,{value:"Module"}));class pt{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,r)=>{if(this._provider){const s=new ke(this._provider,t);this._effects.push(s),e(s)}else Gr(this._target,this._contextLabel).then(s=>{const n=new ke(s,t);this._provider=s,this._effects.push(n),s.attach(o=>this._handleChange(o)),e(n)}).catch(s=>console.log(`Observer ${this._contextLabel}: ${s}`,s))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class ke{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const hr=class dr extends HTMLElement{constructor(){super(),this._state={},this._user=new ut,this._authObserver=new pt(this,"blazing:auth"),Nt(this).template(dr.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",r=this.isNew?"created":"updated",s=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;hs(s,this._state,e,this.authorization).then(n=>it(n,this)).then(n=>{const o=`mu-rest-form:${r}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[r]:n,url:s}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:s,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const r=e.name,s=e.value;r&&(this._state[r]=s)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},it(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Pe(this.src,this.authorization).then(e=>{this._state=e,it(e,this)}))})}attributeChangedCallback(t,e,r){switch(t){case"src":this.src&&r&&r!==e&&!this.isNew&&Pe(this.src,this.authorization).then(s=>{this._state=s,it(s,this)});break;case"new":r&&(this._state={},it({},this));break}}};hr.observedAttributes=["src","new","action"];hr.template=j`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function Pe(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function it(i,t){const e=Object.entries(i);for(const[r,s]of e){const n=t.querySelector(`[name="${r}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!s;break;default:o.value=s;break}}}return i}function hs(i,t,e="PUT",r={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...r},body:JSON.stringify(t)}).then(s=>{if(s.status!=200&&s.status!=201)throw`Form submission failed: Status ${s.status}`;return s.json()})}const ds=class ur extends re{constructor(t,e){super(e,t,ur.EVENT_TYPE,!1)}};ds.EVENT_TYPE="mu:message";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const St=globalThis,ne=St.ShadowRoot&&(St.ShadyCSS===void 0||St.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,oe=Symbol(),Ce=new WeakMap;let pr=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==oe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ne&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=Ce.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&Ce.set(e,t))}return t}toString(){return this.cssText}};const us=i=>new pr(typeof i=="string"?i:i+"",void 0,oe),ps=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((r,s,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1],i[0]);return new pr(e,i,oe)},fs=(i,t)=>{if(ne)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const r=document.createElement("style"),s=St.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},Te=ne?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return us(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:gs,defineProperty:ms,getOwnPropertyDescriptor:vs,getOwnPropertyNames:ys,getOwnPropertySymbols:bs,getPrototypeOf:_s}=Object,Z=globalThis,Oe=Z.trustedTypes,$s=Oe?Oe.emptyScript:"",Re=Z.reactiveElementPolyfillSupport,ct=(i,t)=>i,Pt={toAttribute(i,t){switch(t){case Boolean:i=i?$s:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ae=(i,t)=>!gs(i,t),Ue={attribute:!0,type:String,converter:Pt,reflect:!1,hasChanged:ae};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Z.litPropertyMetadata??(Z.litPropertyMetadata=new WeakMap);let Y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ue){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&ms(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){const{get:s,set:n}=vs(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return s==null?void 0:s.call(this)},set(o){const l=s==null?void 0:s.call(this);n.call(this,o),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ue}static _$Ei(){if(this.hasOwnProperty(ct("elementProperties")))return;const t=_s(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ct("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ct("properties"))){const e=this.properties,r=[...ys(e),...bs(e)];for(const s of r)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)e.unshift(Te(s))}else t!==void 0&&e.push(Te(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return fs(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostConnected)==null?void 0:r.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostDisconnected)==null?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$EC(t,e){var r;const s=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,s);if(n!==void 0&&s.reflect===!0){const o=(((r=s.converter)==null?void 0:r.toAttribute)!==void 0?s.converter:Pt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var r;const s=this.constructor,n=s._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=s.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((r=o.converter)==null?void 0:r.fromAttribute)!==void 0?o.converter:Pt;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,r){if(t!==void 0){if(r??(r=this.constructor.getPropertyOptions(t)),!(r.hasChanged??ae)(this[t],e))return;this.P(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,r){this._$AL.has(t)||this._$AL.set(t,e),r.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[n,o]of s)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(t=this._$EO)==null||t.forEach(s=>{var n;return(n=s.hostUpdate)==null?void 0:n.call(s)}),this.update(r)):this._$EU()}catch(s){throw e=!1,this._$EU(),s}e&&this._$AE(r)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};Y.elementStyles=[],Y.shadowRootOptions={mode:"open"},Y[ct("elementProperties")]=new Map,Y[ct("finalized")]=new Map,Re==null||Re({ReactiveElement:Y}),(Z.reactiveElementVersions??(Z.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ct=globalThis,Tt=Ct.trustedTypes,Ne=Tt?Tt.createPolicy("lit-html",{createHTML:i=>i}):void 0,fr="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,gr="?"+C,ws=`<${gr}>`,z=document,ft=()=>z.createComment(""),gt=i=>i===null||typeof i!="object"&&typeof i!="function",le=Array.isArray,Es=i=>le(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Vt=`[ 	
\f\r]`,nt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Me=/-->/g,Le=/>/g,M=RegExp(`>|${Vt}(?:([^\\s"'>=/]+)(${Vt}*=${Vt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ie=/'/g,He=/"/g,mr=/^(?:script|style|textarea|title)$/i,As=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),ot=As(1),Q=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),je=new WeakMap,I=z.createTreeWalker(z,129);function vr(i,t){if(!le(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ne!==void 0?Ne.createHTML(t):t}const xs=(i,t)=>{const e=i.length-1,r=[];let s,n=t===2?"<svg>":t===3?"<math>":"",o=nt;for(let l=0;l<e;l++){const a=i[l];let u,f,d=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===nt?f[1]==="!--"?o=Me:f[1]!==void 0?o=Le:f[2]!==void 0?(mr.test(f[2])&&(s=RegExp("</"+f[2],"g")),o=M):f[3]!==void 0&&(o=M):o===M?f[0]===">"?(o=s??nt,d=-1):f[1]===void 0?d=-2:(d=o.lastIndex-f[2].length,u=f[1],o=f[3]===void 0?M:f[3]==='"'?He:Ie):o===He||o===Ie?o=M:o===Me||o===Le?o=nt:(o=M,s=void 0);const h=o===M&&i[l+1].startsWith("/>")?" ":"";n+=o===nt?a+ws:d>=0?(r.push(u),a.slice(0,d)+fr+a.slice(d)+C+h):a+C+(d===-2?l:h)}return[vr(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};let Xt=class yr{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[u,f]=xs(t,e);if(this.el=yr.createElement(u,r),I.currentNode=this.el.content,e===2||e===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=I.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const d of s.getAttributeNames())if(d.endsWith(fr)){const c=f[o++],h=s.getAttribute(d).split(C),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?ks:p[1]==="?"?Ps:p[1]==="@"?Cs:Mt}),s.removeAttribute(d)}else d.startsWith(C)&&(a.push({type:6,index:n}),s.removeAttribute(d));if(mr.test(s.tagName)){const d=s.textContent.split(C),c=d.length-1;if(c>0){s.textContent=Tt?Tt.emptyScript:"";for(let h=0;h<c;h++)s.append(d[h],ft()),I.nextNode(),a.push({type:2,index:++n});s.append(d[c],ft())}}}else if(s.nodeType===8)if(s.data===gr)a.push({type:2,index:n});else{let d=-1;for(;(d=s.data.indexOf(C,d+1))!==-1;)a.push({type:7,index:n}),d+=C.length-1}n++}}static createElement(t,e){const r=z.createElement("template");return r.innerHTML=t,r}};function X(i,t,e=i,r){var s,n;if(t===Q)return t;let o=r!==void 0?(s=e.o)==null?void 0:s[r]:e.l;const l=gt(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(i),o._$AT(i,e,r)),r!==void 0?(e.o??(e.o=[]))[r]=o:e.l=o),o!==void 0&&(t=X(i,o._$AS(i,t.values),o,r)),t}class Ss{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,s=((t==null?void 0:t.creationScope)??z).importNode(e,!0);I.currentNode=s;let n=I.nextNode(),o=0,l=0,a=r[0];for(;a!==void 0;){if(o===a.index){let u;a.type===2?u=new $t(n,n.nextSibling,this,t):a.type===1?u=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(u=new Ts(n,this,t)),this._$AV.push(u),a=r[++l]}o!==(a==null?void 0:a.index)&&(n=I.nextNode(),o++)}return I.currentNode=z,s}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class $t{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,r,s){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this.v=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),gt(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==Q&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Es(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&gt(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){var e;const{values:r,_$litType$:s}=t,n=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Xt.createElement(vr(s.h,s.h[0]),this.options)),s);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(r);else{const o=new Ss(n,this),l=o.u(this.options);o.p(r),this.T(l),this._$AH=o}}_$AC(t){let e=je.get(t.strings);return e===void 0&&je.set(t.strings,e=new Xt(t)),e}k(t){le(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,s=0;for(const n of t)s===e.length?e.push(r=new $t(this.O(ft()),this.O(ft()),this,this.options)):r=e[s],r._$AI(n),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Mt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,n){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=_}_$AI(t,e=this,r,s){const n=this.strings;let o=!1;if(n===void 0)t=X(this,t,e,0),o=!gt(t)||t!==this._$AH&&t!==Q,o&&(this._$AH=t);else{const l=t;let a,u;for(t=n[0],a=0;a<n.length-1;a++)u=X(this,l[r+a],e,a),u===Q&&(u=this._$AH[a]),o||(o=!gt(u)||u!==this._$AH[a]),u===_?t=_:t!==_&&(t+=(u??"")+n[a+1]),this._$AH[a]=u}o&&!s&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class ks extends Mt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}}class Ps extends Mt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}}class Cs extends Mt{constructor(t,e,r,s,n){super(t,e,r,s,n),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??_)===Q)return;const r=this._$AH,s=t===_&&r!==_||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==_&&(r===_||s);s&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Ts{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const De=Ct.litHtmlPolyfillSupport;De==null||De(Xt,$t),(Ct.litHtmlVersions??(Ct.litHtmlVersions=[])).push("3.2.0");const Os=(i,t,e)=>{const r=(e==null?void 0:e.renderBefore)??t;let s=r._$litPart$;if(s===void 0){const n=(e==null?void 0:e.renderBefore)??null;r._$litPart$=s=new $t(t.insertBefore(ft(),n),n,void 0,e??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let G=class extends Y{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Os(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return Q}};G._$litElement$=!0,G.finalized=!0,(Ee=globalThis.litElementHydrateSupport)==null||Ee.call(globalThis,{LitElement:G});const ze=globalThis.litElementPolyfillSupport;ze==null||ze({LitElement:G});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rs={attribute:!0,type:String,converter:Pt,reflect:!1,hasChanged:ae},Us=(i=Rs,t,e)=>{const{kind:r,metadata:s}=e;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),n.set(e.name,i),r==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.P(o,void 0,i),l}}}if(r==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+r)};function br(i){return(t,e)=>typeof e=="object"?Us(i,t,e):((r,s,n)=>{const o=s.hasOwnProperty(n);return s.constructor.createProperty(n,o?{...r,wrapped:!0}:r),o?Object.getOwnPropertyDescriptor(s,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function _r(i){return br({...i,state:!0,attribute:!1})}function Ns(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function Ms(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var $r={};(function(i){var t=function(){var e=function(d,c,h,p){for(h=h||{},p=d.length;p--;h[d[p]]=c);return h},r=[1,9],s=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,m,g,y,jt){var E=y.length-1;switch(g){case 1:return new m.Root({},[y[E-1]]);case 2:return new m.Root({},[new m.Literal({value:""})]);case 3:this.$=new m.Concat({},[y[E-1],y[E]]);break;case 4:case 5:this.$=y[E];break;case 6:this.$=new m.Literal({value:y[E]});break;case 7:this.$=new m.Splat({name:y[E]});break;case 8:this.$=new m.Param({name:y[E]});break;case 9:this.$=new m.Optional({},[y[E-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:r,13:s,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:r,13:s,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:r,13:s,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:r,12:[1,16],13:s,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(m,g){this.message=m,this.hash=g};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],m=[null],g=[],y=this.table,jt="",E=0,_e=0,Dr=2,$e=1,zr=g.slice.call(arguments,1),b=Object.create(this.lexer),U={yy:{}};for(var Dt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Dt)&&(U.yy[Dt]=this.yy[Dt]);b.setInput(c,U.yy),U.yy.lexer=b,U.yy.parser=this,typeof b.yylloc>"u"&&(b.yylloc={});var zt=b.yylloc;g.push(zt);var Br=b.options&&b.options.ranges;typeof U.yy.parseError=="function"?this.parseError=U.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Fr=function(){var q;return q=b.lex()||$e,typeof q!="number"&&(q=h.symbols_[q]||q),q},w,N,A,Bt,F={},At,k,we,xt;;){if(N=p[p.length-1],this.defaultActions[N]?A=this.defaultActions[N]:((w===null||typeof w>"u")&&(w=Fr()),A=y[N]&&y[N][w]),typeof A>"u"||!A.length||!A[0]){var Ft="";xt=[];for(At in y[N])this.terminals_[At]&&At>Dr&&xt.push("'"+this.terminals_[At]+"'");b.showPosition?Ft="Parse error on line "+(E+1)+`:
`+b.showPosition()+`
Expecting `+xt.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Ft="Parse error on line "+(E+1)+": Unexpected "+(w==$e?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Ft,{text:b.match,token:this.terminals_[w]||w,line:b.yylineno,loc:zt,expected:xt})}if(A[0]instanceof Array&&A.length>1)throw new Error("Parse Error: multiple actions possible at state: "+N+", token: "+w);switch(A[0]){case 1:p.push(w),m.push(b.yytext),g.push(b.yylloc),p.push(A[1]),w=null,_e=b.yyleng,jt=b.yytext,E=b.yylineno,zt=b.yylloc;break;case 2:if(k=this.productions_[A[1]][1],F.$=m[m.length-k],F._$={first_line:g[g.length-(k||1)].first_line,last_line:g[g.length-1].last_line,first_column:g[g.length-(k||1)].first_column,last_column:g[g.length-1].last_column},Br&&(F._$.range=[g[g.length-(k||1)].range[0],g[g.length-1].range[1]]),Bt=this.performAction.apply(F,[jt,_e,E,U.yy,A[1],m,g].concat(zr)),typeof Bt<"u")return Bt;k&&(p=p.slice(0,-1*k*2),m=m.slice(0,-1*k),g=g.slice(0,-1*k)),p.push(this.productions_[A[1]][0]),m.push(F.$),g.push(F._$),we=y[p[p.length-2]][p[p.length-1]],p.push(we);break;case 3:return!0}}return!0}},u=function(){var d={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var m=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var g=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===m.length?this.yylloc.first_column:0)+m[m.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[g[0],g[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,m,g;if(this.options.backtrack_lexer&&(g={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(g.yylloc.range=this.yylloc.range.slice(0))),m=c[0].match(/(?:\r\n?|\n).*/g),m&&(this.yylineno+=m.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:m?m[m.length-1].length-m[m.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var y in g)this[y]=g[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,m;this._more||(this.yytext="",this.match="");for(var g=this._currentRules(),y=0;y<g.length;y++)if(p=this._input.match(this.rules[g[y]]),p&&(!h||p[0].length>h[0].length)){if(h=p,m=y,this.options.backtrack_lexer){if(c=this.test_match(p,g[y]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,g[m]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,m,g){switch(m){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return d}();a.lexer=u;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Ms<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})($r);function W(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var wr={Root:W("Root"),Concat:W("Concat"),Literal:W("Literal"),Splat:W("Splat"),Param:W("Param"),Optional:W("Optional")},Er=$r.parser;Er.yy=wr;var Ls=Er,Is=Object.keys(wr);function Hs(i){return Is.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var Ar=Hs,js=Ar,Ds=/[\-{}\[\]+?.,\\\^$|#\s]/g;function xr(i){this.captures=i.captures,this.re=i.re}xr.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(r,s){typeof t[s+1]>"u"?e[r]=void 0:e[r]=decodeURIComponent(t[s+1])}),e};var zs=js({Concat:function(i){return i.children.reduce((function(t,e){var r=this.visit(e);return{re:t.re+r.re,captures:t.captures.concat(r.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(Ds,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new xr({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Bs=zs,Fs=Ar,qs=Fs({Concat:function(i,t){var e=i.children.map((function(r){return this.visit(r,t)}).bind(this));return e.some(function(r){return r===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),Vs=qs,Ws=Ls,Ys=Bs,Js=Vs;wt.prototype=Object.create(null);wt.prototype.match=function(i){var t=Ys.visit(this.ast),e=t.match(i);return e||!1};wt.prototype.reverse=function(i){return Js.visit(this.ast,i)};function wt(i){var t;if(this?t=this:t=Object.create(wt.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=Ws.parse(i),t}var Gs=wt,Ks=Gs,Zs=Ks;const Qs=Ns(Zs);var Xs=Object.defineProperty,Sr=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Xs(t,e,s),s};const kr=class extends G{constructor(t,e,r=""){super(),this._cases=[],this._fallback=()=>ot` <h1>Not Found</h1> `,this._cases=t.map(s=>({...s,route:new Qs(s.path)})),this._historyObserver=new pt(this,e),this._authObserver=new pt(this,r)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),ot` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(or(this,"auth/redirect"),ot` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):ot` <h1>Authenticating</h1> `;if("redirect"in e){const r=e.redirect;if(typeof r=="string")return this.redirect(r),ot` <h1>Redirecting to ${r}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:r}=t,s=new URLSearchParams(e),n=r+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:r,params:l,query:s}}}redirect(t){ie(this,"history/redirect",{href:t})}};kr.styles=ps`
    :host,
    main {
      display: contents;
    }
  `;let Ot=kr;Sr([_r()],Ot.prototype,"_user");Sr([_r()],Ot.prototype,"_match");const ti=Object.freeze(Object.defineProperty({__proto__:null,Element:Ot,Switch:Ot},Symbol.toStringTag,{value:"Module"})),ei=class Pr extends HTMLElement{constructor(){if(super(),Nt(this).template(Pr.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};ei.template=j`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;const Cr=class te extends HTMLElement{constructor(){super(),this._array=[],Nt(this).template(te.template).styles(te.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Tr("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const r=new Event("change",{bubbles:!0}),s=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=s,this.dispatchEvent(r)}}}),this.addEventListener("click",t=>{Ae(t,"button.add")?Qt(t,"input-array:add"):Ae(t,"button.remove")&&Qt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],ri(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const r=Array.from(this.children).indexOf(e);this._array.splice(r,1),e.remove()}}};Cr.template=j`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Cr.styles=ar`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;function ri(i,t){t.replaceChildren(),i.forEach((e,r)=>t.append(Tr(e)))}function Tr(i,t){const e=i===void 0?j`<input />`:j`<input value="${i}" />`;return j`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function si(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var ii=Object.defineProperty,ni=Object.getOwnPropertyDescriptor,oi=(i,t,e,r)=>{for(var s=ni(t,e),n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&ii(t,e,s),s};class ai extends G{constructor(t){super(),this._pending=[],this._observer=new pt(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([r,s])=>{console.log("Dispatching queued event",s,r),r.dispatchEvent(s)}),e.setEffect(()=>{var r;if(console.log("View effect",this,e,(r=this._context)==null?void 0:r.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const r=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",r),e.dispatchEvent(r)):(console.log("Queueing message event",r),this._pending.push([e,r]))}ref(t){return this.model?this.model[t]:void 0}}oi([br()],ai.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kt=globalThis,ce=kt.ShadowRoot&&(kt.ShadyCSS===void 0||kt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,he=Symbol(),Be=new WeakMap;let Or=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==he)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ce&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=Be.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&Be.set(e,t))}return t}toString(){return this.cssText}};const li=i=>new Or(typeof i=="string"?i:i+"",void 0,he),st=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((r,s,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1],i[0]);return new Or(e,i,he)},ci=(i,t)=>{if(ce)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const r=document.createElement("style"),s=kt.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},Fe=ce?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return li(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:hi,defineProperty:di,getOwnPropertyDescriptor:ui,getOwnPropertyNames:pi,getOwnPropertySymbols:fi,getPrototypeOf:gi}=Object,O=globalThis,qe=O.trustedTypes,mi=qe?qe.emptyScript:"",Wt=O.reactiveElementPolyfillSupport,ht=(i,t)=>i,Rt={toAttribute(i,t){switch(t){case Boolean:i=i?mi:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},de=(i,t)=>!hi(i,t),Ve={attribute:!0,type:String,converter:Rt,reflect:!1,useDefault:!1,hasChanged:de};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),O.litPropertyMetadata??(O.litPropertyMetadata=new WeakMap);let J=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ve){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&di(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){const{get:s,set:n}=ui(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){const l=s==null?void 0:s.call(this);n==null||n.call(this,o),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ve}static _$Ei(){if(this.hasOwnProperty(ht("elementProperties")))return;const t=gi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ht("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ht("properties"))){const e=this.properties,r=[...pi(e),...fi(e)];for(const s of r)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)e.unshift(Fe(s))}else t!==void 0&&e.push(Fe(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ci(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostConnected)==null?void 0:r.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostDisconnected)==null?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){var n;const r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){const o=(((n=r.converter)==null?void 0:n.toAttribute)!==void 0?r.converter:Rt).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){var n,o;const r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const l=r.getPropertyOptions(s),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((n=l.converter)==null?void 0:n.fromAttribute)!==void 0?l.converter:Rt;this._$Em=s,this[s]=a.fromAttribute(e,l.type)??((o=this._$Ej)==null?void 0:o.get(s))??null,this._$Em=null}}requestUpdate(t,e,r){var s;if(t!==void 0){const n=this.constructor,o=this[t];if(r??(r=n.getPropertyOptions(t)),!((r.hasChanged??de)(o,e)||r.useDefault&&r.reflect&&o===((s=this._$Ej)==null?void 0:s.get(t))&&!this.hasAttribute(n._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:n},o){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[n,o]of s){const{wrapped:l}=o,a=this[n];l!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,o,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(r=this._$EO)==null||r.forEach(s=>{var n;return(n=s.hostUpdate)==null?void 0:n.call(s)}),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};J.elementStyles=[],J.shadowRootOptions={mode:"open"},J[ht("elementProperties")]=new Map,J[ht("finalized")]=new Map,Wt==null||Wt({ReactiveElement:J}),(O.reactiveElementVersions??(O.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const dt=globalThis,Ut=dt.trustedTypes,We=Ut?Ut.createPolicy("lit-html",{createHTML:i=>i}):void 0,Rr="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,Ur="?"+T,vi=`<${Ur}>`,B=document,mt=()=>B.createComment(""),vt=i=>i===null||typeof i!="object"&&typeof i!="function",ue=Array.isArray,yi=i=>ue(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Yt=`[ 	
\f\r]`,at=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ye=/-->/g,Je=/>/g,L=RegExp(`>|${Yt}(?:([^\\s"'>=/]+)(${Yt}*=${Yt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ge=/'/g,Ke=/"/g,Nr=/^(?:script|style|textarea|title)$/i,bi=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),v=bi(1),tt=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Ze=new WeakMap,H=B.createTreeWalker(B,129);function Mr(i,t){if(!ue(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return We!==void 0?We.createHTML(t):t}const _i=(i,t)=>{const e=i.length-1,r=[];let s,n=t===2?"<svg>":t===3?"<math>":"",o=at;for(let l=0;l<e;l++){const a=i[l];let u,f,d=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===at?f[1]==="!--"?o=Ye:f[1]!==void 0?o=Je:f[2]!==void 0?(Nr.test(f[2])&&(s=RegExp("</"+f[2],"g")),o=L):f[3]!==void 0&&(o=L):o===L?f[0]===">"?(o=s??at,d=-1):f[1]===void 0?d=-2:(d=o.lastIndex-f[2].length,u=f[1],o=f[3]===void 0?L:f[3]==='"'?Ke:Ge):o===Ke||o===Ge?o=L:o===Ye||o===Je?o=at:(o=L,s=void 0);const h=o===L&&i[l+1].startsWith("/>")?" ":"";n+=o===at?a+vi:d>=0?(r.push(u),a.slice(0,d)+Rr+a.slice(d)+T+h):a+T+(d===-2?l:h)}return[Mr(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class yt{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[u,f]=_i(t,e);if(this.el=yt.createElement(u,r),H.currentNode=this.el.content,e===2||e===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=H.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const d of s.getAttributeNames())if(d.endsWith(Rr)){const c=f[o++],h=s.getAttribute(d).split(T),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?wi:p[1]==="?"?Ei:p[1]==="@"?Ai:Lt}),s.removeAttribute(d)}else d.startsWith(T)&&(a.push({type:6,index:n}),s.removeAttribute(d));if(Nr.test(s.tagName)){const d=s.textContent.split(T),c=d.length-1;if(c>0){s.textContent=Ut?Ut.emptyScript:"";for(let h=0;h<c;h++)s.append(d[h],mt()),H.nextNode(),a.push({type:2,index:++n});s.append(d[c],mt())}}}else if(s.nodeType===8)if(s.data===Ur)a.push({type:2,index:n});else{let d=-1;for(;(d=s.data.indexOf(T,d+1))!==-1;)a.push({type:7,index:n}),d+=T.length-1}n++}}static createElement(t,e){const r=B.createElement("template");return r.innerHTML=t,r}}function et(i,t,e=i,r){var o,l;if(t===tt)return t;let s=r!==void 0?(o=e._$Co)==null?void 0:o[r]:e._$Cl;const n=vt(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==n&&((l=s==null?void 0:s._$AO)==null||l.call(s,!1),n===void 0?s=void 0:(s=new n(i),s._$AT(i,e,r)),r!==void 0?(e._$Co??(e._$Co=[]))[r]=s:e._$Cl=s),s!==void 0&&(t=et(i,s._$AS(i,t.values),s,r)),t}class $i{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,s=((t==null?void 0:t.creationScope)??B).importNode(e,!0);H.currentNode=s;let n=H.nextNode(),o=0,l=0,a=r[0];for(;a!==void 0;){if(o===a.index){let u;a.type===2?u=new Et(n,n.nextSibling,this,t):a.type===1?u=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(u=new xi(n,this,t)),this._$AV.push(u),a=r[++l]}o!==(a==null?void 0:a.index)&&(n=H.nextNode(),o++)}return H.currentNode=B,s}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class Et{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=et(this,t,e),vt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==tt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):yi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&vt(this._$AH)?this._$AA.nextSibling.data=t:this.T(B.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=yt.createElement(Mr(r.h,r.h[0]),this.options)),r);if(((n=this._$AH)==null?void 0:n._$AD)===s)this._$AH.p(e);else{const o=new $i(s,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=Ze.get(t.strings);return e===void 0&&Ze.set(t.strings,e=new yt(t)),e}k(t){ue(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,s=0;for(const n of t)s===e.length?e.push(r=new Et(this.O(mt()),this.O(mt()),this,this.options)):r=e[s],r._$AI(n),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Lt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=$}_$AI(t,e=this,r,s){const n=this.strings;let o=!1;if(n===void 0)t=et(this,t,e,0),o=!vt(t)||t!==this._$AH&&t!==tt,o&&(this._$AH=t);else{const l=t;let a,u;for(t=n[0],a=0;a<n.length-1;a++)u=et(this,l[r+a],e,a),u===tt&&(u=this._$AH[a]),o||(o=!vt(u)||u!==this._$AH[a]),u===$?t=$:t!==$&&(t+=(u??"")+n[a+1]),this._$AH[a]=u}o&&!s&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class wi extends Lt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class Ei extends Lt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class Ai extends Lt{constructor(t,e,r,s,n){super(t,e,r,s,n),this.type=5}_$AI(t,e=this){if((t=et(this,t,e,0)??$)===tt)return;const r=this._$AH,s=t===$&&r!==$||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==$&&(r===$||s);s&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class xi{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){et(this,t)}}const Jt=dt.litHtmlPolyfillSupport;Jt==null||Jt(yt,Et),(dt.litHtmlVersions??(dt.litHtmlVersions=[])).push("3.3.0");const Si=(i,t,e)=>{const r=(e==null?void 0:e.renderBefore)??t;let s=r._$litPart$;if(s===void 0){const n=(e==null?void 0:e.renderBefore)??null;r._$litPart$=s=new Et(t.insertBefore(mt(),n),n,void 0,e??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const D=globalThis;class x extends J{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Si(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return tt}}var Qe;x._$litElement$=!0,x.finalized=!0,(Qe=D.litElementHydrateSupport)==null||Qe.call(D,{LitElement:x});const Gt=D.litElementPolyfillSupport;Gt==null||Gt({LitElement:x});(D.litElementVersions??(D.litElementVersions=[])).push("4.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ki={attribute:!0,type:String,converter:Rt,reflect:!1,hasChanged:de},Pi=(i=ki,t,e)=>{const{kind:r,metadata:s}=e;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),r==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(r==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+r)};function It(i){return(t,e)=>typeof e=="object"?Pi(i,t,e):((r,s,n)=>{const o=s.hasOwnProperty(n);return s.constructor.createProperty(n,r),o?Object.getOwnPropertyDescriptor(s,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function S(i){return It({...i,state:!0,attribute:!1})}var Ci=Object.defineProperty,Lr=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Ci(t,e,s),s},P;const pe=(P=class extends x{constructor(){super(),this.loggedIn=!1}static initializeOnce(){P._initialized||(P._initialized=!0)}connectedCallback(){super.connectedCallback();const t=localStorage.getItem("token");if(t)try{const e=JSON.parse(atob(t.split(".")[1]));e!=null&&e.username&&(this.loggedIn=!0,this.userid=e.username)}catch(e){console.error("Invalid token:",e),this.loggedIn=!1,this.userid=void 0}else this.loggedIn=!1,this.userid=void 0;this.requestUpdate(),this.setupDarkMode()}setupDarkMode(){const t=localStorage.getItem("darkMode")==="true";document.body.classList.toggle("dark-mode",t),this.updateComplete.then(()=>{var r;const e=(r=this.shadowRoot)==null?void 0:r.querySelector("#darkSwitch");e&&(e.checked=t),this.updateIconOpacity(t)})}updateIconOpacity(t){var s,n;const e=(s=this.shadowRoot)==null?void 0:s.querySelector(".toggle-icon.sun"),r=(n=this.shadowRoot)==null?void 0:n.querySelector(".toggle-icon.moon");e&&r&&(t?(e.style.opacity="0.7",r.style.opacity="1"):(e.style.opacity="1",r.style.opacity="0.7"))}handleDarkModeToggle(t){t.preventDefault();const r=t.target.checked;document.body.classList.toggle("dark-mode",r),localStorage.setItem("darkMode",r.toString()),this.updateIconOpacity(r);const s=new CustomEvent("darkmode:toggle",{bubbles:!0,detail:{isDarkMode:r}});document.body.dispatchEvent(s)}renderSignOutButton(){return v`
      <button
        @click=${()=>{localStorage.removeItem("token"),window.location.href="/login.html"}}
        class="auth-button"
      >
        Sign Out
      </button>
    `}renderSignInButton(){return v` <a href="/login.html" class="auth-button"> Sign In </a> `}render(){return v`
      <div class="logo">
        Ranch Hand - Cattle Management System
      </div>
      <div class="header-controls">
        <label class="dark-mode-toggle">
          <span class="toggle-icon sun">☀️</span>
          <input 
            type="checkbox" 
            id="darkSwitch"
            @change=${this.handleDarkModeToggle}
          />
          <span class="toggle-icon moon">🌙</span>
        </label>
        <div class="user-info">
          <p class="welcome-text">Hello, ${this.userid||"traveler"}</p>
          ${this.loggedIn?this.renderSignOutButton():this.renderSignInButton()}
        </div>
      </div>
    `}},P._initialized=!1,P.styles=st`
    :host {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-md, 15px);
      background-color: var(--color-accent, #1a5632);
      color: var(--color-text-light, white);
      margin-bottom: var(--spacing-lg, 20px);
      border-radius: var(--border-radius, 5px);
    }

    .logo {
      font-family: var(--font-display);
      font-size: 1.5rem;
      margin: 0;
    }

    .header-controls {
      display: flex;
      align-items: center;
      gap: var(--spacing-lg, 20px);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-md, 15px);
    }

    .welcome-text {
      margin: 0;
    }

    .auth-button {
      background-color: var(--color-background-page, white);
      color: var(--color-accent, #1a5632);
      border: none;
      border-radius: var(--border-radius, 5px);
      padding: 8px 16px;
      cursor: pointer;
      font-family: var(--font-body);
      font-size: 1rem;
      text-decoration: none;
      display: inline-block;
    }

    .auth-button:hover {
      background-color: var(--color-background-muted, #f2f2f2);
      text-decoration: none;
    }

    a.auth-button {
      text-decoration: none;
    }

    .dark-mode-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      color: var(--color-text-light, white);
      user-select: none;
    }

    .dark-mode-toggle input[type="checkbox"] {
      position: relative;
      width: 50px;
      height: 25px;
      appearance: none;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 25px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .dark-mode-toggle input[type="checkbox"]:checked {
      background-color: rgba(255, 255, 255, 0.4);
    }

    .dark-mode-toggle input[type="checkbox"]::before {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 21px;
      height: 21px;
      background-color: white;
      border-radius: 50%;
      transition: transform 0.3s ease;
    }

    .dark-mode-toggle input[type="checkbox"]:checked::before {
      transform: translateX(25px);
    }

    .dark-mode-toggle:hover input[type="checkbox"] {
      background-color: rgba(255, 255, 255, 0.3);
    }

    .dark-mode-toggle:hover input[type="checkbox"]:checked {
      background-color: rgba(255, 255, 255, 0.5);
    }

    /* Icons for the toggle - use :host context for shadow DOM */
    .toggle-icon {
      font-size: 1.1rem;
      transition: opacity 0.3s ease;
    }

    .toggle-icon.sun {
      opacity: 1;
    }

    .toggle-icon.moon {
      opacity: 0.7;
    }

    /* These won't work in shadow DOM, but we'll handle this in JS */
  `,P);Lr([It({type:Boolean})],pe.prototype,"loggedIn");Lr([It()],pe.prototype,"userid");let Ir=pe;customElements.define("ranch-header",Ir);var Ti=Object.defineProperty,Ht=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Ti(t,e,s),s};const ge=class ge extends x{constructor(){super(...arguments),this.cattle=[],this.loading=!0,this.error=null,this._authObserver=new pt(this,"ranch:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user}),this.src&&this.fetchCattle(this.src)}get authorization(){var t;if((t=this._user)!=null&&t.authenticated&&this._user.token)return{Authorization:`Bearer ${this._user.token}`}}async fetchCattle(t){try{this.loading=!0,this.error=null;const e=await fetch(t,{headers:this.authorization});if(!e.ok){const r=await e.text();throw new Error(`${e.status} ${e.statusText}: ${r}`)}this.cattle=await e.json(),this.loading=!1}catch(e){console.error("Error fetching cattle:",e),this.error=e instanceof Error?e.message:"Unknown error",this.loading=!1}}render(){return v`
      ${this.loading?v`<div class="loading">Loading cattle data...</div>`:this.error?v`<div class="error">Error: ${this.error}</div>`:v`
            <div class="cattle-grid">
              ${this.cattle.map(t=>v`
                <div class="cattle-card">
                  <h3>${t.name} (#${t.cattleId})</h3>
                  <p><strong>Breed:</strong> ${t.breed}</p>
                  <p><strong>Gender:</strong> ${t.gender==="male"?"Bull":"Heifer"}</p>
                  ${t.weight?v`<p><strong>Weight:</strong> ${t.weight} lbs</p>`:""}
                  ${t.dateOfBirth?v`<p><strong>DOB:</strong> ${new Date(t.dateOfBirth).toLocaleDateString()}</p>`:""}
                  ${t.healthStatus?v`<p><strong>Health:</strong> ${t.healthStatus}</p>`:""}
                  ${t.location?v`<p><strong>Location:</strong> ${t.location}</p>`:""}
                  <a href="/app/cattle/details/${t.cattleId}" class="detail-link">View Details →</a>
                </div>
              `)}
            </div>
          `}
    `}};ge.styles=st`
    :host {
      display: block;
      padding: 20px;
    }
    
    .cattle-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    .cattle-card {
      border: 1px solid var(--color-border, #ddd);
      border-radius: var(--border-radius, 5px);
      padding: 15px;
      background-color: var(--color-background-card, white);
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: transform 0.3s ease;
    }
    
    .cattle-card:hover {
      transform: translateY(-5px);
    }
    
    h3 {
      margin-top: 0;
      color: var(--color-accent-hover, #123b22);
      font-family: var(--font-display, serif);
    }
    
    .loading, .error {
      padding: 20px;
      text-align: center;
      border-radius: var(--border-radius, 5px);
      margin: 20px 0;
    }
    
    .loading {
      background-color: #f8f9fa;
    }
    
    .error {
      background-color: #f8d7da;
      color: #721c24;
    }
    
    .detail-link {
      margin-top: 10px;
      display: block;
      color: var(--color-accent, #1a5632);
      text-decoration: none;
    }
    
    .detail-link:hover {
      text-decoration: underline;
    }
  `;let R=ge;Ht([It()],R.prototype,"src");Ht([S()],R.prototype,"cattle");Ht([S()],R.prototype,"loading");Ht([S()],R.prototype,"error");customElements.define("ranch-cattle",R);const me=class me extends x{render(){return v`
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
    `}};me.styles=st`
    :host {
      display: block;
      padding: var(--spacing-lg);
    }

    .dashboard-links {
      display: flex;
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-xl);
    }

    .dashboard-links a {
      background-color: var(--color-accent);
      color: var(--color-text-light);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--border-radius);
      flex: 1;
      text-align: center;
      text-decoration: none;
    }

    .dashboard-links a:hover {
      background-color: var(--color-accent-hover);
    }

    .card {
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      padding: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }
  `;let ee=me;customElements.define("home-view",ee);var Oi=Object.defineProperty,Hr=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Oi(t,e,s),s};const ve=class ve extends x{constructor(){super(...arguments),this.cattle=[],this.loading=!0}connectedCallback(){super.connectedCallback(),this.fetchCattle()}async fetchCattle(){try{const t=await fetch("/api/cattle");t.ok&&(this.cattle=await t.json())}catch(t){console.error("Error fetching cattle:",t)}finally{this.loading=!1}}render(){return v`
      <header>
        <svg class="icon">
          <use href="/icons/ncattle.svg#icon-cattle" />
        </svg>
        <h1>Cattle Database</h1>
        <p>View and manage cattle records from the MongoDB database</p>
      </header>

      <section>
        <h2>Cattle Records</h2>
        ${this.loading?v`<p>Loading cattle data...</p>`:v`
            <div class="cattle-grid">
              ${this.cattle.map(t=>v`
                <div class="cattle-card">
                  <h3>${t.name} (#${t.cattleId})</h3>
                  <p><strong>Breed:</strong> ${t.breed}</p>
                  <p><strong>Gender:</strong> ${t.gender==="male"?"Bull":"Heifer"}</p>
                  ${t.weight?v`<p><strong>Weight:</strong> ${t.weight} lbs</p>`:""}
                  ${t.healthStatus?v`<p><strong>Health:</strong> ${t.healthStatus}</p>`:""}
                </div>
              `)}
            </div>
          `}
      </section>

      <section>
        <h2>Add New Cattle</h2>
        <form class="form" @submit=${this._handleSubmit}>
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
    `}async _handleSubmit(t){t.preventDefault();const e=t.target,r=new FormData(e),s={};for(const[n,o]of r.entries())o!==null&&o!==""&&(s[n]=o);try{const n=await fetch("/api/cattle",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(n.ok)e.reset(),alert("Cattle added successfully!"),this.fetchCattle();else{const o=await n.json();alert(`Failed to add cattle: ${o.message}`)}}catch(n){console.error("Error adding cattle:",n),alert("Failed to add cattle")}}};ve.styles=st`
    :host {
      display: block;
      padding: var(--spacing-lg);
    }

    .cattle-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .cattle-card {
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      padding: 15px;
      background-color: var(--color-background-card);
    }

    .form {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-top: 20px;
    }

    .form label {
      display: flex;
      flex-direction: column;
    }

    .form input, .form select {
      padding: 8px;
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
    }

    .form button {
      grid-column: 1 / -1;
      padding: 10px;
      background-color: var(--color-accent);
      color: var(--color-text-light);
      border: none;
      border-radius: var(--border-radius);
      cursor: pointer;
      width: 200px;
    }
  `;let bt=ve;Hr([S()],bt.prototype,"cattle");Hr([S()],bt.prototype,"loading");customElements.define("cattle-database-view",bt);var Ri=Object.defineProperty,fe=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Ri(t,e,s),s};const ye=class ye extends x{constructor(){super(...arguments),this.people=[],this.loading=!0,this.activeTab="all"}connectedCallback(){super.connectedCallback(),this.loadPeople()}async loadPeople(){try{const t=await fetch("/data/ranchPeople.json");t.ok&&(this.people=await t.json())}catch(t){console.error("Error loading people:",t)}finally{this.loading=!1}}render(){const t=this.getFilteredPeople();return v`
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
        <button 
          class=${this.activeTab==="all"?"active":""} 
          @click=${()=>this.activeTab="all"}>
          All Personnel
        </button>
        <button 
          class=${this.activeTab==="farmhands"?"active":""} 
          @click=${()=>this.activeTab="farmhands"}>
          Farmhands
        </button>
        <button 
          class=${this.activeTab==="veterinarians"?"active":""} 
          @click=${()=>this.activeTab="veterinarians"}>
          Veterinarians
        </button>
        <button 
          class=${this.activeTab==="contractors"?"active":""} 
          @click=${()=>this.activeTab="contractors"}>
          Contractors
        </button>
      </div>

      <h2>Farm Personnel</h2>
      
      ${this.loading?v`<p>Loading personnel...</p>`:v`
          <div class="person-list">
            ${t.map(e=>v`
              <div class="person-card">
                <h3><a href="${e.detailLink}">${e.name}</a></h3>
                <p><strong>Role:</strong> ${e.role}</p>
                <p><strong>Experience:</strong> ${e.experience}</p>
                <p><a href="${e.detailLink}">View Details →</a></p>
              </div>
            `)}
            
            <!-- Static example cards based on your proto -->
            <div class="person-card">
              <h3><a href="/app/people/farmhands/farmhand">Farmhand</a></h3>
              <p><strong>Role:</strong> Senior Farmhand</p>
              <p><strong>Experience:</strong> 8 years</p>
              <p><strong>Supervisor:</strong> <a href="/app/operators/john-smith">John Smith</a></p>
              <p><strong>Supervisor:</strong> <a href="/app/operators/josephine-smith">Josephine Smith</a></p>
              <p><a href="/app/people/farmhands/farmhand">View Details →</a></p>
            </div>
          </div>
        `}

      <h2>Veterinarians & Contractors</h2>
      <div class="person-list">
        <!-- Add contractor cards here based on your data -->
      </div>
    `}getFilteredPeople(){return this.activeTab==="all"?this.people:this.people.filter(t=>{switch(this.activeTab){case"farmhands":return t.role.toLowerCase().includes("farmhand");case"veterinarians":return t.role.toLowerCase().includes("veterinarian");case"contractors":return t.role.toLowerCase().includes("contractor");default:return!0}})}};ye.styles=st`
    :host {
      display: block;
      padding: var(--spacing-lg);
    }

    .tabs {
      display: flex;
      border-bottom: 1px solid var(--color-border);
      margin-bottom: var(--spacing-lg);
    }

    .tabs button {
      background-color: var(--color-background-muted);
      border: none;
      padding: var(--spacing-sm) var(--spacing-md);
      cursor: pointer;
      font-size: 16px;
      border-radius: var(--border-radius) var(--border-radius) 0 0;
    }

    .tabs button.active {
      background-color: var(--color-accent);
      color: var(--color-text-light);
    }

    .person-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-lg);
    }

    .person-card {
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      padding: var(--spacing-md);
      width: 300px;
      background-color: var(--color-background-card);
    }

    .person-card h3 {
      margin-top: 0;
      color: var(--color-accent-hover);
    }

    .person-card a {
      color: var(--color-accent);
      text-decoration: none;
    }

    .person-card a:hover {
      text-decoration: underline;
    }

    .breadcrumb {
      margin-bottom: var(--spacing-lg);
    }

    .breadcrumb a {
      color: var(--color-accent);
      text-decoration: none;
    }

    .breadcrumb a:hover {
      text-decoration: underline;
    }

    svg.icon {
      display: inline;
      width: 7em;
      height: 7em;
      fill: var(--color-accent-light);
      vertical-align: top;
    }
  `;let rt=ye;fe([S()],rt.prototype,"people");fe([S()],rt.prototype,"loading");fe([S()],rt.prototype,"activeTab");customElements.define("people-management-view",rt);var Ui=Object.defineProperty,jr=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Ui(t,e,s),s};const be=class be extends x{constructor(){super(...arguments),this.activeTab="herds",this.stats={totalCattle:440,herds:4,bulls:8,calves:26}}render(){return v`
      <div class="breadcrumb">
        <a href="/app">Home</a> &gt; <span>Cattle Management</span>
      </div>

      <header>
        <svg class="icon">
          <use href="/public/icons/nfield.svg#icon-field" />
        </svg>
        <h1>Cattle Management</h1>
        <p>Manage herds, track individual cattle, and monitor health status</p>
      </header>

      <div class="stats">
        <div class="stat-card">
          <h3>${this.stats.totalCattle}</h3>
          <p>Total Cattle</p>
        </div>
        <div class="stat-card">
          <h3>${this.stats.herds}</h3>
          <p>Herds</p>
        </div>
        <div class="stat-card">
          <h3>${this.stats.bulls}</h3>
          <p>Bulls</p>
        </div>
        <div class="stat-card">
          <h3>${this.stats.calves}</h3>
          <p>Calves (less than 6 months)</p>
        </div>
      </div>

      <div class="tabs">
        <button 
          class=${this.activeTab==="herds"?"active":""} 
          @click=${()=>this.activeTab="herds"}>
          Herds
        </button>
        <button 
          class=${this.activeTab==="individual"?"active":""} 
          @click=${()=>this.activeTab="individual"}>
          Individual Cattle
        </button>
      </div>

      ${this.activeTab==="herds"?this.renderHerds():this.renderIndividualCattle()}
    `}renderHerds(){return v`
      <h2>Active Herds</h2>
      
      <div class="herd-list">
        <div class="herd-card">
          <h3><a href="/app/cattle/herds/example">Example Herd</a></h3>
          <p><strong>Count:</strong> 150 cattle</p>
          <p><strong>Type:</strong> Mixed</p>
          <p><strong>Location:</strong> Example Pasture (250 acres)</p>
          <p><strong>Primary Caretaker:</strong> <a href="/app/people/farmhands/farmhand">Farmhand</a></p>
          <p><a href="/app/cattle/herds/example">View Herd Details →</a></p>
        </div>

        <!-- Additional herd cards can be added here -->
        <div class="herd-card">
          <h3><a href="/app/cattle/herds/north-pasture">North Pasture Herd</a></h3>
          <p><strong>Count:</strong> 120 cattle</p>
          <p><strong>Type:</strong> Breeding</p>
          <p><strong>Location:</strong> North Pasture (180 acres)</p>
          <p><strong>Primary Caretaker:</strong> <a href="/app/people/farmhands/farmhand">Farmhand</a></p>
          <p><a href="/app/cattle/herds/north-pasture">View Herd Details →</a></p>
        </div>

        <div class="herd-card">
          <h3><a href="/app/cattle/herds/south-field">South Field Herd</a></h3>
          <p><strong>Count:</strong> 90 cattle</p>
          <p><strong>Type:</strong> Grazing</p>
          <p><strong>Location:</strong> South Field (200 acres)</p>
          <p><strong>Primary Caretaker:</strong> <a href="/app/people/farmhands/farmhand">Farmhand</a></p>
          <p><a href="/app/cattle/herds/south-field">View Herd Details →</a></p>
        </div>
      </div>
    `}renderIndividualCattle(){return v`
      <h2>Individual Cattle Management</h2>
      
      <div style="margin-bottom: var(--spacing-lg);">
        <p>Use the <a href="/app/cattle/database">Cattle Database</a> to view and manage individual cattle records.</p>
        <p>Key features:</p>
        <ul>
          <li>View all cattle with detailed information</li>
          <li>Add new cattle to the system</li>
          <li>Filter by gender, age, and other criteria</li>
          <li>Track health status and breeding records</li>
        </ul>
      </div>

      <div class="herd-card">
        <h3><a href="/app/cattle/database">Access Cattle Database</a></h3>
        <p>Complete database of all cattle with MongoDB integration</p>
        <p><a href="/app/cattle/database">Open Database →</a></p>
      </div>
    `}};be.styles=st`
    :host {
      display: block;
      padding: var(--spacing-lg);
    }

    .breadcrumb {
      margin-bottom: var(--spacing-lg);
    }

    .breadcrumb a {
      color: var(--color-accent);
      text-decoration: none;
    }

    .breadcrumb a:hover {
      text-decoration: underline;
    }

    .stats {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-lg);
    }

    .stat-card {
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      padding: var(--spacing-md);
      width: 200px;
      background-color: var(--color-background-card);
      text-align: center;
    }

    .stat-card h3 {
      margin-top: 0;
      color: var(--color-accent-hover);
      font-size: 2rem;
    }

    .tabs {
      display: flex;
      border-bottom: 1px solid var(--color-border);
      margin-bottom: var(--spacing-lg);
    }

    .tabs button {
      background-color: var(--color-background-muted);
      border: none;
      padding: var(--spacing-sm) var(--spacing-md);
      cursor: pointer;
      font-size: 16px;
      border-radius: var(--border-radius) var(--border-radius) 0 0;
    }

    .tabs button.active {
      background-color: var(--color-accent);
      color: var(--color-text-light);
    }

    .herd-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-lg);
    }

    .herd-card {
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      padding: var(--spacing-md);
      width: 300px;
      background-color: var(--color-background-card);
    }

    .herd-card h3 {
      margin-top: 0;
      color: var(--color-accent-hover);
    }

    .herd-card a {
      color: var(--color-accent);
      text-decoration: none;
    }

    .herd-card a:hover {
      text-decoration: underline;
    }

    svg.icon {
      display: inline;
      width: 7em;
      height: 7em;
      fill: var(--color-accent-light);
      vertical-align: top;
    }
  `;let _t=be;jr([S()],_t.prototype,"activeTab");jr([S()],_t.prototype,"stats");customElements.define("cattle-management-view",_t);const Ni=[{path:"/app/cattle/database",view:()=>v`
      <cattle-database-view></cattle-database-view>
    `},{path:"/app/cattle/herds/:herdId",view:i=>v`
      <herd-detail-view herd-id=${i.herdId}></herd-detail-view>
    `},{path:"/app/cattle/details/:cattleId",view:i=>v`
      <cattle-detail-view cattle-id=${i.cattleId}></cattle-detail-view>
    `},{path:"/app/cattle",view:()=>v`
      <cattle-management-view></cattle-management-view>
    `},{path:"/app/people/farmhands/:farmhandId",view:i=>v`
      <farmhand-detail-view farmhand-id=${i.farmhandId}></farmhand-detail-view>
    `},{path:"/app/people",view:()=>v`
      <people-management-view></people-management-view>
    `},{path:"/app/operators/:operatorId",view:i=>v`
      <operator-detail-view operator-id=${i.operatorId}></operator-detail-view>
    `},{path:"/app",view:()=>v`
      <home-view></home-view>
    `},{path:"/",redirect:"/app"}];si({"ranch-auth":ss.Provider,"ranch-history":cs.Provider,"ranch-header":Ir,"ranch-cattle":R,"ranch-switch":class extends ti.Element{constructor(){super(Ni,"ranch:history","ranch:auth")}}});window.addEventListener("DOMContentLoaded",()=>{const i=document.querySelector("ranch-auth");i&&i.addEventListener("auth:message",t=>{const[e,r]=t.detail;switch(e){case"auth/signin":r.token&&(localStorage.setItem("token",r.token),r.redirect&&(window.location.href=r.redirect));break;case"auth/signout":localStorage.removeItem("token"),window.location.href="/login.html";break}})});
