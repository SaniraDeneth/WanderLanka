import { Destination } from "../models/Destination";
import { Plan } from "../models/Plan";
import { dbService } from "./dbService";
import { Logger } from "../utils/logger";

export const planService = {
  //Retrieves all travel plans from the SQLite database.
  async fetchPlans(): Promise<Plan[]> {
    try {
      const db = await dbService.getDb();
      const rows = await db.getAllAsync<any>("SELECT * FROM plans;");
      return rows.map((row) => ({
        id: row.id,
        title: row.title,
        overview: row.overview,
        duration: row.duration,
        rating: row.rating,
        imageUri: row.image_uri,
        isFavorite: row.is_favorite === 1,
        budget: row.budget,
      }));
    } catch (error) {
      Logger.error("Error fetching plans from SQLite:", error);
      return [];
    }
  },

  //Retrieves full details of a plan including its ordered list of destinations.
  async fetchPlanDetails(planId: number): Promise<Plan | null> {
    try {
      const db = await dbService.getDb();

      // 1. Fetch the high-level plan details
      const planRow = await db.getFirstAsync<any>(
        "SELECT * FROM plans WHERE id = ?;",
        planId
      );

      if (!planRow) {
        return null;
      }

      // 2. Fetch all associated destinations joined via plan_destinations, ordered by day and sequence
      const destRows = await db.getAllAsync<any>(
        `SELECT d.*, pd.day_number, pd.sequence_order 
         FROM plan_destinations pd
         JOIN destinations d ON pd.destination_id = d.id
         WHERE pd.plan_id = ?
         ORDER BY pd.day_number ASC, pd.sequence_order ASC;`,
        planId
      );

      const destinations: Destination[] = destRows.map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        categoryId: row.category_id,
        vibeTag: row.vibe_tag,
        latitude: row.latitude,
        longitude: row.longitude,
        imageUri: row.image_uri,
        rating: row.rating,
        entryFee: row.entry_fee,
        isFavorite: row.is_favorite === 1,
        dayNumber: row.day_number,
      }));

      return {
        id: planRow.id,
        title: planRow.title,
        overview: planRow.overview,
        duration: planRow.duration,
        rating: planRow.rating,
        imageUri: planRow.image_uri,
        isFavorite: planRow.is_favorite === 1,
        budget: planRow.budget,
        destinations,
      };
    } catch (error) {
      Logger.error(`Error fetching details for plan ID ${planId}:`, error);
      return null;
    }
  },

  //Updates the bookmark (is_favorite) status of a specific itinerary plan.
  async toggleFavorite(id: number, isFavorite: boolean): Promise<boolean> {
    try {
      const db = await dbService.getDb();
      const favoriteValue = isFavorite ? 1 : 0;
      await db.runAsync(
        "UPDATE plans SET is_favorite = ? WHERE id = ?;",
        favoriteValue,
        id
      );
      return true;
    } catch (error) {
      Logger.error(`Error toggling plan favorite status in SQLite for id ${id}:`, error);
      return false;
    }
  }
};
