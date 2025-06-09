import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { Cattle, RanchWorker } from "server/models";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "cattle/load":
      apply((model) => ({ ...model, loading: true, error: undefined }));
      loadCattle(user)
        .then((cattle) =>
          apply((model) => ({ ...model, cattle, loading: false }))
        )
        .catch((error) =>
          apply((model) => ({ 
            ...model, 
            loading: false, 
            error: error.message 
          }))
        );
      break;

    case "cattle/select":
      loadCattleById(message[1].cattleId, user)
        .then((cattle) =>
          apply((model) => ({ ...model, selectedCattle: cattle }))
        )
        .catch((error) =>
          apply((model) => ({ ...model, error: error.message }))
        );
      break;

    case "cattle/create":
      createCattle(message[1].cattle, user)
        .then((cattle) => {
          apply((model) => ({
            ...model,
            cattle: model.cattle ? [...model.cattle, cattle] : [cattle]
          }));
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
          apply((model) => ({ ...model, error: error.message }));
        });
      break;

    case "cattle/save":
      saveCattle(message[1], user)
        .then((cattle) => {
          apply((model) => ({
            ...model,
            selectedCattle: cattle,
            cattle: model.cattle 
              ? model.cattle.map(c => c.cattleId === cattle.cattleId ? cattle : c)
              : [cattle]
          }));
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
          apply((model) => ({ ...model, error: error.message }));
        });
      break;

    case "worker/load":
      apply((model) => ({ ...model, loading: true, error: undefined }));
      loadWorkers(user)
        .then((workers) =>
          apply((model) => ({ ...model, ranchWorkers: workers, loading: false }))
        )
        .catch((error) =>
          apply((model) => ({ 
            ...model, 
            loading: false, 
            error: error.message 
          }))
        );
      break;

    case "worker/select":
      loadWorkerById(message[1].workerId, user)
        .then((worker) =>
          apply((model) => ({ ...model, selectedWorker: worker }))
        )
        .catch((error) =>
          apply((model) => ({ ...model, error: error.message }))
        );
      break;

    case "worker/save":
      saveWorker(message[1], user)
        .then((worker) => {
          apply((model) => ({
            ...model,
            selectedWorker: worker,
            ranchWorkers: model.ranchWorkers
              ? model.ranchWorkers.map(w => w.userid === worker.userid ? worker : w)
              : [worker]
          }));
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
          apply((model) => ({ ...model, error: error.message }));
        });
      break;

    default:
      const unhandled: never = message[0];
      throw new Error(`Unhandled message "${unhandled}"`);
  }
}

function loadCattle(user: Auth.User): Promise<Cattle[]> {
  return fetch("/api/cattle", {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error(`Failed to load cattle: ${response.statusText}`);
    })
    .then((json: unknown) => {
      console.log("Cattle loaded:", json);
      return json as Cattle[];
    });
}

function loadCattleById(cattleId: string, user: Auth.User): Promise<Cattle> {
  return fetch(`/api/cattle/${cattleId}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error(`Failed to load cattle: ${response.statusText}`);
    })
    .then((json: unknown) => {
      console.log("Cattle:", json);
      return json as Cattle;
    });
}

function createCattle(cattle: Cattle, user: Auth.User): Promise<Cattle> {
  return fetch("/api/cattle", {
    method: "POST",
    headers: {
      ...Auth.headers(user),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(cattle)
  })
    .then((response: Response) => {
      if (response.status === 201) {
        return response.json();
      }
      throw new Error(`Failed to create cattle: ${response.statusText}`);
    })
    .then((json: unknown) => {
      console.log("Cattle created:", json);
      return json as Cattle;
    });
}

function saveCattle(
  msg: {
    cattleId: string;
    cattle: Cattle;
  },
  user: Auth.User
): Promise<Cattle> {
  return fetch(`/api/cattle/${msg.cattleId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(msg.cattle)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error(
          `Failed to save cattle for ${msg.cattleId}`
        );
      }
    })
    .then((json: unknown) => {
      if (json) return json as Cattle;
      throw new Error("No data returned from server");
    });
}

function loadWorkers(user: Auth.User): Promise<RanchWorker[]> {
  return fetch("/ranch_workers", {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error(`Failed to load workers: ${response.statusText}`);
    })
    .then((json: unknown) => {
      console.log("Workers loaded:", json);
      return json as RanchWorker[];
    });
}

function loadWorkerById(workerId: string, user: Auth.User): Promise<RanchWorker> {
  return fetch(`/ranch_worker/${workerId}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error(`Failed to load worker: ${response.statusText}`);
    })
    .then((json: unknown) => {
      console.log("Worker:", json);
      return json as RanchWorker;
    });
}

function saveWorker(
  msg: {
    workerId: string;
    worker: RanchWorker;
  },
  user: Auth.User
): Promise<RanchWorker> {
  return fetch(`/ranch_worker/${msg.workerId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(msg.worker)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error(
          `Failed to save worker for ${msg.workerId}`
        );
      }
    })
    .then((json: unknown) => {
      if (json) return json as RanchWorker;
      throw new Error("No data returned from server");
    });
}