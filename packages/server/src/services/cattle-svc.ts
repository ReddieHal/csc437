import CattleModel, { ICattle } from "../models/cattle";

export class Cattle {
  static async get(cattleId: string): Promise<ICattle | null> {
    try {
      const cattle = await CattleModel.findOne({ cattleId }).lean();
      return cattle;
    } catch (error) {
      console.error('Error retrieving cattle:', error);
      return null;
    }
  }

  static async getAll(): Promise<ICattle[] | null> {
    try {
      const allCattle = await CattleModel.find().lean();
      return allCattle;
    } catch (error) {
      console.error('Error retrieving all cattle:', error);
      return null;
    }
  }

  static async create(cattle: ICattle): Promise<ICattle | null> {
    try {
      // Validate required fields
      if (!cattle.cattleId || !cattle.name || !cattle.breed || !cattle.gender) {
        console.error('Missing required field(s):', 
          !cattle.cattleId ? 'cattleId' : '',
          !cattle.name ? 'name' : '',
          !cattle.breed ? 'breed' : '',
          !cattle.gender ? 'gender' : ''
        );
        throw new Error('Missing required fields. Please provide cattleId, name, breed, and gender.');
      }
      
      const newCattle = await CattleModel.create(cattle);
      return newCattle.toObject();
    } catch (error) {
      console.error('Error creating cattle:', error);
      return null;
    }
  }

  static async update(cattleId: string, updates: Partial<ICattle>): Promise<ICattle | null> {
    try {
      const updatedCattle = await CattleModel.findOneAndUpdate(
        { cattleId },
        updates,
        { new: true }
      ).lean();
      return updatedCattle;
    } catch (error) {
      console.error('Error updating cattle:', error);
      return null;
    }
  }

  static async delete(cattleId: string): Promise<boolean> {
    try {
      const result = await CattleModel.deleteOne({ cattleId });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting cattle:', error);
      return false;
    }
  }
}