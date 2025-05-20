import mongoose, { Document, Schema } from 'mongoose';

export interface ICattle {
  cattleId: string;
  name: string;
  breed: string;
  dateOfBirth?: Date;
  weight?: number;
  gender: 'male' | 'female';
  healthStatus?: string;
  location?: string;
  caretakerId?: string;
}

interface CattleDocument extends ICattle, Document {}

const cattleSchema = new Schema<CattleDocument>({
  cattleId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  breed: { type: String, required: true },
  dateOfBirth: { type: Date },
  weight: { type: Number },
  gender: { type: String, enum: ['male', 'female'], required: true },
  healthStatus: { type: String },
  location: { type: String },
  caretakerId: { type: String }
});

export default mongoose.model<CattleDocument>('cattle', cattleSchema);