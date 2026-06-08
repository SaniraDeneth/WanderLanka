import * as SQLite from "expo-sqlite";

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
          is_favorite INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS plan_destinations (
          plan_id INTEGER NOT NULL,
          destination_id INTEGER NOT NULL,
          day_number INTEGER NOT NULL,
          sequence_order INTEGER NOT NULL,
          PRIMARY KEY (plan_id, destination_id),
          FOREIGN KEY (plan_id) REFERENCES plans (id) ON DELETE CASCADE,
          FOREIGN KEY (destination_id) REFERENCES destinations (id) ON DELETE CASCADE
        );
      `);

      // 2. Check if seeding is required (categories table count is zero)
      const categoryCount = await db.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM categories;"
      );

      if (categoryCount && categoryCount.count === 0) {
        console.log("[dbService] Database empty. Starting seeder...");
        await this.seedData(db);
        console.log("[dbService] Database seeding completed.");
      } else {
        console.log("[dbService] Database already seeded.");
      }
    } catch (error) {
      console.error("[dbService] Initialization failed:", error);
      throw error;
    }
  },

  //Seed destination, plans, and categories data.
  async seedData(db: SQLite.SQLiteDatabase): Promise<void> {
    await db.withTransactionAsync(async () => {
      // 1. Insert Categories (matching Home Screen circle previews)
      const categoriesSeed = [
        { name: "BEACHES", image_uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=300&auto=format&fit=crop" },
        { name: "MOUNTAINS", image_uri: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=300&auto=format&fit=crop" },
        { name: "HISTORICAL", image_uri: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=300&auto=format&fit=crop" },
        { name: "WILDLIFE", image_uri: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?q=80&w=300&auto=format&fit=crop" },
        { name: "HOTELS", image_uri: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=300&auto=format&fit=crop" }
      ];

      for (const cat of categoriesSeed) {
        await db.runAsync(
          "INSERT INTO categories (name, image_uri) VALUES (?, ?);",
          cat.name,
          cat.image_uri
        );
      }

      // Query generated category IDs for foreign keys mapping
      const beachesRow = await db.getFirstAsync<{ id: number }>("SELECT id FROM categories WHERE name = 'BEACHES';");
      const mountainsRow = await db.getFirstAsync<{ id: number }>("SELECT id FROM categories WHERE name = 'MOUNTAINS';");
      const historicalRow = await db.getFirstAsync<{ id: number }>("SELECT id FROM categories WHERE name = 'HISTORICAL';");
      const wildlifeRow = await db.getFirstAsync<{ id: number }>("SELECT id FROM categories WHERE name = 'WILDLIFE';");

      const beachesId = beachesRow?.id || 1;
      const mountainsId = mountainsRow?.id || 2;
      const historicalId = historicalRow?.id || 3;
      const wildlifeId = wildlifeRow?.id || 4;

      // 2. Insert Destinations
      const destinationsSeed = [
        {
          title: "GALLE FORT WALK",
          description: "Stroll along colonial ramparts built by the Portuguese and Dutch. Galle Fort features beautiful colonial architecture, boutique shops, and scenic sunsets.",
          category_id: historicalId,
          vibe_tag: "CULTURE",
          latitude: 6.0269,
          longitude: 80.2157,
          image_uri: "https://images.unsplash.com/photo-1588598126702-86109e6c9869?q=80&w=600&auto=format&fit=crop",
          rating: 4.9,
          entry_fee: "FREE"
        },
        {
          title: "SIGIRIYA ROCK FORTRESS",
          description: "Ancient fortress ruins on a massive 200m rock. Marvel at the Sigiriya frescoes, the lion claw entry, and the lush landscaped ancient water gardens.",
          category_id: historicalId,
          vibe_tag: "CULTURE",
          latitude: 7.9570,
          longitude: 80.7603,
          image_uri: "https://images.unsplash.com/photo-1578593139888-39622e2047de?q=80&w=600&auto=format&fit=crop",
          rating: 4.9,
          entry_fee: "$30 ENTRY"
        },
        {
          title: "ELLA NINE ARCH BRIDGE",
          description: "A gorgeous stone bridge situated in the hills of Ella, standing 80ft high and surrounded by lush tea bushes. Famous for watch colonial-era trains pass.",
          category_id: mountainsId,
          vibe_tag: "NATURE",
          latitude: 6.8768,
          longitude: 81.0609,
          image_uri: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=600&auto=format&fit=crop",
          rating: 4.9,
          entry_fee: "$30 ENTRY"
        },
        {
          title: "LITTLE ADAM'S PEAK",
          description: "A moderately easy hike in Ella offering spectacular 360-degree views of the mountain ranges. Walk through scenic tea estates and climb the gentle peaks.",
          category_id: mountainsId,
          vibe_tag: "ADVENTURE",
          latitude: 6.8660,
          longitude: 81.0667,
          image_uri: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=600&auto=format&fit=crop",
          rating: 4.8,
          entry_fee: "FREE"
        },
        {
          title: "RAWANA FALLS",
          description: "A popular wide-cascading waterfall located in Ella, linked to the legendary King Ravana. The falls are spectacular and easily visible from the road.",
          category_id: mountainsId,
          vibe_tag: "NATURE",
          latitude: 6.8411,
          longitude: 81.0550,
          image_uri: "https://images.unsplash.com/photo-1625515286596-f947e38ba858?q=80&w=600&auto=format&fit=crop",
          rating: 4.2,
          entry_fee: "FREE"
        },
        {
          title: "MIRISSA BEACH",
          description: "A gorgeous crescent of golden sand lined with palm trees, famous for whale watching, snorkeling with turtles, and vibrant beach cafes.",
          category_id: beachesId,
          vibe_tag: "NATURE",
          latitude: 5.9483,
          longitude: 80.4716,
          image_uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop",
          rating: 4.7,
          entry_fee: "FREE"
        },
        {
          title: "YALA SAFARI",
          description: "Sri Lanka's premier wildlife park, hosting leopards, wild elephants, sloth bears, and crocodiles in their natural coastal habitat.",
          category_id: wildlifeId,
          vibe_tag: "ADVENTURE",
          latitude: 6.3698,
          longitude: 81.5178,
          image_uri: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=600&auto=format&fit=crop",
          rating: 4.8,
          entry_fee: "$25 ENTRY"
        }
      ];

      for (const dest of destinationsSeed) {
        await db.runAsync(
          `INSERT INTO destinations (title, description, category_id, vibe_tag, latitude, longitude, image_uri, rating, entry_fee, is_favorite)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0);`,
          dest.title,
          dest.description,
          dest.category_id,
          dest.vibe_tag,
          dest.latitude,
          dest.longitude,
          dest.image_uri,
          dest.rating,
          dest.entry_fee
        );
      }

      // 3. Insert Plans
      const plansSeed = [
        {
          title: "NINE ARCHES BRIDGE",
          overview: "A single day focused trip to see the famous bridge in Ella, explore the surrounding tea fields, and check out rail vantage points.",
          duration: "1 DAY",
          rating: 4.9,
          image_uri: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=600&auto=format&fit=crop"
        },
        {
          title: "3-DAY SOUTH COAST EXPLORER",
          overview: "A beautiful coastal adventure covering colonial history in Galle Fort, relaxing beach vibes in Mirissa, and ending with a wildlife safari in Yala.",
          duration: "3 DAYS",
          rating: 5.0,
          image_uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop"
        }
      ];

      for (const plan of plansSeed) {
        await db.runAsync(
          "INSERT INTO plans (title, overview, duration, rating, image_uri, is_favorite) VALUES (?, ?, ?, ?, ?, 0);",
          plan.title,
          plan.overview,
          plan.duration,
          plan.rating,
          plan.image_uri
        );
      }

      // 4. Map Plan Destinations (Join Table Seeding)
      const galleFort = await db.getFirstAsync<{ id: number }>("SELECT id FROM destinations WHERE title = 'GALLE FORT WALK';");
      const mirissaBeach = await db.getFirstAsync<{ id: number }>("SELECT id FROM destinations WHERE title = 'MIRISSA BEACH';");
      const yalaSafari = await db.getFirstAsync<{ id: number }>("SELECT id FROM destinations WHERE title = 'YALA SAFARI';");
      const nineArch = await db.getFirstAsync<{ id: number }>("SELECT id FROM destinations WHERE title = 'ELLA NINE ARCH BRIDGE';");

      const planNineArch = await db.getFirstAsync<{ id: number }>("SELECT id FROM plans WHERE title = 'NINE ARCHES BRIDGE';");
      const planSouthCoast = await db.getFirstAsync<{ id: number }>("SELECT id FROM plans WHERE title = '3-DAY SOUTH COAST EXPLORER';");

      if (planNineArch && nineArch) {
        await db.runAsync(
          "INSERT INTO plan_destinations (plan_id, destination_id, day_number, sequence_order) VALUES (?, ?, 1, 1);",
          planNineArch.id,
          nineArch.id
        );
      }

      if (planSouthCoast && galleFort && mirissaBeach && yalaSafari) {
        await db.runAsync(
          "INSERT INTO plan_destinations (plan_id, destination_id, day_number, sequence_order) VALUES (?, ?, 1, 1);",
          planSouthCoast.id,
          galleFort.id
        );
        await db.runAsync(
          "INSERT INTO plan_destinations (plan_id, destination_id, day_number, sequence_order) VALUES (?, ?, 2, 1);",
          planSouthCoast.id,
          mirissaBeach.id
        );
        await db.runAsync(
          "INSERT INTO plan_destinations (plan_id, destination_id, day_number, sequence_order) VALUES (?, ?, 3, 1);",
          planSouthCoast.id,
          yalaSafari.id
        );
      }
    });
  }
};
