import * as SQLite from "expo-sqlite";
import { categoriesSeed, destinationsSeed, plansSeed, planDestinationsSeed } from "../data/seedData";
let dbInstance: SQLite.SQLiteDatabase | null = null;

export const dbService = {

  async getDb(): Promise<SQLite.SQLiteDatabase> {
    if (!dbInstance) {
      dbInstance = await SQLite.openDatabaseAsync("wanderlanka.db");
    }
    return dbInstance;
  },

  //Initializes database schema and runs seeder if empty.
  async initDatabase(): Promise<void> {
    try {
      const db = await this.getDb();

      // Enable foreign key constraints in SQLite
      await db.execAsync("PRAGMA foreign_keys = ON;");

      // 1. Create necessary tables if they do not exist
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          image_uri TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS destinations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          category_id INTEGER NOT NULL,
          vibe_tag TEXT NOT NULL,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          image_uri TEXT NOT NULL,
          rating REAL DEFAULT 5.0,
          entry_fee TEXT NOT NULL,
          is_favorite INTEGER DEFAULT 0,
          FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS plans (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          overview TEXT NOT NULL,
          duration TEXT NOT NULL,
          rating REAL DEFAULT 5.0,
          image_uri TEXT NOT NULL,
          is_favorite INTEGER DEFAULT 0,
          budget REAL DEFAULT 150.0
        );

        CREATE TABLE IF NOT EXISTS plan_destinations (
          plan_id INTEGER NOT NULL,
          destination_id INTEGER NOT NULL,
          day_number INTEGER NOT NULL,
          sequence_order INTEGER NOT NULL,
          budget REAL DEFAULT 150.0,
          PRIMARY KEY (plan_id, destination_id),
          FOREIGN KEY (plan_id) REFERENCES plans (id) ON DELETE CASCADE,
          FOREIGN KEY (destination_id) REFERENCES destinations (id) ON DELETE CASCADE
        );
      `);

      // 2. Check if seeding is required
      let needSeed = false;
      try {
        const destCount = await db.getFirstAsync<{ count: number }>(
          "SELECT COUNT(*) as count FROM destinations;"
        );
        if (!destCount || destCount.count < 97) {
          needSeed = true;
        }
      } catch (e) {
        needSeed = true;
      }

      if (needSeed) {
        console.log("[dbService] Database out of date. Dropping and re-seeding...");
        
        // Drop tables to ensure clean state
        await db.execAsync("DROP TABLE IF EXISTS plan_destinations;");
        await db.execAsync("DROP TABLE IF EXISTS plans;");
        await db.execAsync("DROP TABLE IF EXISTS destinations;");
        await db.execAsync("DROP TABLE IF EXISTS categories;");

        // Recreate tables
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            image_uri TEXT NOT NULL
          );

          CREATE TABLE IF NOT EXISTS destinations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            category_id INTEGER NOT NULL,
            vibe_tag TEXT NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            image_uri TEXT NOT NULL,
            rating REAL DEFAULT 5.0,
            entry_fee TEXT NOT NULL,
            is_favorite INTEGER DEFAULT 0,
            FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
          );

          CREATE TABLE IF NOT EXISTS plans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            overview TEXT NOT NULL,
            duration TEXT NOT NULL,
            rating REAL DEFAULT 5.0,
            image_uri TEXT NOT NULL,
            is_favorite INTEGER DEFAULT 0,
            budget REAL DEFAULT 150.0
          );

          CREATE TABLE IF NOT EXISTS plan_destinations (
            plan_id INTEGER NOT NULL,
            destination_id INTEGER NOT NULL,
            day_number INTEGER NOT NULL,
            sequence_order INTEGER NOT NULL,
            budget REAL DEFAULT 150.0,
            PRIMARY KEY (plan_id, destination_id),
            FOREIGN KEY (plan_id) REFERENCES plans (id) ON DELETE CASCADE,
            FOREIGN KEY (destination_id) REFERENCES destinations (id) ON DELETE CASCADE
          );
        `);

        await this.seedData(db);
        console.log("[dbService] Database seeding completed successfully.");
      } else {
        console.log("[dbService] Database perfectly seeded with all 97 spots.");
      }
    } catch (error) {
      console.error("[dbService] Initialization failed:", error);
      throw error;
    }
  },

  //Seed destination, plans, and categories data.
  async seedData(db: SQLite.SQLiteDatabase): Promise<void> {
    await db.withTransactionAsync(async () => {
      // 1. Insert Categories
      for (const cat of categoriesSeed) {
        await db.runAsync(
          "INSERT INTO categories (name, image_uri) VALUES (?, ?);",
          cat.name,
          cat.image_uri
        );
      }

      // 2. Insert Destinations
      for (const dest of destinationsSeed) {
        await db.runAsync(
          `INSERT INTO destinations (id, title, description, category_id, vibe_tag, latitude, longitude, image_uri, rating, entry_fee, is_favorite)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0);`,
          dest.id,
          dest.title,
          dest.description,
          dest.categoryId,
          dest.vibeTag,
          dest.latitude,
          dest.longitude,
          dest.imageUri,
          dest.rating,
          dest.entryFee
        );
      }

      // 3. Insert Plans
      for (const plan of plansSeed) {
        await db.runAsync(
          "INSERT INTO plans (id, title, overview, duration, rating, image_uri, budget, is_favorite) VALUES (?, ?, ?, ?, ?, ?, ?, 0);",
          plan.id,
          plan.title,
          plan.overview,
          plan.duration,
          plan.rating,
          plan.imageUri,
          plan.budget
        );
      }

      // 4. Map Plan Destinations (Join Table Seeding)
      for (const pd of planDestinationsSeed) {
        await db.runAsync(
          "INSERT INTO plan_destinations (plan_id, destination_id, day_number, sequence_order) VALUES (?, ?, ?, ?);",
          pd.plan_id,
          pd.destination_id,
          pd.day_number,
          pd.sequence_order
        );
      }
    });
  }
};
