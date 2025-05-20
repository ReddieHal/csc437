import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import {RanchWorker} from "./services/ranch-worker-svc";


// Connect to MongoDB
connect("ranchup");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
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