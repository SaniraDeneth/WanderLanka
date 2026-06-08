import { dbService } from "./dbService";
import { Destination } from "../models/Destination";
import { Category } from "../models/Category";

export const destinationService = {
//Retrieves all destinations from the SQLite database.
  async fetchDestinations(): Promise<Destination[]> {
    try {
      const db = await dbService.getDb();
      const rows = await db.getAllAsync<any>("SELECT * FROM destinations;");
      return rows.map((row) => ({
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
      }));
    } catch (error) {
      console.error("Error fetching destinations from SQLite:", error);
      return [];
    }
  },

  //Retrieves all categories from the SQLite database.
  async fetchCategories(): Promise<Category[]> {
    try {
      const db = await dbService.getDb();
      const rows = await db.getAllAsync<any>("SELECT * FROM categories;");
      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        imageUri: row.image_uri,
      }));
    } catch (error) {
      console.error("Error fetching categories from SQLite:", error);
      return [];
    }
  },

  //Updates the bookmark (is_favorite) status of a specific destination.
  async toggleFavorite(id: number, isFavorite: boolean): Promise<boolean> {
    try {
      const db = await dbService.getDb();
      const favoriteValue = isFavorite ? 1 : 0;
      await db.runAsync(
        "UPDATE destinations SET is_favorite = ? WHERE id = ?;",
        favoriteValue,
        id
      );
      return true;
    } catch (error) {
      console.error(`Error toggling favorite status in SQLite for id ${id}:`, error);
      return false;
    }
  }
};
