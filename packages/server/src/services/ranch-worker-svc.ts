import mongoose, { Schema, model } from "mongoose";
import RanchWorkerModel, { IRanchWorker } from "../models/ranch-worker";

export class RanchWorker {

  static async get(userid: string): Promise<IRanchWorker | null> {
    console.error("userid", userid);
    try {
      const worker = await RanchWorkerModel.findOne({ userid }).lean();
      return worker;
    } catch (error) {
      console.error('Error retrieving ranch worker:', error);
      return null;
    }
  }


  static async getAll(): Promise<IRanchWorker[] | null> {
    try {
      const workers = await RanchWorkerModel.find().lean();
      return workers;
    } catch (error) {
      console.error('Error retrieving all ranch workers:', error);
      return null;
    }
  }

  static async create(worker: IRanchWorker): Promise<IRanchWorker | null> {
    try {
      const newWorker = await RanchWorkerModel.create(worker);
      return newWorker.toObject();
    } catch (error) {
      console.error('Error creating ranch worker:', error);
      return null;
    }
  }

  static async update(userid: string, updates: Partial<IRanchWorker>): Promise<IRanchWorker | null> {
    try {
      const updatedWorker = await RanchWorkerModel.findOneAndUpdate(
        { userid },
        updates,
        { new: true }
      ).lean();
      return updatedWorker;
    } catch (error) {
      console.error('Error updating ranch worker:', error);
      return null;
    }
  }


  static async delete(userid: string): Promise<boolean> {
    try {
      const result = await RanchWorkerModel.deleteOne({ userid });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting ranch worker:', error);
      return false;
    }
  }
}