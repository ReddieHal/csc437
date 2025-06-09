import { Cattle, RanchWorker } from "server/models";

export interface Model {
  cattle?: Cattle[];
  selectedCattle?: Cattle;
  ranchWorkers?: RanchWorker[];
  selectedWorker?: RanchWorker;
  loading?: boolean;
  error?: string;
}

export const init: Model = {};