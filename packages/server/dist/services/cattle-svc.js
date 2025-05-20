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
var cattle_svc_exports = {};
__export(cattle_svc_exports, {
  Cattle: () => Cattle
});
module.exports = __toCommonJS(cattle_svc_exports);
var import_cattle = __toESM(require("../models/cattle"));
class Cattle {
  static async get(cattleId) {
    try {
      const cattle = await import_cattle.default.findOne({ cattleId }).lean();
      return cattle;
    } catch (error) {
      console.error("Error retrieving cattle:", error);
      return null;
    }
  }
  static async getAll() {
    try {
      const allCattle = await import_cattle.default.find().lean();
      return allCattle;
    } catch (error) {
      console.error("Error retrieving all cattle:", error);
      return null;
    }
  }
  static async create(cattle) {
    try {
      if (!cattle.cattleId || !cattle.name || !cattle.breed || !cattle.gender) {
        console.error(
          "Missing required field(s):",
          !cattle.cattleId ? "cattleId" : "",
          !cattle.name ? "name" : "",
          !cattle.breed ? "breed" : "",
          !cattle.gender ? "gender" : ""
        );
        throw new Error("Missing required fields. Please provide cattleId, name, breed, and gender.");
      }
      const newCattle = await import_cattle.default.create(cattle);
      return newCattle.toObject();
    } catch (error) {
      console.error("Error creating cattle:", error);
      return null;
    }
  }
  static async update(cattleId, updates) {
    try {
      const updatedCattle = await import_cattle.default.findOneAndUpdate(
        { cattleId },
        updates,
        { new: true }
      ).lean();
      return updatedCattle;
    } catch (error) {
      console.error("Error updating cattle:", error);
      return null;
    }
  }
  static async delete(cattleId) {
    try {
      const result = await import_cattle.default.deleteOne({ cattleId });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting cattle:", error);
      return false;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Cattle
});
