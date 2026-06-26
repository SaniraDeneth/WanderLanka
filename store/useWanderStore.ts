import { create } from "zustand";
import { Category } from "../models/Category";
import { Destination } from "../models/Destination";
import { Plan } from "../models/Plan";
import { dbService } from "../services/dbService";
import { Logger } from "../utils/logger";
import { destinationService } from "../services/destinationService";
import { planService } from "../services/planService";

// Helper function: Haversine straight-line distance in kilometers
export function getHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface WanderState {
  destinations: Destination[];
  categories: Category[];
  plans: Plan[];
  loading: boolean;

  initDatabase: () => Promise<void>;
  resetDatabase: () => Promise<void>;
  loadData: () => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;
  togglePlanFavorite: (id: number) => Promise<void>;

  // Selectors
  getSortedDestinations: (
    list: Destination[],
    userLatitude: number | null,
    userLongitude: number | null
  ) => (Destination & { distance: number })[];
  getFavoriteDestinations: () => Destination[];
  getFavoritePlans: () => Plan[];
}

//zustand store
export const useWanderStore = create<WanderState>((set, get) => ({
  destinations: [],
  categories: [],
  plans: [],
  loading: true,

  initDatabase: async () => {
    set({ loading: true });
    try {
      await dbService.initDatabase();
      await get().loadData();
    } catch (error) {
      Logger.error("[useWanderStore] Database setup error:", error);
    } finally {
      set({ loading: false });
    }
  },

  resetDatabase: async () => {
    set({ loading: true });
    try {
      await dbService.resetDatabase();
      await get().loadData();
    } catch (error) {
      Logger.error("[useWanderStore] Database reset error:", error);
    } finally {
      set({ loading: false });
    }
  },

  loadData: async () => {
    const [fetchedDestinations, fetchedCategories, fetchedPlans] = await Promise.all([
      destinationService.fetchDestinations(),
      destinationService.fetchCategories(),
      planService.fetchPlans(),
    ]);

    set({
      destinations: fetchedDestinations,
      categories: fetchedCategories,
      plans: fetchedPlans,
    });
  },

  toggleFavorite: async (id: number) => {
    const { destinations } = get();
    const target = destinations.find((d) => d.id === id);
    if (!target) return;

    const newFavoriteState = !target.isFavorite;

    // Optimistically update local Zustand state
    set({
      destinations: destinations.map((d) =>
        d.id === id ? { ...d, isFavorite: newFavoriteState } : d
      ),
    });

    // Persist bookmark update in background SQLite
    const success = await destinationService.toggleFavorite(id, newFavoriteState);
    if (!success) {
      // Revert if database write fails
      set({
        destinations: destinations.map((d) =>
          d.id === id ? { ...d, isFavorite: !newFavoriteState } : d
        ),
      });
    }
  },

  togglePlanFavorite: async (id: number) => {
    const { plans } = get();
    const target = plans.find((p) => p.id === id);
    if (!target) return;

    const newFavoriteState = !target.isFavorite;

    // Optimistically update local Zustand state
    set({
      plans: plans.map((p) =>
        p.id === id ? { ...p, isFavorite: newFavoriteState } : p
      ),
    });

    // Persist bookmark update in background SQLite
    const success = await planService.toggleFavorite(id, newFavoriteState);
    if (!success) {
      // Revert if database write fails
      set({
        plans: plans.map((p) =>
          p.id === id ? { ...p, isFavorite: !newFavoriteState } : p
        ),
      });
    }
  },

  getSortedDestinations: (
    list: Destination[],
    userLatitude: number | null,
    userLongitude: number | null
  ) => {
    if (userLatitude === null || userLongitude === null) {
      return list.map((dest) => ({ ...dest, distance: 0 }));
    }

    return list
      .map((dest) => {
        const distance = getHaversineDistance(
          userLatitude,
          userLongitude,
          dest.latitude,
          dest.longitude
        );
        return { ...dest, distance: parseFloat(distance.toFixed(1)) };
      })
      .sort((a, b) => a.distance - b.distance);
  },

  getFavoriteDestinations: () => {
    return get().destinations.filter((d) => d.isFavorite);
  },

  getFavoritePlans: () => {
    return get().plans.filter((p) => p.isFavorite);
  },
}));
