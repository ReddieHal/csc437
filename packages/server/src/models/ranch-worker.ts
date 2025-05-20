import mongoose, { Document, Schema } from 'mongoose';

// Interface for RanchWorker
export interface IRanchWorker {
  userid: string;
  ranchid: string;
  name: string;
  role: string;
  experience: string | undefined;
  image: string | undefined;
}

// Interface for the Document with MongoDB methods
interface RanchWorkerDocument extends IRanchWorker, Document {}

// Create the Schema
const ranchWorkerSchema = new Schema<RanchWorkerDocument>({
  userid: { type: String, required: true, unique: true },
  ranchid: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  experience: { type: String, required: false },
  image: { type: String, required: false }
});

// Create and export the model
export default mongoose.model<RanchWorkerDocument>('ranch_worker', ranchWorkerSchema);