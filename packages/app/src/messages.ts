import { Cattle, RanchWorker } from "server/models";

export type Msg =
  | ["cattle/load", {}]
  | ["cattle/loaded", { cattle: Cattle[] }]
  | ["cattle/select", { cattleId: string }]
  | ["cattle/selected", { cattle: Cattle }]
  | ["cattle/create", { cattle: Cattle }]
  | ["cattle/created", { cattle: Cattle }]
  | ["worker/load", {}]
  | ["worker/loaded", { workers: RanchWorker[] }]
  | ["worker/select", { workerId: string }]
  | ["worker/selected", { worker: RanchWorker }]
  | ["error", { message: string }]
  | ["loading", { isLoading: boolean }];