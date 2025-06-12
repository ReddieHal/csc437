import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import {RanchWorker} from "./services/ranch-worker-svc";
import { Cattle } from "./services/cattle-svc";
import fs from "node:fs/promises";
import path from "path";

import auth, {authenticateUser } from "./routes/auth";


// Connect to MongoDB
connect("ranchup");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));
app.use(express.json());

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.use("/app", (req: Request, res: Response) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  fs.readFile(indexHtml, { encoding: "utf8" }).then((html) =>
    res.send(html)
  );
});

app.use("/login.html", (req: Request, res: Response) => {
  const loginHtml = path.resolve(staticDir, "login.html");
  fs.readFile(loginHtml, { encoding: "utf8" }).then((html) =>
    res.send(html)
  );
});

app.get("/ranch_worker/:userid", (req: Request, res: Response) => {
  const { userid } = req.params;
  console.log("userid", userid);
  RanchWorker.get(userid).then((data) => {
    if (data) res
      .set("Content-Type", "application/json")
      .send(JSON.stringify(data));
    else res
      .status(404).send();
  });
});

app.get("/ranch_workers", (req: Request, res: Response) => {
  RanchWorker.getAll().then((data) => {
    if (data) res
      .set("Content-Type", "application/json")
      .send(JSON.stringify(data));
    else res
      .status(404).send();
  });
});

app.post("/ranch_worker", express.json(), (req: Request, res: Response) => {
  RanchWorker.create(req.body).then((data) => {
    if (data) res
      .status(201)
      .set("Content-Type", "application/json")
      .send(JSON.stringify(data));
    else res
      .status(400).send();
  });
});

app.put("/ranch_worker/:userid", express.json(), (req: Request, res: Response) => {
  const { userid } = req.params;
  RanchWorker.update(userid, req.body).then((data) => {
    if (data) res
      .set("Content-Type", "application/json")
      .send(JSON.stringify(data));
    else res
      .status(404).send();
  });
});

app.delete("/ranch_worker/:userid", (req: Request, res: Response) => {
  const { userid } = req.params;
  RanchWorker.delete(userid).then((success) => {
    if (success) res.status(204).send();
    else res.status(404).send();
  });
});

app.use("/auth", auth);

// Cattle endpoints
app.get("/api/cattle/:cattleId", (req: Request, res: Response) => {
  const { cattleId } = req.params;
  Cattle.get(cattleId).then((data) => {
    if (data) res
      .set("Content-Type", "application/json")
      .send(JSON.stringify(data));
    else res
      .status(404).send();
  });
});

app.get("/api/cattle", (req, res) => {
  const q = req.query;          // gender, dateOfBirth[gte], etc.
  const mongo: Record<string, unknown> = {};

  if (q.gender === 'male' || q.gender === 'female') {
    mongo.gender = q.gender;
  }

  if (q['dateOfBirth[gte]']) {
    mongo.dateOfBirth = { $gte: new Date(q['dateOfBirth[gte]'] as string) };
  }

  Cattle.list(mongo).then(data => {
    if (data) res.json(data);
    else      res.status(404).send();
  });
});

app.post("/api/cattle", (req: Request, res: Response) => {
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
  
  Cattle.create(req.body).then((data) => {
    if (data) res
      .status(201)
      .set("Content-Type", "application/json")
      .send(JSON.stringify(data));
    else res
      .status(400)
      .json({ message: "Failed to create cattle record. Check your data and try again." });
  }).catch((error) => {
    console.error("Error in /cattle POST endpoint:", error);
    res.status(500).json({ 
      message: "Server error while creating cattle record",
      error: error.message
    });
  });
});

app.put("/api/cattle/:cattleId", (req: Request, res: Response) => {
  const { cattleId } = req.params;
  Cattle.update(cattleId, req.body).then((data) => {
    if (data) res
      .set("Content-Type", "application/json")
      .send(JSON.stringify(data));
    else res
      .status(404).send();
  });
});

app.delete("/api/cattle/:cattleId", (req: Request, res: Response) => {
  const { cattleId } = req.params;
  Cattle.delete(cattleId).then((success) => {
    if (success) res.status(204).send();
    else res.status(404).send();
  });
});


