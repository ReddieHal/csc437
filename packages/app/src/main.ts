import {
  Auth,
  define,
  History,
  Switch
} from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { HeaderElement } from "./components/ranch-header";
import { HomeViewElement } from "./views/home-view";
import { CattleViewElement } from "./views/cattle-view";
import { CattleDbViewElement } from "./views/cattle-db-view";
import { PeopleViewElement } from "./views/people-view";

const routes = [
  {
    path: "/app/cattle/database",
    view: () => html`
      <cattle-db-view></cattle-db-view>
    `
  },
  {
    path: "/app/cattle",
    view: () => html`
      <cattle-view></cattle-view>
    `
  },
  {
    path: "/app/people",
    view: () => html`
      <people-view></people-view>
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
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "ranch-header": HeaderElement,
  "home-view": HomeViewElement,
  "cattle-view": CattleViewElement,
  "cattle-db-view": CattleDbViewElement,
  "people-view": PeopleViewElement,
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "ranch:history", "ranch:auth");
    }
  }
});