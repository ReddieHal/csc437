(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function e(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(r){if(r.ep)return;r.ep=!0;const i=e(r);fetch(r.href,i)}})();var J,Re;class gt extends Error{}gt.prototype.name="InvalidTokenError";function es(o){return decodeURIComponent(atob(o).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function rs(o){let t=o.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return es(t)}catch{return atob(t)}}function cr(o,t){if(typeof o!="string")throw new gt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=o.split(".")[e];if(typeof s!="string")throw new gt(`Invalid token specified: missing part #${e+1}`);let r;try{r=rs(s)}catch(i){throw new gt(`Invalid token specified: invalid base64 for part #${e+1} (${i.message})`)}try{return JSON.parse(r)}catch(i){throw new gt(`Invalid token specified: invalid json for part #${e+1} (${i.message})`)}}const ss="mu:context",se=`${ss}:change`;class os{constructor(t,e){this._proxy=is(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ce extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new os(t,this),this.style.display="contents"}attach(t){return this.addEventListener(se,t),t}detach(t){this.removeEventListener(se,t)}}function is(o,t){return new Proxy(o,{get:(s,r,i)=>{if(r==="then")return;const n=Reflect.get(s,r,i);return console.log(`Context['${r}'] => `,n),n},set:(s,r,i,n)=>{const l=o[r];console.log(`Context['${r.toString()}'] <= `,i);const a=Reflect.set(s,r,i,n);if(a){let p=new CustomEvent(se,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(p,{property:r,oldValue:l,value:i}),t.dispatchEvent(p)}else console.log(`Context['${r}] was not set to ${i}`);return a}})}function ns(o,t){const e=hr(t,o);return new Promise((s,r)=>{if(e){const i=e.localName;customElements.whenDefined(i).then(()=>s(e))}else r({context:t,reason:`No provider for this context "${t}:`})})}function hr(o,t){const e=`[provides="${o}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const r=t.getRootNode();if(r instanceof ShadowRoot)return hr(o,r.host)}class as extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function dr(o="mu:message"){return(t,...e)=>t.dispatchEvent(new as(e,o))}class he{constructor(t,e,s="service:message",r=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=r}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function ls(o){return t=>({...t,...o})}const oe="mu:auth:jwt",ur=class pr extends he{constructor(t,e){super((s,r)=>this.update(s,r),t,pr.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:r}=t[1];return e(hs(s)),Zt(r);case"auth/signout":return e(ds()),Zt(this._redirectForLogin);case"auth/redirect":return Zt(this._redirectForLogin,{next:window.location.href});default:const i=t[0];throw new Error(`Unhandled Auth message "${i}"`)}}};ur.EVENT_TYPE="auth:message";let gr=ur;const fr=dr(gr.EVENT_TYPE);function Zt(o,t={}){if(!o)return;const e=window.location.href,s=new URL(o,e);return Object.entries(t).forEach(([r,i])=>s.searchParams.set(r,i)),()=>{console.log("Redirecting to ",o),window.location.assign(s)}}class cs extends ce{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=et.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new gr(this.context,this.redirect).attach(this)}}class tt{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(oe),t}}class et extends tt{constructor(t){super();const e=cr(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new et(t);return localStorage.setItem(oe,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(oe);return t?et.authenticate(t):new tt}}function hs(o){return ls({user:et.authenticate(o),token:o})}function ds(){return o=>{const t=o.user;return{user:t&&t.authenticated?tt.deauthenticate(t):t,token:""}}}function us(o){return o.authenticated?{Authorization:`Bearer ${o.token||"NO_TOKEN"}`}:{}}function ps(o){return o.authenticated?cr(o.token||""):{}}const M=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:et,Provider:cs,User:tt,dispatch:fr,headers:us,payload:ps},Symbol.toStringTag,{value:"Module"}));function ie(o,t,e){const s=o.target,r=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${o.type}:`,r),s.dispatchEvent(r),o.stopPropagation()}function Me(o,t="*"){return o.composedPath().find(s=>{const r=s;return r.tagName&&r.matches(t)})}function mr(o,...t){const e=o.map((r,i)=>i?[t[i-1],r]:[r]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const gs=new DOMParser;function z(o,...t){const e=t.map(l),s=o.map((a,p)=>{if(p===0)return[a];const f=e[p-1];return f instanceof Node?[`<ins id="mu-html-${p-1}"></ins>`,a]:[f,a]}).flat().join(""),r=gs.parseFromString(s,"text/html"),i=r.head.childElementCount?r.head.children:r.body.children,n=new DocumentFragment;return n.replaceChildren(...i),e.forEach((a,p)=>{if(a instanceof Node){const f=n.querySelector(`ins#mu-html-${p}`);if(f){const d=f.parentNode;d==null||d.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${p}`)}}),n;function l(a,p){if(a===null)return"";switch(typeof a){case"string":return Ne(a);case"bigint":case"boolean":case"number":case"symbol":return Ne(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,d=a.map(l);return f.replaceChildren(...d),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Ne(o){return o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function jt(o,t={mode:"open"}){const e=o.attachShadow(t),s={template:r,styles:i};return s;function r(n){const l=n.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function i(...n){e.adoptedStyleSheets=n}}let fs=(J=class extends HTMLElement{constructor(){super(),this._state={},jt(this).template(J.template).styles(J.styles),this.addEventListener("change",o=>{const t=o.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",o=>{o.preventDefault(),ie(o,"mu-form:submit",this._state)})}set init(o){this._state=o||{},ms(this._state,this)}get form(){var o;return(o=this.shadowRoot)==null?void 0:o.querySelector("form")}},J.template=z`
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
  `,J.styles=mr`
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
  `,J);function ms(o,t){const e=Object.entries(o);for(const[s,r]of e){const i=t.querySelector(`[name="${s}"]`);if(i){const n=i;switch(n.type){case"checkbox":const l=n;l.checked=!!r;break;case"date":n.value=r.toISOString().substr(0,10);break;default:n.value=r;break}}}return o}const vs=Object.freeze(Object.defineProperty({__proto__:null,Element:fs},Symbol.toStringTag,{value:"Module"})),vr=class br extends he{constructor(t){super((e,s)=>this.update(e,s),t,br.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:r}=t[1];e(ys(s,r));break}case"history/redirect":{const{href:s,state:r}=t[1];e(_s(s,r));break}}}};vr.EVENT_TYPE="history:message";let de=vr;class Ue extends ce{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=bs(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ue(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new de(this.context).attach(this)}}function bs(o){const t=o.currentTarget,e=s=>s.tagName=="A"&&s.href;if(o.button===0)if(o.composed){const r=o.composedPath().find(e);return r||void 0}else{for(let s=o.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function ys(o,t={}){return history.pushState(t,"",o),()=>({location:document.location,state:history.state})}function _s(o,t={}){return history.replaceState(t,"",o),()=>({location:document.location,state:history.state})}const ue=dr(de.EVENT_TYPE),$s=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Ue,Provider:Ue,Service:de,dispatch:ue},Symbol.toStringTag,{value:"Module"}));class bt{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const r=new Le(this._provider,t);this._effects.push(r),e(r)}else ns(this._target,this._contextLabel).then(r=>{const i=new Le(r,t);this._provider=r,this._effects.push(i),r.attach(n=>this._handleChange(n)),e(i)}).catch(r=>console.log(`Observer ${this._contextLabel}: ${r}`,r))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Le{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const yr=class _r extends HTMLElement{constructor(){super(),this._state={},this._user=new tt,this._authObserver=new bt(this,"blazing:auth"),jt(this).template(_r.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;ws(r,this._state,e,this.authorization).then(i=>ht(i,this)).then(i=>{const n=`mu-rest-form:${s}`,l=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,[s]:i,url:r}});this.dispatchEvent(l)}).catch(i=>{const n="mu-rest-form:error",l=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,error:i,url:r,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},ht(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&He(this.src,this.authorization).then(e=>{this._state=e,ht(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&He(this.src,this.authorization).then(r=>{this._state=r,ht(r,this)});break;case"new":s&&(this._state={},ht({},this));break}}};yr.observedAttributes=["src","new","action"];yr.template=z`
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
  `;function He(o,t){return fetch(o,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${o}:`,e))}function ht(o,t){const e=Object.entries(o);for(const[s,r]of e){const i=t.querySelector(`[name="${s}"]`);if(i){const n=i;switch(n.type){case"checkbox":const l=n;l.checked=!!r;break;default:n.value=r;break}}}return o}function ws(o,t,e="PUT",s={}){return fetch(o,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const $r=class wr extends he{constructor(t,e){super(e,t,wr.EVENT_TYPE,!1)}};$r.EVENT_TYPE="mu:message";let xr=$r;class xs extends ce{constructor(t,e,s){super(e),this._user=new tt,this._updateFn=t,this._authObserver=new bt(this,s)}connectedCallback(){const t=new xr(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const Es=Object.freeze(Object.defineProperty({__proto__:null,Provider:xs,Service:xr},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tt=globalThis,pe=Tt.ShadowRoot&&(Tt.ShadyCSS===void 0||Tt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ge=Symbol(),De=new WeakMap;let Er=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ge)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(pe&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=De.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&De.set(e,t))}return t}toString(){return this.cssText}};const As=o=>new Er(typeof o=="string"?o:o+"",void 0,ge),Ss=(o,...t)=>{const e=o.length===1?o[0]:t.reduce((s,r,i)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+o[i+1],o[0]);return new Er(e,o,ge)},ks=(o,t)=>{if(pe)o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=Tt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,o.appendChild(s)}},je=pe?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return As(e)})(o):o;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ps,defineProperty:Cs,getOwnPropertyDescriptor:Os,getOwnPropertyNames:Ts,getOwnPropertySymbols:Is,getPrototypeOf:Rs}=Object,rt=globalThis,Be=rt.trustedTypes,Ms=Be?Be.emptyScript:"",ze=rt.reactiveElementPolyfillSupport,ft=(o,t)=>o,Rt={toAttribute(o,t){switch(t){case Boolean:o=o?Ms:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let e=o;switch(t){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},fe=(o,t)=>!Ps(o,t),Fe={attribute:!0,type:String,converter:Rt,reflect:!1,hasChanged:fe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),rt.litPropertyMetadata??(rt.litPropertyMetadata=new WeakMap);let Z=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Fe){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Cs(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:i}=Os(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get(){return r==null?void 0:r.call(this)},set(n){const l=r==null?void 0:r.call(this);i.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Fe}static _$Ei(){if(this.hasOwnProperty(ft("elementProperties")))return;const t=Rs(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ft("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ft("properties"))){const e=this.properties,s=[...Ts(e),...Is(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(je(r))}else t!==void 0&&e.push(je(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ks(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const r=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,r);if(i!==void 0&&r.reflect===!0){const n=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:Rt).toAttribute(e,r.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){var s;const r=this.constructor,i=r._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const n=r.getPropertyOptions(i),l=typeof n.converter=="function"?{fromAttribute:n.converter}:((s=n.converter)==null?void 0:s.fromAttribute)!==void 0?n.converter:Rt;this._$Em=i,this[i]=l.fromAttribute(e,n.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??fe)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[i,n]of r)n.wrapped!==!0||this._$AL.has(i)||this[i]===void 0||this.P(i,this[i],n)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(r=>{var i;return(i=r.hostUpdate)==null?void 0:i.call(r)}),this.update(s)):this._$EU()}catch(r){throw e=!1,this._$EU(),r}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};Z.elementStyles=[],Z.shadowRootOptions={mode:"open"},Z[ft("elementProperties")]=new Map,Z[ft("finalized")]=new Map,ze==null||ze({ReactiveElement:Z}),(rt.reactiveElementVersions??(rt.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Mt=globalThis,Nt=Mt.trustedTypes,qe=Nt?Nt.createPolicy("lit-html",{createHTML:o=>o}):void 0,Ar="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,Sr="?"+P,Ns=`<${Sr}>`,q=document,yt=()=>q.createComment(""),_t=o=>o===null||typeof o!="object"&&typeof o!="function",me=Array.isArray,Us=o=>me(o)||typeof(o==null?void 0:o[Symbol.iterator])=="function",Qt=`[ 	
\f\r]`,dt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ve=/-->/g,We=/>/g,H=RegExp(`>|${Qt}(?:([^\\s"'>=/]+)(${Qt}*=${Qt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ye=/'/g,Ge=/"/g,kr=/^(?:script|style|textarea|title)$/i,Ls=o=>(t,...e)=>({_$litType$:o,strings:t,values:e}),ut=Ls(1),st=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Je=new WeakMap,j=q.createTreeWalker(q,129);function Pr(o,t){if(!me(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return qe!==void 0?qe.createHTML(t):t}const Hs=(o,t)=>{const e=o.length-1,s=[];let r,i=t===2?"<svg>":t===3?"<math>":"",n=dt;for(let l=0;l<e;l++){const a=o[l];let p,f,d=-1,c=0;for(;c<a.length&&(n.lastIndex=c,f=n.exec(a),f!==null);)c=n.lastIndex,n===dt?f[1]==="!--"?n=Ve:f[1]!==void 0?n=We:f[2]!==void 0?(kr.test(f[2])&&(r=RegExp("</"+f[2],"g")),n=H):f[3]!==void 0&&(n=H):n===H?f[0]===">"?(n=r??dt,d=-1):f[1]===void 0?d=-2:(d=n.lastIndex-f[2].length,p=f[1],n=f[3]===void 0?H:f[3]==='"'?Ge:Ye):n===Ge||n===Ye?n=H:n===Ve||n===We?n=dt:(n=H,r=void 0);const h=n===H&&o[l+1].startsWith("/>")?" ":"";i+=n===dt?a+Ns:d>=0?(s.push(p),a.slice(0,d)+Ar+a.slice(d)+P+h):a+P+(d===-2?l:h)}return[Pr(o,i+(o[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let ne=class Cr{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let i=0,n=0;const l=t.length-1,a=this.parts,[p,f]=Hs(t,e);if(this.el=Cr.createElement(p,s),j.currentNode=this.el.content,e===2||e===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=j.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(Ar)){const c=f[n++],h=r.getAttribute(d).split(P),g=/([.?@])?(.*)/.exec(c);a.push({type:1,index:i,name:g[2],strings:h,ctor:g[1]==="."?js:g[1]==="?"?Bs:g[1]==="@"?zs:Bt}),r.removeAttribute(d)}else d.startsWith(P)&&(a.push({type:6,index:i}),r.removeAttribute(d));if(kr.test(r.tagName)){const d=r.textContent.split(P),c=d.length-1;if(c>0){r.textContent=Nt?Nt.emptyScript:"";for(let h=0;h<c;h++)r.append(d[h],yt()),j.nextNode(),a.push({type:2,index:++i});r.append(d[c],yt())}}}else if(r.nodeType===8)if(r.data===Sr)a.push({type:2,index:i});else{let d=-1;for(;(d=r.data.indexOf(P,d+1))!==-1;)a.push({type:7,index:i}),d+=P.length-1}i++}}static createElement(t,e){const s=q.createElement("template");return s.innerHTML=t,s}};function ot(o,t,e=o,s){var r,i;if(t===st)return t;let n=s!==void 0?(r=e.o)==null?void 0:r[s]:e.l;const l=_t(t)?void 0:t._$litDirective$;return(n==null?void 0:n.constructor)!==l&&((i=n==null?void 0:n._$AO)==null||i.call(n,!1),l===void 0?n=void 0:(n=new l(o),n._$AT(o,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=n:e.l=n),n!==void 0&&(t=ot(o,n._$AS(o,t.values),n,s)),t}class Ds{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??q).importNode(e,!0);j.currentNode=r;let i=j.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let p;a.type===2?p=new At(i,i.nextSibling,this,t):a.type===1?p=new a.ctor(i,a.name,a.strings,this,t):a.type===6&&(p=new Fs(i,this,t)),this._$AV.push(p),a=s[++l]}n!==(a==null?void 0:a.index)&&(i=j.nextNode(),n++)}return j.currentNode=q,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class At{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,r){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this.v=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ot(this,t,e),_t(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==st&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Us(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&_t(this._$AH)?this._$AA.nextSibling.data=t:this.T(q.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:r}=t,i=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=ne.createElement(Pr(r.h,r.h[0]),this.options)),r);if(((e=this._$AH)==null?void 0:e._$AD)===i)this._$AH.p(s);else{const n=new Ds(i,this),l=n.u(this.options);n.p(s),this.T(l),this._$AH=n}}_$AC(t){let e=Je.get(t.strings);return e===void 0&&Je.set(t.strings,e=new ne(t)),e}k(t){me(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const i of t)r===e.length?e.push(s=new At(this.O(yt()),this.O(yt()),this,this.options)):s=e[r],s._$AI(i),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Bt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,i){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=i,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(t,e=this,s,r){const i=this.strings;let n=!1;if(i===void 0)t=ot(this,t,e,0),n=!_t(t)||t!==this._$AH&&t!==st,n&&(this._$AH=t);else{const l=t;let a,p;for(t=i[0],a=0;a<i.length-1;a++)p=ot(this,l[s+a],e,a),p===st&&(p=this._$AH[a]),n||(n=!_t(p)||p!==this._$AH[a]),p===_?t=_:t!==_&&(t+=(p??"")+i[a+1]),this._$AH[a]=p}n&&!r&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class js extends Bt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}}class Bs extends Bt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}}class zs extends Bt{constructor(t,e,s,r,i){super(t,e,s,r,i),this.type=5}_$AI(t,e=this){if((t=ot(this,t,e,0)??_)===st)return;const s=this._$AH,r=t===_&&s!==_||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,i=t!==_&&(s===_||r);r&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Fs{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){ot(this,t)}}const Ke=Mt.litHtmlPolyfillSupport;Ke==null||Ke(ne,At),(Mt.litHtmlVersions??(Mt.litHtmlVersions=[])).push("3.2.0");const qs=(o,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const i=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new At(t.insertBefore(yt(),i),i,void 0,e??{})}return r._$AI(o),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let X=class extends Z{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=qs(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return st}};X._$litElement$=!0,X.finalized=!0,(Re=globalThis.litElementHydrateSupport)==null||Re.call(globalThis,{LitElement:X});const Ze=globalThis.litElementPolyfillSupport;Ze==null||Ze({LitElement:X});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Vs={attribute:!0,type:String,converter:Rt,reflect:!1,hasChanged:fe},Ws=(o=Vs,t,e)=>{const{kind:s,metadata:r}=e;let i=globalThis.litPropertyMetadata.get(r);if(i===void 0&&globalThis.litPropertyMetadata.set(r,i=new Map),i.set(e.name,o),s==="accessor"){const{name:n}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,o)},init(l){return l!==void 0&&this.P(n,void 0,o),l}}}if(s==="setter"){const{name:n}=e;return function(l){const a=this[n];t.call(this,l),this.requestUpdate(n,a,o)}}throw Error("Unsupported decorator location: "+s)};function Or(o){return(t,e)=>typeof e=="object"?Ws(o,t,e):((s,r,i)=>{const n=r.hasOwnProperty(i);return r.constructor.createProperty(i,n?{...s,wrapped:!0}:s),n?Object.getOwnPropertyDescriptor(r,i):void 0})(o,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Tr(o){return Or({...o,state:!0,attribute:!1})}function Ys(o){return o&&o.__esModule&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o}function Gs(o){throw new Error('Could not dynamically require "'+o+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ir={};(function(o){var t=function(){var e=function(d,c,h,g){for(h=h||{},g=d.length;g--;h[d[g]]=c);return h},s=[1,9],r=[1,10],i=[1,11],n=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,g,v,m,b,Wt){var E=b.length-1;switch(m){case 1:return new v.Root({},[b[E-1]]);case 2:return new v.Root({},[new v.Literal({value:""})]);case 3:this.$=new v.Concat({},[b[E-1],b[E]]);break;case 4:case 5:this.$=b[E];break;case 6:this.$=new v.Literal({value:b[E]});break;case 7:this.$=new v.Splat({name:b[E]});break;case 8:this.$=new v.Param({name:b[E]});break;case 9:this.$=new v.Optional({},[b[E-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:i,15:n},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:i,15:n},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:i,15:n},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:i,15:n},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let g=function(v,m){this.message=v,this.hash=m};throw g.prototype=Error,new g(c,h)}},parse:function(c){var h=this,g=[0],v=[null],m=[],b=this.table,Wt="",E=0,Oe=0,Zr=2,Te=1,Qr=m.slice.call(arguments,1),y=Object.create(this.lexer),U={yy:{}};for(var Yt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Yt)&&(U.yy[Yt]=this.yy[Yt]);y.setInput(c,U.yy),U.yy.lexer=y,U.yy.parser=this,typeof y.yylloc>"u"&&(y.yylloc={});var Gt=y.yylloc;m.push(Gt);var Xr=y.options&&y.options.ranges;typeof U.yy.parseError=="function"?this.parseError=U.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var ts=function(){var G;return G=y.lex()||Te,typeof G!="number"&&(G=h.symbols_[G]||G),G},x,L,A,Jt,Y={},Ct,S,Ie,Ot;;){if(L=g[g.length-1],this.defaultActions[L]?A=this.defaultActions[L]:((x===null||typeof x>"u")&&(x=ts()),A=b[L]&&b[L][x]),typeof A>"u"||!A.length||!A[0]){var Kt="";Ot=[];for(Ct in b[L])this.terminals_[Ct]&&Ct>Zr&&Ot.push("'"+this.terminals_[Ct]+"'");y.showPosition?Kt="Parse error on line "+(E+1)+`:
`+y.showPosition()+`
Expecting `+Ot.join(", ")+", got '"+(this.terminals_[x]||x)+"'":Kt="Parse error on line "+(E+1)+": Unexpected "+(x==Te?"end of input":"'"+(this.terminals_[x]||x)+"'"),this.parseError(Kt,{text:y.match,token:this.terminals_[x]||x,line:y.yylineno,loc:Gt,expected:Ot})}if(A[0]instanceof Array&&A.length>1)throw new Error("Parse Error: multiple actions possible at state: "+L+", token: "+x);switch(A[0]){case 1:g.push(x),v.push(y.yytext),m.push(y.yylloc),g.push(A[1]),x=null,Oe=y.yyleng,Wt=y.yytext,E=y.yylineno,Gt=y.yylloc;break;case 2:if(S=this.productions_[A[1]][1],Y.$=v[v.length-S],Y._$={first_line:m[m.length-(S||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(S||1)].first_column,last_column:m[m.length-1].last_column},Xr&&(Y._$.range=[m[m.length-(S||1)].range[0],m[m.length-1].range[1]]),Jt=this.performAction.apply(Y,[Wt,Oe,E,U.yy,A[1],v,m].concat(Qr)),typeof Jt<"u")return Jt;S&&(g=g.slice(0,-1*S*2),v=v.slice(0,-1*S),m=m.slice(0,-1*S)),g.push(this.productions_[A[1]][0]),v.push(Y.$),m.push(Y._$),Ie=b[g[g.length-2]][g[g.length-1]],g.push(Ie);break;case 3:return!0}}return!0}},p=function(){var d={EOF:1,parseError:function(h,g){if(this.yy.parser)this.yy.parser.parseError(h,g);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,g=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var v=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),g.length-1&&(this.yylineno-=g.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:g?(g.length===v.length?this.yylloc.first_column:0)+v[v.length-g.length].length-g[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var g,v,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),v=c[0].match(/(?:\r\n?|\n).*/g),v&&(this.yylineno+=v.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:v?v[v.length-1].length-v[v.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],g=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),g)return g;if(this._backtrack){for(var b in m)this[b]=m[b];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,g,v;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),b=0;b<m.length;b++)if(g=this._input.match(this.rules[m[b]]),g&&(!h||g[0].length>h[0].length)){if(h=g,v=b,this.options.backtrack_lexer){if(c=this.test_match(g,m[b]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[v]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,g,v,m){switch(v){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return d}();a.lexer=p;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Gs<"u"&&(o.parser=t,o.Parser=t.Parser,o.parse=function(){return t.parse.apply(t,arguments)})})(Ir);function K(o){return function(t,e){return{displayName:o,props:t,children:e||[]}}}var Rr={Root:K("Root"),Concat:K("Concat"),Literal:K("Literal"),Splat:K("Splat"),Param:K("Param"),Optional:K("Optional")},Mr=Ir.parser;Mr.yy=Rr;var Js=Mr,Ks=Object.keys(Rr);function Zs(o){return Ks.forEach(function(t){if(typeof o[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:o}}var Nr=Zs,Qs=Nr,Xs=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Ur(o){this.captures=o.captures,this.re=o.re}Ur.prototype.match=function(o){var t=this.re.exec(o),e={};if(t)return this.captures.forEach(function(s,r){typeof t[r+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[r+1])}),e};var to=Qs({Concat:function(o){return o.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(o){return{re:o.props.value.replace(Xs,"\\$&"),captures:[]}},Splat:function(o){return{re:"([^?]*?)",captures:[o.props.name]}},Param:function(o){return{re:"([^\\/\\?]+)",captures:[o.props.name]}},Optional:function(o){var t=this.visit(o.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(o){var t=this.visit(o.children[0]);return new Ur({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),eo=to,ro=Nr,so=ro({Concat:function(o,t){var e=o.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(o){return decodeURI(o.props.value)},Splat:function(o,t){return t[o.props.name]?t[o.props.name]:!1},Param:function(o,t){return t[o.props.name]?t[o.props.name]:!1},Optional:function(o,t){var e=this.visit(o.children[0],t);return e||""},Root:function(o,t){t=t||{};var e=this.visit(o.children[0],t);return e?encodeURI(e):!1}}),oo=so,io=Js,no=eo,ao=oo;St.prototype=Object.create(null);St.prototype.match=function(o){var t=no.visit(this.ast),e=t.match(o);return e||!1};St.prototype.reverse=function(o){return ao.visit(this.ast,o)};function St(o){var t;if(this?t=this:t=Object.create(St.prototype),typeof o>"u")throw new Error("A route spec is required");return t.spec=o,t.ast=io.parse(o),t}var lo=St,co=lo,ho=co;const uo=Ys(ho);var po=Object.defineProperty,Lr=(o,t,e,s)=>{for(var r=void 0,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=n(t,e,r)||r);return r&&po(t,e,r),r};const Hr=class extends X{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>ut` <h1>Not Found</h1> `,this._cases=t.map(r=>({...r,route:new uo(r.path)})),this._historyObserver=new bt(this,e),this._authObserver=new bt(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),ut` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(fr(this,"auth/redirect"),ut` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):ut` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),ut` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,r=new URLSearchParams(e),i=s+e;for(const n of this._cases){const l=n.route.match(i);if(l)return{...n,path:s,params:l,query:r}}}redirect(t){ue(this,"history/redirect",{href:t})}};Hr.styles=Ss`
    :host,
    main {
      display: contents;
    }
  `;let Ut=Hr;Lr([Tr()],Ut.prototype,"_user");Lr([Tr()],Ut.prototype,"_match");const go=Object.freeze(Object.defineProperty({__proto__:null,Element:Ut,Switch:Ut},Symbol.toStringTag,{value:"Module"})),fo=class Dr extends HTMLElement{constructor(){if(super(),jt(this).template(Dr.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};fo.template=z`
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
  `;const jr=class ae extends HTMLElement{constructor(){super(),this._array=[],jt(this).template(ae.template).styles(ae.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Br("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),r=e.value,i=e.closest("label");if(i){const n=Array.from(this.children).indexOf(i);this._array[n]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{Me(t,"button.add")?ie(t,"input-array:add"):Me(t,"button.remove")&&ie(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],mo(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};jr.template=z`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;jr.styles=mr`
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
  `;function mo(o,t){t.replaceChildren(),o.forEach((e,s)=>t.append(Br(e)))}function Br(o,t){const e=o===void 0?z`<input />`:z`<input value="${o}" />`;return z`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function zr(o){return Object.entries(o).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var vo=Object.defineProperty,bo=Object.getOwnPropertyDescriptor,yo=(o,t,e,s)=>{for(var r=bo(t,e),i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=n(t,e,r)||r);return r&&vo(t,e,r),r};class kt extends X{constructor(t){super(),this._pending=[],this._observer=new bt(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}yo([Or()],kt.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const It=globalThis,ve=It.ShadowRoot&&(It.ShadyCSS===void 0||It.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,be=Symbol(),Qe=new WeakMap;let Fr=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==be)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ve&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Qe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Qe.set(e,t))}return t}toString(){return this.cssText}};const _o=o=>new Fr(typeof o=="string"?o:o+"",void 0,be),N=(o,...t)=>{const e=o.length===1?o[0]:t.reduce((s,r,i)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+o[i+1],o[0]);return new Fr(e,o,be)},$o=(o,t)=>{if(ve)o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=It.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,o.appendChild(s)}},Xe=ve?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return _o(e)})(o):o;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:wo,defineProperty:xo,getOwnPropertyDescriptor:Eo,getOwnPropertyNames:Ao,getOwnPropertySymbols:So,getPrototypeOf:ko}=Object,O=globalThis,tr=O.trustedTypes,Po=tr?tr.emptyScript:"",Xt=O.reactiveElementPolyfillSupport,mt=(o,t)=>o,Lt={toAttribute(o,t){switch(t){case Boolean:o=o?Po:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let e=o;switch(t){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},ye=(o,t)=>!wo(o,t),er={attribute:!0,type:String,converter:Lt,reflect:!1,useDefault:!1,hasChanged:ye};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),O.litPropertyMetadata??(O.litPropertyMetadata=new WeakMap);let Q=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=er){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&xo(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:i}=Eo(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){const l=r==null?void 0:r.call(this);i==null||i.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??er}static _$Ei(){if(this.hasOwnProperty(mt("elementProperties")))return;const t=ko(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(mt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(mt("properties"))){const e=this.properties,s=[...Ao(e),...So(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Xe(r))}else t!==void 0&&e.push(Xe(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return $o(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var i;const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const n=(((i=s.converter)==null?void 0:i.toAttribute)!==void 0?s.converter:Lt).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(t,e){var i,n;const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const l=s.getPropertyOptions(r),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((i=l.converter)==null?void 0:i.fromAttribute)!==void 0?l.converter:Lt;this._$Em=r,this[r]=a.fromAttribute(e,l.type)??((n=this._$Ej)==null?void 0:n.get(r))??null,this._$Em=null}}requestUpdate(t,e,s){var r;if(t!==void 0){const i=this.constructor,n=this[t];if(s??(s=i.getPropertyOptions(t)),!((s.hasChanged??ye)(n,e)||s.useDefault&&s.reflect&&n===((r=this._$Ej)==null?void 0:r.get(t))&&!this.hasAttribute(i._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:i},n){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??e??this[t]),i!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[i,n]of r){const{wrapped:l}=n,a=this[i];l!==!0||this._$AL.has(i)||a===void 0||this.C(i,void 0,n,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(r=>{var i;return(i=r.hostUpdate)==null?void 0:i.call(r)}),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};Q.elementStyles=[],Q.shadowRootOptions={mode:"open"},Q[mt("elementProperties")]=new Map,Q[mt("finalized")]=new Map,Xt==null||Xt({ReactiveElement:Q}),(O.reactiveElementVersions??(O.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const vt=globalThis,Ht=vt.trustedTypes,rr=Ht?Ht.createPolicy("lit-html",{createHTML:o=>o}):void 0,qr="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,Vr="?"+C,Co=`<${Vr}>`,V=document,$t=()=>V.createComment(""),wt=o=>o===null||typeof o!="object"&&typeof o!="function",_e=Array.isArray,Oo=o=>_e(o)||typeof(o==null?void 0:o[Symbol.iterator])=="function",te=`[ 	
\f\r]`,pt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,sr=/-->/g,or=/>/g,D=RegExp(`>|${te}(?:([^\\s"'>=/]+)(${te}*=${te}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ir=/'/g,nr=/"/g,Wr=/^(?:script|style|textarea|title)$/i,To=o=>(t,...e)=>({_$litType$:o,strings:t,values:e}),u=To(1),it=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),ar=new WeakMap,B=V.createTreeWalker(V,129);function Yr(o,t){if(!_e(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return rr!==void 0?rr.createHTML(t):t}const Io=(o,t)=>{const e=o.length-1,s=[];let r,i=t===2?"<svg>":t===3?"<math>":"",n=pt;for(let l=0;l<e;l++){const a=o[l];let p,f,d=-1,c=0;for(;c<a.length&&(n.lastIndex=c,f=n.exec(a),f!==null);)c=n.lastIndex,n===pt?f[1]==="!--"?n=sr:f[1]!==void 0?n=or:f[2]!==void 0?(Wr.test(f[2])&&(r=RegExp("</"+f[2],"g")),n=D):f[3]!==void 0&&(n=D):n===D?f[0]===">"?(n=r??pt,d=-1):f[1]===void 0?d=-2:(d=n.lastIndex-f[2].length,p=f[1],n=f[3]===void 0?D:f[3]==='"'?nr:ir):n===nr||n===ir?n=D:n===sr||n===or?n=pt:(n=D,r=void 0);const h=n===D&&o[l+1].startsWith("/>")?" ":"";i+=n===pt?a+Co:d>=0?(s.push(p),a.slice(0,d)+qr+a.slice(d)+C+h):a+C+(d===-2?l:h)}return[Yr(o,i+(o[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class xt{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let i=0,n=0;const l=t.length-1,a=this.parts,[p,f]=Io(t,e);if(this.el=xt.createElement(p,s),B.currentNode=this.el.content,e===2||e===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=B.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(qr)){const c=f[n++],h=r.getAttribute(d).split(C),g=/([.?@])?(.*)/.exec(c);a.push({type:1,index:i,name:g[2],strings:h,ctor:g[1]==="."?Mo:g[1]==="?"?No:g[1]==="@"?Uo:zt}),r.removeAttribute(d)}else d.startsWith(C)&&(a.push({type:6,index:i}),r.removeAttribute(d));if(Wr.test(r.tagName)){const d=r.textContent.split(C),c=d.length-1;if(c>0){r.textContent=Ht?Ht.emptyScript:"";for(let h=0;h<c;h++)r.append(d[h],$t()),B.nextNode(),a.push({type:2,index:++i});r.append(d[c],$t())}}}else if(r.nodeType===8)if(r.data===Vr)a.push({type:2,index:i});else{let d=-1;for(;(d=r.data.indexOf(C,d+1))!==-1;)a.push({type:7,index:i}),d+=C.length-1}i++}}static createElement(t,e){const s=V.createElement("template");return s.innerHTML=t,s}}function nt(o,t,e=o,s){var n,l;if(t===it)return t;let r=s!==void 0?(n=e._$Co)==null?void 0:n[s]:e._$Cl;const i=wt(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==i&&((l=r==null?void 0:r._$AO)==null||l.call(r,!1),i===void 0?r=void 0:(r=new i(o),r._$AT(o,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=r:e._$Cl=r),r!==void 0&&(t=nt(o,r._$AS(o,t.values),r,s)),t}class Ro{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??V).importNode(e,!0);B.currentNode=r;let i=B.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let p;a.type===2?p=new Pt(i,i.nextSibling,this,t):a.type===1?p=new a.ctor(i,a.name,a.strings,this,t):a.type===6&&(p=new Lo(i,this,t)),this._$AV.push(p),a=s[++l]}n!==(a==null?void 0:a.index)&&(i=B.nextNode(),n++)}return B.currentNode=V,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Pt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=nt(this,t,e),wt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==it&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Oo(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&wt(this._$AH)?this._$AA.nextSibling.data=t:this.T(V.createTextNode(t)),this._$AH=t}$(t){var i;const{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=xt.createElement(Yr(s.h,s.h[0]),this.options)),s);if(((i=this._$AH)==null?void 0:i._$AD)===r)this._$AH.p(e);else{const n=new Ro(r,this),l=n.u(this.options);n.p(e),this.T(l),this._$AH=n}}_$AC(t){let e=ar.get(t.strings);return e===void 0&&ar.set(t.strings,e=new xt(t)),e}k(t){_e(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const i of t)r===e.length?e.push(s=new Pt(this.O($t()),this.O($t()),this,this.options)):s=e[r],s._$AI(i),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class zt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,i){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=i,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,r){const i=this.strings;let n=!1;if(i===void 0)t=nt(this,t,e,0),n=!wt(t)||t!==this._$AH&&t!==it,n&&(this._$AH=t);else{const l=t;let a,p;for(t=i[0],a=0;a<i.length-1;a++)p=nt(this,l[s+a],e,a),p===it&&(p=this._$AH[a]),n||(n=!wt(p)||p!==this._$AH[a]),p===$?t=$:t!==$&&(t+=(p??"")+i[a+1]),this._$AH[a]=p}n&&!r&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Mo extends zt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class No extends zt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class Uo extends zt{constructor(t,e,s,r,i){super(t,e,s,r,i),this.type=5}_$AI(t,e=this){if((t=nt(this,t,e,0)??$)===it)return;const s=this._$AH,r=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,i=t!==$&&(s===$||r);r&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Lo{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){nt(this,t)}}const ee=vt.litHtmlPolyfillSupport;ee==null||ee(xt,Pt),(vt.litHtmlVersions??(vt.litHtmlVersions=[])).push("3.3.0");const Ho=(o,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const i=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new Pt(t.insertBefore($t(),i),i,void 0,e??{})}return r._$AI(o),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const F=globalThis;class T extends Q{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ho(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return it}}var lr;T._$litElement$=!0,T.finalized=!0,(lr=F.litElementHydrateSupport)==null||lr.call(F,{LitElement:T});const re=F.litElementPolyfillSupport;re==null||re({LitElement:T});(F.litElementVersions??(F.litElementVersions=[])).push("4.2.0");const Do={};function jo(o,t,e){switch(o[0]){case"cattle/load":t(r=>({...r,loading:!0,error:void 0})),Bo(e).then(r=>t(i=>({...i,cattle:r,loading:!1}))).catch(r=>t(i=>({...i,loading:!1,error:r.message})));break;case"cattle/select":zo(o[1].cattleId,e).then(r=>t(i=>({...i,selectedCattle:r}))).catch(r=>t(i=>({...i,error:r.message})));break;case"cattle/create":Fo(o[1].cattle,e).then(r=>{t(n=>({...n,cattle:n.cattle?[...n.cattle,r]:[r]}));const{onSuccess:i}=o[1];i&&i()}).catch(r=>{const{onFailure:i}=o[1];i&&i(r),t(n=>({...n,error:r.message}))});break;case"cattle/save":qo(o[1],e).then(r=>{t(n=>({...n,selectedCattle:r,cattle:n.cattle?n.cattle.map(l=>l.cattleId===r.cattleId?r:l):[r]}));const{onSuccess:i}=o[1];i&&i()}).catch(r=>{const{onFailure:i}=o[1];i&&i(r),t(n=>({...n,error:r.message}))});break;case"worker/load":t(r=>({...r,loading:!0,error:void 0})),Vo(e).then(r=>t(i=>({...i,ranchWorkers:r,loading:!1}))).catch(r=>t(i=>({...i,loading:!1,error:r.message})));break;case"worker/select":Wo(o[1].workerId,e).then(r=>t(i=>({...i,selectedWorker:r}))).catch(r=>t(i=>({...i,error:r.message})));break;case"worker/save":Yo(o[1],e).then(r=>{t(n=>({...n,selectedWorker:r,ranchWorkers:n.ranchWorkers?n.ranchWorkers.map(l=>l.userid===r.userid?r:l):[r]}));const{onSuccess:i}=o[1];i&&i()}).catch(r=>{const{onFailure:i}=o[1];i&&i(r),t(n=>({...n,error:r.message}))});break;default:const s=o[0];throw new Error(`Unhandled message "${s}"`)}}function Bo(o){return fetch("/api/cattle",{headers:M.headers(o)}).then(t=>{if(t.status===200)return t.json();throw new Error(`Failed to load cattle: ${t.statusText}`)}).then(t=>(console.log("Cattle loaded:",t),t))}function zo(o,t){return fetch(`/api/cattle/${o}`,{headers:M.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to load cattle: ${e.statusText}`)}).then(e=>(console.log("Cattle:",e),e))}function Fo(o,t){return fetch("/api/cattle",{method:"POST",headers:{...M.headers(t),"Content-Type":"application/json"},body:JSON.stringify(o)}).then(e=>{if(e.status===201)return e.json();throw new Error(`Failed to create cattle: ${e.statusText}`)}).then(e=>(console.log("Cattle created:",e),e))}function qo(o,t){return fetch(`/api/cattle/${o.cattleId}`,{method:"PUT",headers:{"Content-Type":"application/json",...M.headers(t)},body:JSON.stringify(o.cattle)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to save cattle for ${o.cattleId}`)}).then(e=>{if(e)return e;throw new Error("No data returned from server")})}function Vo(o){return fetch("/ranch_workers",{headers:M.headers(o)}).then(t=>{if(t.status===200)return t.json();throw new Error(`Failed to load workers: ${t.statusText}`)}).then(t=>(console.log("Workers loaded:",t),t))}function Wo(o,t){return fetch(`/ranch_worker/${o}`,{headers:M.headers(t)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to load worker: ${e.statusText}`)}).then(e=>(console.log("Worker:",e),e))}function Yo(o,t){return fetch(`/ranch_worker/${o.workerId}`,{method:"PUT",headers:{"Content-Type":"application/json",...M.headers(t)},body:JSON.stringify(o.worker)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to save worker for ${o.workerId}`)}).then(e=>{if(e)return e;throw new Error("No data returned from server")})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Go={attribute:!0,type:String,converter:Lt,reflect:!1,hasChanged:ye},Jo=(o=Go,t,e)=>{const{kind:s,metadata:r}=e;let i=globalThis.litPropertyMetadata.get(r);if(i===void 0&&globalThis.litPropertyMetadata.set(r,i=new Map),s==="setter"&&((o=Object.create(o)).wrapped=!0),i.set(e.name,o),s==="accessor"){const{name:n}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,o)},init(l){return l!==void 0&&this.C(n,void 0,o,l),l}}}if(s==="setter"){const{name:n}=e;return function(l){const a=this[n];t.call(this,l),this.requestUpdate(n,a,o)}}throw Error("Unsupported decorator location: "+s)};function ct(o){return(t,e)=>typeof e=="object"?Jo(o,t,e):((s,r,i)=>{const n=r.hasOwnProperty(i);return r.constructor.createProperty(i,s),n?Object.getOwnPropertyDescriptor(r,i):void 0})(o,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function w(o){return ct({...o,state:!0,attribute:!1})}var Ko=Object.defineProperty,Gr=(o,t,e,s)=>{for(var r=void 0,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=n(t,e,r)||r);return r&&Ko(t,e,r),r},k;const $e=(k=class extends T{constructor(){super(),this.loggedIn=!1}static initializeOnce(){k._initialized||(k._initialized=!0)}connectedCallback(){super.connectedCallback();const t=localStorage.getItem("token");if(t)try{const e=JSON.parse(atob(t.split(".")[1]));e!=null&&e.username&&(this.loggedIn=!0,this.userid=e.username)}catch(e){console.error("Invalid token:",e),this.loggedIn=!1,this.userid=void 0}else this.loggedIn=!1,this.userid=void 0;this.requestUpdate(),this.setupDarkMode()}setupDarkMode(){const t=localStorage.getItem("darkMode")==="true";document.body.classList.toggle("dark-mode",t),this.updateComplete.then(()=>{var s;const e=(s=this.shadowRoot)==null?void 0:s.querySelector("#darkSwitch");e&&(e.checked=t),this.updateIconOpacity(t)})}updateIconOpacity(t){var r,i;const e=(r=this.shadowRoot)==null?void 0:r.querySelector(".toggle-icon.sun"),s=(i=this.shadowRoot)==null?void 0:i.querySelector(".toggle-icon.moon");e&&s&&(t?(e.style.opacity="0.7",s.style.opacity="1"):(e.style.opacity="1",s.style.opacity="0.7"))}handleDarkModeToggle(t){t.preventDefault();const s=t.target.checked;document.body.classList.toggle("dark-mode",s),localStorage.setItem("darkMode",s.toString()),this.updateIconOpacity(s);const r=new CustomEvent("darkmode:toggle",{bubbles:!0,detail:{isDarkMode:s}});document.body.dispatchEvent(r)}renderSignOutButton(){return u`
      <button
        @click=${()=>{localStorage.removeItem("token"),window.location.href="/login.html"}}
        class="auth-button"
      >
        Sign Out
      </button>
    `}renderSignInButton(){return u` <a href="/login.html" class="auth-button"> Sign In </a> `}render(){return u`
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
    `}},k._initialized=!1,k.styles=N`
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
  `,k);Gr([ct({type:Boolean})],$e.prototype,"loggedIn");Gr([ct()],$e.prototype,"userid");let Jr=$e;customElements.define("ranch-header",Jr);var Zo=Object.defineProperty,Qo=Object.getOwnPropertyDescriptor,Ft=(o,t,e,s)=>{for(var r=s>1?void 0:s?Qo(t,e):t,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Zo(t,e,r),r};const Ee=class Ee extends kt{get cattle(){return this.model.cattle||[]}get loading(){return this.model.loading||!1}get error(){return this.model.error}constructor(){super("ranch:model")}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["cattle/load",{}])}render(){return u`
      ${this.loading?u`<div class="loading">Loading cattle data...</div>`:this.error?u`<div class="error">Error: ${this.error}</div>`:u`
            <div class="cattle-grid">
              ${this.cattle.map(t=>u`
                <div class="cattle-card">
                  <h3>${t.name} (#${t.cattleId})</h3>
                  <p><strong>Breed:</strong> ${t.breed}</p>
                  <p><strong>Gender:</strong> ${t.gender==="male"?"Bull":"Heifer"}</p>
                  ${t.weight?u`<p><strong>Weight:</strong> ${t.weight} lbs</p>`:""}
                  ${t.dateOfBirth?u`<p><strong>DOB:</strong> ${new Date(t.dateOfBirth).toLocaleDateString()}</p>`:""}
                  ${t.healthStatus?u`<p><strong>Health:</strong> ${t.healthStatus}</p>`:""}
                  ${t.location?u`<p><strong>Location:</strong> ${t.location}</p>`:""}
                  <a href="/app/cattle/details/${t.cattleId}" class="detail-link">View Details →</a>
                </div>
              `)}
            </div>
          `}
    `}};Ee.styles=N`
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
      color: var(--color-accent);
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
  `;let I=Ee;Ft([ct()],I.prototype,"src",2);Ft([w()],I.prototype,"cattle",1);Ft([w()],I.prototype,"loading",1);Ft([w()],I.prototype,"error",1);customElements.define("ranch-cattle",I);var Xo=Object.defineProperty,ti=Object.getOwnPropertyDescriptor,qt=(o,t,e,s)=>{for(var r=s>1?void 0:s?ti(t,e):t,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Xo(t,e,r),r};const Dt=class Dt extends kt{get cattle(){return this.model.selectedCattle}get loading(){return this.model.loading||!1}get error(){return this.model.error}constructor(){super("ranch:model")}connectedCallback(){super.connectedCallback(),this.cattleId&&this.dispatchMessage(["cattle/select",{cattleId:this.cattleId}])}render(){var s;if(this.loading)return u`<div class="loading">Loading cattle data...</div>`;if(this.error)return u`
        <div class="error">
          <strong>Error:</strong> ${this.error}
        </div>
      `;const t=!!this.cattle,e=t?`Edit ${(s=this.cattle)==null?void 0:s.name}`:"Add New Cattle";return u`
      <div class="breadcrumb">
        <a href="/app">Home</a> &gt; 
        <a href="/app/cattle">Cattle Management</a> &gt; 
        <a href="/app/cattle/database">Database</a> &gt; 
        <span>${e}</span>
      </div>

      <header>
        <svg class="icon">
          <use href="/icons/ncattle.svg#icon-cattle" />
        </svg>
        <h1>${e}</h1>
        <p>${t?"Update cattle information":"Add a new cattle record to the database"}</p>
      </header>

      <div class="form-container">
        <mu-form
          .init=${this.cattle}
          @mu-form:submit=${this.handleSubmit}>
          
          <div class="form-row">
            <div class="form-group">
              <label>
                <span>Cattle ID *</span>
                <input 
                  name="cattleId" 
                  type="text" 
                  required 
                  ?disabled=${t}
                  placeholder="e.g., C001">
              </label>
            </div>
            
            <div class="form-group">
              <label>
                <span>Name *</span>
                <input 
                  name="name" 
                  type="text" 
                  required
                  placeholder="e.g., Bessie">
              </label>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>
                <span>Breed *</span>
                <input 
                  name="breed" 
                  type="text" 
                  required
                  placeholder="e.g., Holstein">
              </label>
            </div>
            
            <div class="form-group">
              <label>
                <span>Gender *</span>
                <select name="gender" required>
                  <option value="">Select gender</option>
                  <option value="male">Bull</option>
                  <option value="female">Heifer</option>
                </select>
              </label>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>
                <span>Date of Birth</span>
                <input 
                  name="dateOfBirth" 
                  type="date">
              </label>
            </div>
            
            <div class="form-group">
              <label>
                <span>Weight (lbs)</span>
                <input 
                  name="weight" 
                  type="number" 
                  min="0" 
                  step="1"
                  placeholder="e.g., 1200">
              </label>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>
                <span>Health Status</span>
                <select name="healthStatus">
                  <option value="">Select status</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </label>
            </div>
            
            <div class="form-group">
              <label>
                <span>Location</span>
                <input 
                  name="location" 
                  type="text"
                  placeholder="e.g., North Pasture">
              </label>
            </div>
          </div>

          <div class="form-group full-width">
            <label>
              <span>Caretaker ID</span>
              <input 
                name="caretakerId" 
                type="text"
                placeholder="e.g., W001">
            </label>
          </div>

          <div class="actions">
            <button type="submit">
              ${t?"Update Cattle":"Add Cattle"}
            </button>
            <button type="button" class="cancel-button" @click=${this.handleCancel}>
              Cancel
            </button>
          </div>
        </mu-form>
      </div>
    `}handleSubmit(t){const e=t.detail;e.weight&&(e.weight=Number(e.weight)),e.dateOfBirth&&(e.dateOfBirth=new Date(e.dateOfBirth)),this.cattle?this.dispatchMessage(["cattle/save",{cattleId:this.cattle.cattleId,cattle:e,onSuccess:()=>{var s;window.history.pushState({},"",`/app/cattle/details/${(s=this.cattle)==null?void 0:s.cattleId}`),window.dispatchEvent(new PopStateEvent("popstate"))},onFailure:s=>{console.log("ERROR:",s)}}]):this.dispatchMessage(["cattle/create",{cattle:e,onSuccess:()=>{window.history.pushState({},"","/app/cattle/database"),window.dispatchEvent(new PopStateEvent("popstate"))},onFailure:s=>{console.log("ERROR:",s)}}])}handleCancel(){this.cattle?window.history.pushState({},"",`/app/cattle/details/${this.cattle.cattleId}`):window.history.pushState({},"","/app/cattle/database"),window.dispatchEvent(new PopStateEvent("popstate"))}};Dt.uses=zr({"mu-form":vs.Element}),Dt.styles=N`
    :host {
      display: block;
      padding: var(--spacing-lg);
    }

    .form-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: var(--color-background-card);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      padding: var(--spacing-xl);
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

    mu-form {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--spacing-md);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    label {
      font-weight: bold;
      color: var(--color-text);
    }

    input, select, textarea {
      padding: var(--spacing-sm);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      font-family: var(--font-body);
      background-color: var(--color-background-page);
      color: var(--color-text);
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: var(--color-accent);
    }

    button {
      padding: var(--spacing-sm) var(--spacing-lg);
      background-color: var(--color-accent);
      color: var(--color-text-light);
      border: none;
      border-radius: var(--border-radius);
      font-family: var(--font-body);
      font-size: 16px;
      cursor: pointer;
      margin-top: var(--spacing-md);
    }

    button:hover {
      background-color: var(--color-accent-hover);
    }

    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: var(--color-accent);
    }

    .error {
      background-color: #ffebee;
      color: #d32f2f;
      padding: 15px;
      border-radius: var(--border-radius);
      margin: 20px 0;
    }

    .actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: flex-start;
      margin-top: var(--spacing-lg);
    }

    .cancel-button {
      background-color: #6c757d;
    }

    .cancel-button:hover {
      background-color: #5a6268;
    }

    svg.icon {
      display: inline;
      width: 7em;
      height: 7em;
      fill: var(--color-accent-light);
      vertical-align: top;
    }

    .add-button {
      background-color: var(--color-accent);
      color: var(--color-text-light);
      padding: var(--spacing-sm) var(--spacing-lg);
      border-radius: var(--border-radius);
      text-decoration: none;
      font-family: var(--font-body);
      font-weight: bold;
      border: none;
      cursor: pointer;
    }

    .add-button:hover {
      background-color: var(--color-accent-hover);
      text-decoration: none;
    }

    .detail-link {
      color: var(--color-accent);
      text-decoration: none;
      font-weight: bold;
      margin-top: var(--spacing-sm);
      display: inline-block;
    }

    .detail-link:hover {
      text-decoration: underline;
    }
  `;let R=Dt;qt([ct()],R.prototype,"cattleId",2);qt([w()],R.prototype,"cattle",1);qt([w()],R.prototype,"loading",1);qt([w()],R.prototype,"error",1);customElements.define("cattle-edit-form",R);const Ae=class Ae extends T{render(){return u`
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
    `}};Ae.styles=N`
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
  `;let le=Ae;customElements.define("home-view",le);var ei=Object.defineProperty,ri=Object.getOwnPropertyDescriptor,we=(o,t,e,s)=>{for(var r=ri(t,e),i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=n(t,e,r)||r);return r&&ei(t,e,r),r};const Se=class Se extends kt{get cattle(){return this.model.cattle||[]}get loading(){return this.model.loading||!1}get error(){return this.model.error}constructor(){super("ranch:model")}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["cattle/load",{}])}render(){return u`
      <header>
        <svg class="icon">
          <use href="/icons/ncattle.svg#icon-cattle" />
        </svg>
        <h1>Cattle Database</h1>
        <p>View and manage cattle records from the MongoDB database</p>
      </header>

      ${this.error?u`
        <div class="error">
          <strong>Error:</strong> ${this.error}
        </div>
      `:""}

      <section>
        <h2>Cattle Records</h2>
        ${this.loading?u`<div class="loading">Loading cattle data...</div>`:u`
            <div class="cattle-grid">
              ${this.cattle.map(t=>u`
                <div class="cattle-card">
                  <h3>${t.name} (#${t.cattleId})</h3>
                  <p><strong>Breed:</strong> ${t.breed}</p>
                  <p><strong>Gender:</strong> ${t.gender==="male"?"Bull":"Heifer"}</p>
                  ${t.weight?u`<p><strong>Weight:</strong> ${t.weight} lbs</p>`:""}
                  ${t.healthStatus?u`<p><strong>Health:</strong> ${t.healthStatus}</p>`:""}
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
    `}_handleSubmit(t){t.preventDefault();const e=t.target,s=new FormData(e),r={};for(const[i,n]of s.entries())n!==null&&n!==""&&(r[i]=n);r.weight&&(r.weight=Number(r.weight)),r.dateOfBirth&&(r.dateOfBirth=new Date(r.dateOfBirth)),this.dispatchMessage(["cattle/create",{cattle:r}]),e.reset()}};Se.styles=N`
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

    .loading {
      text-align: center;
      padding: 20px;
      color: var(--color-accent);
    }

    .error {
      background-color: #ffebee;
      color: #d32f2f;
      padding: 15px;
      border-radius: var(--border-radius);
      margin: 20px 0;
    }

    svg.icon {
      display: inline;
      width: 7em;
      height: 7em;
      fill: var(--color-accent-light);
      vertical-align: top;
    }
  `;let at=Se;we([w()],at.prototype,"cattle");we([w()],at.prototype,"loading");we([w()],at.prototype,"error");customElements.define("cattle-database-view",at);var si=Object.defineProperty,oi=Object.getOwnPropertyDescriptor,Vt=(o,t,e,s)=>{for(var r=s>1?void 0:s?oi(t,e):t,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&si(t,e,r),r};const ke=class ke extends kt{get cattle(){return this.model.selectedCattle}get loading(){return this.model.loading||!1}get error(){return this.model.error}constructor(){super("ranch:model")}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="cattle-id"&&e!==s&&s&&this.dispatchMessage(["cattle/select",{cattleId:s}])}render(){return this.loading?u`<div class="loading">Loading cattle details...</div>`:this.error?u`
        <div class="error">
          <strong>Error:</strong> ${this.error}
        </div>
      `:this.cattle?u`
      <div class="breadcrumb">
        <a href="/app">Home</a> &gt; 
        <a href="/app/cattle">Cattle Management</a> &gt; 
        <a href="/app/cattle/database">Database</a> &gt; 
        <span>${this.cattle.name}</span>
      </div>

      <header>
        <svg class="icon">
          <use href="/icons/ncow.svg#icon-cow" />
        </svg>
        <h1>${this.cattle.name} (#${this.cattle.cattleId})</h1>
        <p>Detailed information for this ${this.cattle.gender==="male"?"bull":"heifer"}</p>
      </header>

      <div class="cattle-details">
        <div class="detail-card">
          <h3>Basic Information</h3>
          <p><strong>Cattle ID:</strong> ${this.cattle.cattleId}</p>
          <p><strong>Name:</strong> ${this.cattle.name}</p>
          <p><strong>Breed:</strong> ${this.cattle.breed}</p>
          <p><strong>Gender:</strong> ${this.cattle.gender==="male"?"Bull":"Heifer"}</p>
          ${this.cattle.dateOfBirth?u`
            <p><strong>Date of Birth:</strong> ${new Date(this.cattle.dateOfBirth).toLocaleDateString()}</p>
            <p><strong>Age:</strong> ${this.calculateAge(this.cattle.dateOfBirth)} months</p>
          `:""}
        </div>

        <div class="detail-card">
          <h3>Physical Information</h3>
          ${this.cattle.weight?u`
            <p><strong>Weight:</strong> ${this.cattle.weight} lbs</p>
          `:u`<p>Weight not recorded</p>`}
          ${this.cattle.healthStatus?u`
            <p><strong>Health Status:</strong> ${this.cattle.healthStatus}</p>
          `:u`<p>Health status not recorded</p>`}
        </div>

        <div class="detail-card">
          <h3>Location & Care</h3>
          ${this.cattle.location?u`
            <p><strong>Current Location:</strong> ${this.cattle.location}</p>
          `:u`<p>Location not specified</p>`}
          ${this.cattle.caretakerId?u`
            <p><strong>Caretaker ID:</strong> ${this.cattle.caretakerId}</p>
          `:u`<p>No assigned caretaker</p>`}
        </div>

        <div class="detail-card actions-card">
          <h3>Management Actions</h3>
          <p>Available actions for ${this.cattle.name}:</p>
          <div class="action-buttons">
            <a href="/app/cattle/edit/${this.cattle.cattleId}" class="edit-button">
              Edit Cattle Information
            </a>
            <button class="delete-button" @click=${this.handleDelete}>
              Delete Cattle Record
            </button>
          </div>
          <ul style="margin-top: var(--spacing-md);">
            <li>Update health records</li>
            <li>Record weight measurements</li>
            <li>Update location</li>
            <li>Assign caretaker</li>
          </ul>
        </div>
      </div>
    `:u`
        <div class="not-found">
          <h2>Cattle Not Found</h2>
          <p>The cattle with ID "${this.cattleId}" was not found.</p>
          <a href="/app/cattle/database">← Back to Cattle Database</a>
        </div>
      `}calculateAge(t){const e=new Date(t),s=new Date,r=(s.getFullYear()-e.getFullYear())*12+(s.getMonth()-e.getMonth());return Math.max(0,r)}handleDelete(){if(!this.cattle)return;confirm(`Are you sure you want to delete ${this.cattle.name}? This action cannot be undone.`)&&(console.log(`Deleting cattle: ${this.cattle.cattleId}`),window.history.pushState({},"","/app/cattle/database"),window.dispatchEvent(new PopStateEvent("popstate")))}};ke.styles=N`
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

    .cattle-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-lg);
      margin-top: var(--spacing-lg);
    }

    .detail-card {
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      padding: var(--spacing-md);
      background-color: var(--color-background-card);
    }

    .detail-card h3 {
      margin-top: 0;
      color: var(--color-accent-hover);
    }

    .actions-card {
      grid-column: 1 / -1;
    }

    .action-buttons {
      display: flex;
      gap: var(--spacing-md);
      margin-top: var(--spacing-md);
    }

    .edit-button, .delete-button {
      padding: var(--spacing-sm) var(--spacing-lg);
      border: none;
      border-radius: var(--border-radius);
      font-family: var(--font-body);
      font-size: 16px;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      text-align: center;
    }

    .edit-button {
      background-color: var(--color-accent);
      color: var(--color-text-light);
    }

    .edit-button:hover {
      background-color: var(--color-accent-hover);
    }

    .delete-button {
      background-color: #dc3545;
      color: white;
    }

    .delete-button:hover {
      background-color: #c82333;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: var(--color-accent);
    }

    .error {
      background-color: #ffebee;
      color: #d32f2f;
      padding: 15px;
      border-radius: var(--border-radius);
      margin: 20px 0;
    }

    .not-found {
      text-align: center;
      padding: 40px;
      color: var(--color-text);
    }

    svg.icon {
      display: inline;
      width: 7em;
      height: 7em;
      fill: var(--color-accent-light);
      vertical-align: top;
    }
  `;let W=ke;Vt([ct({attribute:"cattle-id"})],W.prototype,"cattleId",2);Vt([w()],W.prototype,"cattle",1);Vt([w()],W.prototype,"loading",1);Vt([w()],W.prototype,"error",1);customElements.define("cattle-detail-view",W);var ii=Object.defineProperty,xe=(o,t,e,s)=>{for(var r=void 0,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=n(t,e,r)||r);return r&&ii(t,e,r),r};const Pe=class Pe extends T{constructor(){super(...arguments),this.people=[],this.loading=!0,this.activeTab="all"}connectedCallback(){super.connectedCallback(),this.loadPeople()}async loadPeople(){try{const t=await fetch("/data/ranchPeople.json");t.ok&&(this.people=await t.json())}catch(t){console.error("Error loading people:",t)}finally{this.loading=!1}}render(){const t=this.getFilteredPeople();return u`
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
      
      ${this.loading?u`<p>Loading personnel...</p>`:u`
          <div class="person-list">
            ${t.map(e=>u`
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
    `}getFilteredPeople(){return this.activeTab==="all"?this.people:this.people.filter(t=>{switch(this.activeTab){case"farmhands":return t.role.toLowerCase().includes("farmhand");case"veterinarians":return t.role.toLowerCase().includes("veterinarian");case"contractors":return t.role.toLowerCase().includes("contractor");default:return!0}})}};Pe.styles=N`
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
  `;let lt=Pe;xe([w()],lt.prototype,"people");xe([w()],lt.prototype,"loading");xe([w()],lt.prototype,"activeTab");customElements.define("people-management-view",lt);var ni=Object.defineProperty,Kr=(o,t,e,s)=>{for(var r=void 0,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=n(t,e,r)||r);return r&&ni(t,e,r),r};const Ce=class Ce extends T{constructor(){super(...arguments),this.activeTab="herds",this.stats={totalCattle:440,herds:4,bulls:8,calves:26}}render(){return u`
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
    `}renderHerds(){return u`
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
    `}renderIndividualCattle(){return u`
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
    `}};Ce.styles=N`
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
  `;let Et=Ce;Kr([w()],Et.prototype,"activeTab");Kr([w()],Et.prototype,"stats");customElements.define("cattle-management-view",Et);const ai=[{path:"/app/cattle/database",view:()=>u`
      <cattle-database-view></cattle-database-view>
    `},{path:"/app/cattle/herds/:herdId",view:o=>u`
      <herd-detail-view herd-id=${o.herdId}></herd-detail-view>
    `},{path:"/app/cattle/details/:cattleId",view:o=>u`
      <cattle-detail-view cattle-id=${o.cattleId}></cattle-detail-view>
    `},{path:"/app/cattle",view:()=>u`
      <cattle-management-view></cattle-management-view>
    `},{path:"/app/people/farmhands/:farmhandId",view:o=>u`
      <farmhand-detail-view farmhand-id=${o.farmhandId}></farmhand-detail-view>
    `},{path:"/app/people",view:()=>u`
      <people-management-view></people-management-view>
    `},{path:"/app/operators/:operatorId",view:o=>u`
      <operator-detail-view operator-id=${o.operatorId}></operator-detail-view>
    `},{path:"/app",view:()=>u`
      <home-view></home-view>
    `},{path:"/",redirect:"/app"}];zr({"ranch-auth":M.Provider,"ranch-history":$s.Provider,"ranch-header":Jr,"ranch-cattle":I,"cattle-edit-form":R,"ranch-store":class extends Es.Provider{constructor(){super(jo,Do,"ranch:auth")}},"ranch-switch":class extends go.Element{constructor(){super(ai,"ranch:history","ranch:auth")}}});window.addEventListener("DOMContentLoaded",()=>{const o=document.querySelector("ranch-auth");o&&o.addEventListener("auth:message",t=>{const[e,s]=t.detail;switch(e){case"auth/signin":s.token&&(localStorage.setItem("token",s.token),s.redirect&&(window.location.href=s.redirect));break;case"auth/signout":localStorage.removeItem("token"),window.location.href="/login.html";break}})});
