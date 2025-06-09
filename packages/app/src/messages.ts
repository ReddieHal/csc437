import { Cattle, RanchWorker } from "server/models";

export type Msg =
  | ["cattle/load", {}]
  | ["cattle/select", { cattleId: string }]
  | ["cattle/create", { 
      cattle: Cattle;
      onSuccess?: () => void;
      onFailure?: (err: Error) => void;
    }]
  | ["cattle/save", {
      cattleId: string;
      cattle: Cattle;
      onSuccess?: () => void;
      onFailure?: (err: Error) => void;
    }]
  | ["worker/load", {}]
  | ["worker/select", { workerId: string }]
  | ["worker/save", {
      workerId: string;
      worker: RanchWorker;
      onSuccess?: () => void;
      onFailure?: (err: Error) => void;
    }];