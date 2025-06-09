import {
  Auth,
  define,
  History,
  Switch,
  Store
} from "@calpoly/mustang";
import { html } from "lit";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";

// Import components
import { HeaderElement } from "./components/ranch-header";
import { RanchCattle } from "./components/ranch-cattle";
import { CattleEditFormElement } from "./components/cattle-edit-form";

// Import views
import "./views/home-view";
import "./views/cattle-database-view";
import "./views/cattle-detail-view";
import "./views/people-management-view";
import "./views/cattle-management-view";

// Define routes - all app routes start with /app/
const routes = [
  {
    path: "/app/cattle/database",
    view: () => html`
      <cattle-database-view></cattle-database-view>
    `
  },
  {
    path: "/app/cattle/herds/:herdId",
    view: (params: Switch.Params) => html`
      <herd-detail-view herd-id=${params.herdId}></herd-detail-view>
    `
  },
  {
    path: "/app/cattle/details/:cattleId",
    view: (params: Switch.Params) => html`
      <cattle-detail-view cattle-id=${params.cattleId}></cattle-detail-view>
    `
  },
  {
    path: "/app/cattle",
    view: () => html`
      <cattle-management-view></cattle-management-view>
    `
  },
  {
    path: "/app/people/farmhands/:farmhandId",
    view: (params: Switch.Params) => html`
      <farmhand-detail-view farmhand-id=${params.farmhandId}></farmhand-detail-view>
    `
  },
  {
    path: "/app/people",
    view: () => html`
      <people-management-view></people-management-view>
    `
  },
  {
    path: "/app/operators/:operatorId",
    view: (params: Switch.Params) => html`
      <operator-detail-view operator-id=${params.operatorId}></operator-detail-view>
    `
  },
  {
    path: "/app",
    view: () => html`
      <home-view></home-view>
    `
  },
  {
    path: "/",
    redirect: "/app"
  }
];

define({
  "ranch-auth": Auth.Provider,
  "ranch-history": History.Provider,
  "ranch-header": HeaderElement,
  "ranch-cattle": RanchCattle,
  "cattle-edit-form": CattleEditFormElement,
  "ranch-store": class AppStore extends Store.Provider<Model, Msg> {
    constructor() {
      super(update, init, "ranch:auth");
    }
  },
  "ranch-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "ranch:history", "ranch:auth");
    }
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const authProvider = document.querySelector('ranch-auth');
  if (authProvider) {
    authProvider.addEventListener('auth:message', (event: any) => {
      const [command, data] = event.detail;
      
      switch (command) {
        case 'auth/signin':
          if (data.token) {
            localStorage.setItem('token', data.token);
            if (data.redirect) {
              window.location.href = data.redirect;
            }
          }
          break;
        case 'auth/signout':
          localStorage.removeItem('token');
          window.location.href = '/login.html';
          break;
      }
    });
  }
});