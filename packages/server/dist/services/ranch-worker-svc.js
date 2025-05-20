"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var ranch_worker_svc_exports = {};
__export(ranch_worker_svc_exports, {
  RanchWorker: () => RanchWorker
});
module.exports = __toCommonJS(ranch_worker_svc_exports);
var import_ranch_worker = __toESM(require("../models/ranch-worker"));
class RanchWorker {
  static async get(userid) {
    console.error("userid", userid);
    try {
      const worker = await import_ranch_worker.default.findOne({ userid }).lean();
      return worker;
    } catch (error) {
      console.error("Error retrieving ranch worker:", error);
      return null;
    }
  }
  static async getAll() {
    try {
      const workers = await import_ranch_worker.default.find().lean();
      return workers;
    } catch (error) {
      console.error("Error retrieving all ranch workers:", error);
      return null;
    }
  }
  static async create(worker) {
    try {
      const newWorker = await import_ranch_worker.default.create(worker);
      return newWorker.toObject();
    } catch (error) {
      console.error("Error creating ranch worker:", error);
      return null;
    }
  }
  static async update(userid, updates) {
    try {
      const updatedWorker = await import_ranch_worker.default.findOneAndUpdate(
        { userid },
        updates,
        { new: true }
      ).lean();
      return updatedWorker;
    } catch (error) {
      console.error("Error updating ranch worker:", error);
      return null;
    }
  }
  static async delete(userid) {
    try {
      const result = await import_ranch_worker.default.deleteOne({ userid });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting ranch worker:", error);
      return false;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RanchWorker
});
