"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var models_exports = {};
__export(models_exports, {
  Cattle: () => import_cattle.ICattle,
  Credential: () => import_credentials.Credential,
  RanchWorker: () => import_ranch_worker.IRanchWorker
});
module.exports = __toCommonJS(models_exports);
var import_cattle = require("./cattle");
var import_ranch_worker = require("./ranch-worker");
var import_credentials = require("./credentials");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Cattle,
  Credential,
  RanchWorker
});
