import { create } from "zustand";
import { Category } from "../models/Category";
import { Destination } from "../models/Destination";
import { Plan } from "../models/Plan";
import { dbService } from "../services/dbService";
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

interface DestinationState {
  destinations: Destination[];
  categories: Category[];
  plans: Plan[];
  activeVibe: string | null;
  activeCategory: number | null;
  userLatitude: number | null;
  userLongitude: number | null;
  loading: boolean;

  initDatabase: () => Promise<void>;
  loadData: () => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;
  togglePlanFavorite: (id: number) => Promise<void>;
  setActiveVibe: (vibe: string | null) => void;
  setActiveCategory: (categoryId: number | null) => void;
  setUserLocation: (latitude: number, longitude: number) => void;

  // Selectors
  getFilteredDestinations: () => Destination[];
  getSortedDestinations: (list: Destination[]) => (Destination & { distance: number })[];
  getFavoriteDestinations: () => Destination[];
  getFavoritePlans: () => Plan[];
}

//zustand store
export const useDestinationStore = create<DestinationState>((set, get) => ({
  destinations: [],
  categories: [],
  plans: [],
  activeVibe: null,
  activeCategory: null,
  userLatitude: null,
  userLongitude: null,
  loading: true,

  initDatabase: async () => {
    set({ loading: true });
    try {
      await dbService.initDatabase();
      await get().loadData();
    } catch (error) {
      console.error("[useDestinationStore] Database setup error:", error);
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

  setActiveVibe: (vibe: string | null) => {
    // If selecting the active vibe, clear it (toggle behavior)
    set((state) => ({
      activeVibe: state.activeVibe === vibe ? null : vibe,
    }));
  },

  setActiveCategory: (categoryId: number | null) => {
    // If selecting the active category, clear it (toggle behavior)
    set((state) => ({
      activeCategory: state.activeCategory === categoryId ? null : categoryId,
    }));
  },

  setUserLocation: (latitude: number, longitude: number) => {
    set({ userLatitude: latitude, userLongitude: longitude });
  },

  getFilteredDestinations: () => {
    const { destinations, activeVibe, activeCategory } = get();
    return destinations.filter((dest) => {
      const matchVibe = activeVibe ? dest.vibeTag.toUpperCase() === activeVibe.toUpperCase() : true;
      const matchCategory = activeCategory ? dest.categoryId === activeCategory : true;
      return matchVibe && matchCategory;
    });
  },

  getSortedDestinations: (list: Destination[]) => {
    const { userLatitude, userLongitude } = get();

    if (userLatitude === null || userLongitude === null) {
      // Return list with distance of 0 if location is not resolved
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
