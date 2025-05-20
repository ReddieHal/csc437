"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_express = __toESM(require("express"));
var import_mongo = require("./services/mongo");
var import_ranch_worker_svc = require("./services/ranch-worker-svc");
var import_cattle_svc = require("./services/cattle-svc");
(0, import_mongo.connect)("ranchup");
const app = (0, import_express.default)();
const port = process.env.PORT || 3e3;
const staticDir = process.env.STATIC || "public";
app.use(import_express.default.static(staticDir));
app.use(import_express.default.json());
app.get("/hello", (req, res) => {
  res.send("Hello, World");
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
app.get("/ranch_worker/:userid", (req, res) => {
  const { userid } = req.params;
  console.log("userid", userid);
  import_ranch_worker_svc.RanchWorker.get(userid).then((data) => {
    if (data) res.set("Content-Type", "application/json").send(JSON.stringify(data));
    else res.status(404).send();
  });
});
app.get("/ranch_workers", (req, res) => {
  import_ranch_worker_svc.RanchWorker.getAll().then((data) => {
    if (data) res.set("Content-Type", "application/json").send(JSON.stringify(data));
    else res.status(404).send();
  });
});
app.post("/ranch_worker", import_express.default.json(), (req, res) => {
  import_ranch_worker_svc.RanchWorker.create(req.body).then((data) => {
    if (data) res.status(201).set("Content-Type", "application/json").send(JSON.stringify(data));
    else res.status(400).send();
  });
});
app.put("/ranch_worker/:userid", import_express.default.json(), (req, res) => {
  const { userid } = req.params;
  import_ranch_worker_svc.RanchWorker.update(userid, req.body).then((data) => {
    if (data) res.set("Content-Type", "application/json").send(JSON.stringify(data));
    else res.status(404).send();
  });
});
app.delete("/ranch_worker/:userid", (req, res) => {
  const { userid } = req.params;
  import_ranch_worker_svc.RanchWorker.delete(userid).then((success) => {
    if (success) res.status(204).send();
    else res.status(404).send();
  });
});
app.get("/cattle/:cattleId", (req, res) => {
  const { cattleId } = req.params;
  import_cattle_svc.Cattle.get(cattleId).then((data) => {
    if (data) res.set("Content-Type", "application/json").send(JSON.stringify(data));
    else res.status(404).send();
  });
});
app.get("/cattle", (req, res) => {
  import_cattle_svc.Cattle.getAll().then((data) => {
    if (data) res.set("Content-Type", "application/json").send(JSON.stringify(data));
    else res.status(404).send();
  });
});
app.post("/cattle", (req, res) => {
  console.log("Received cattle data:", req.body);
  const { cattleId, name, breed, gender } = req.body;
  if (!cattleId || !name || !breed || !gender) {
    return res.status(400).json({
      message: "Missing required fields",
      requiredFields: { cattleId, name, breed, gender },
      missingFields: [
        !cattleId ? "cattleId" : null,
        !name ? "name" : null,
        !breed ? "breed" : null,
        !gender ? "gender" : null
      ].filter(Boolean)
    });
  }
  import_cattle_svc.Cattle.create(req.body).then((data) => {
    if (data) res.status(201).set("Content-Type", "application/json").send(JSON.stringify(data));
    else res.status(400).json({ message: "Failed to create cattle record. Check your data and try again." });
  }).catch((error) => {
    console.error("Error in /cattle POST endpoint:", error);
    res.status(500).json({
      message: "Server error while creating cattle record",
      error: error.message
    });
  });
});
app.put("/cattle/:cattleId", (req, res) => {
  const { cattleId } = req.params;
  import_cattle_svc.Cattle.update(cattleId, req.body).then((data) => {
    if (data) res.set("Content-Type", "application/json").send(JSON.stringify(data));
    else res.status(404).send();
  });
});
app.delete("/cattle/:cattleId", (req, res) => {
  const { cattleId } = req.params;
  import_cattle_svc.Cattle.delete(cattleId).then((success) => {
    if (success) res.status(204).send();
    else res.status(404).send();
  });
});
