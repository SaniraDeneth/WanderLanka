import { create } from "zustand";

interface FilterState {
  // Home tab filters
  homeVibe: string | null;
  homeCategory: number | null;

  // Explore tab filters
  exploreActiveTab: "SPOTS" | "PLANS";
  exploreSearchQuery: string;
  exploreVibe: string | null;
  exploreCategory: number | null;
  exploreSpotsMinRating: number | null;
  explorePlansMinRating: number | null;
  exploreMaxDistance: number | null;
  exploreMaxDays: number | null;
  exploreMaxBudget: number | null;
  exploreSpotsSortOrder: "asc" | "desc";
  explorePlansSortOrder: "asc" | "desc";
  exploreSpotsSortBy: "name" | "distance" | "rating";
  explorePlansSortBy: "name" | "rating";
  exploreSearchFocusRequested: boolean;
  
  // Saved tab filters
  savedActiveTab: "SPOTS" | "PLANS";

  // Actions for Home filters
  setHomeVibe: (vibe: string | null) => void;
  setHomeCategory: (categoryId: number | null) => void;
  resetHomeFilters: () => void;

  // Actions for Explore filters
  setExploreActiveTab: (tab: "SPOTS" | "PLANS") => void;
  setExploreSearchQuery: (query: string) => void;
  setExploreVibe: (vibe: string | null) => void;
  setExploreCategory: (categoryId: number | null) => void;
  setExploreSpotsMinRating: (rating: number | null) => void;
  setExplorePlansMinRating: (rating: number | null) => void;
  setExploreMaxDistance: (distance: number | null) => void;
  setExploreMaxDays: (days: number | null) => void;
  setExploreMaxBudget: (budget: number | null) => void;
  setExploreSpotsSortOrder: (order: "asc" | "desc") => void;
  setExplorePlansSortOrder: (order: "asc" | "desc") => void;
  setExploreSpotsSortBy: (sortBy: "name" | "distance" | "rating") => void;
  setExplorePlansSortBy: (sortBy: "name" | "rating") => void;
  setExploreSearchFocusRequested: (requested: boolean) => void;
  setSavedActiveTab: (tab: "SPOTS" | "PLANS") => void;
  resetExploreFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  // Home filters initial state
  homeVibe: null,
  homeCategory: null,

  // Explore filters initial state
  exploreActiveTab: "SPOTS",
  exploreSearchQuery: "",
  exploreVibe: null,
  exploreCategory: null,
  exploreSpotsMinRating: null,
  explorePlansMinRating: null,
  exploreMaxDistance: null,
  exploreMaxDays: null,
  exploreMaxBudget: null,
  exploreSpotsSortOrder: "asc",
  explorePlansSortOrder: "asc",
  exploreSpotsSortBy: "name",
  explorePlansSortBy: "name",
  exploreSearchFocusRequested: false,

  // Saved filters initial state
  savedActiveTab: "SPOTS",

  // Home actions
  setHomeVibe: (vibe) =>
    set((state) => ({
      homeVibe: state.homeVibe === vibe ? null : vibe,
    })),
  setHomeCategory: (categoryId) =>
    set((state) => ({
      homeCategory: state.homeCategory === categoryId ? null : categoryId,
    })),
  resetHomeFilters: () =>
    set({
      homeVibe: null,
      homeCategory: null,
    }),

  // Explore actions
  setExploreActiveTab: (tab) =>
    set({
      exploreActiveTab: tab,
    }),
  setExploreSearchQuery: (query) =>
    set({
      exploreSearchQuery: query,
    }),
  setExploreVibe: (vibe) =>
    set((state) => ({
      exploreVibe: state.exploreVibe === vibe ? null : vibe,
    })),
  setExploreCategory: (categoryId) =>
    set((state) => ({
      exploreCategory: state.exploreCategory === categoryId ? null : categoryId,
    })),
  setExploreSpotsMinRating: (rating) =>
    set({
      exploreSpotsMinRating: rating,
    }),
  setExplorePlansMinRating: (rating) =>
    set({
      explorePlansMinRating: rating,
    }),
  setExploreMaxDistance: (distance) =>
    set({
      exploreMaxDistance: distance,
    }),
  setExploreMaxDays: (days) =>
    set({
      exploreMaxDays: days,
    }),
  setExploreMaxBudget: (budget) =>
    set({
      exploreMaxBudget: budget,
    }),
  setExploreSpotsSortOrder: (order) =>
    set({
      exploreSpotsSortOrder: order,
    }),
  setExplorePlansSortOrder: (order) =>
    set({
      explorePlansSortOrder: order,
    }),
  setExploreSearchFocusRequested: (requested) =>
    set({
      exploreSearchFocusRequested: requested,
    }),
  setExploreSpotsSortBy: (sortBy) =>
    set({
      exploreSpotsSortBy: sortBy,
    }),
  setExplorePlansSortBy: (sortBy) =>
    set({
      explorePlansSortBy: sortBy,
    }),
  resetExploreFilters: () =>
    set({
      exploreSearchQuery: "",
      exploreVibe: null,
      exploreCategory: null,
      exploreSpotsMinRating: null,
      explorePlansMinRating: null,
      exploreMaxDistance: null,
      exploreMaxDays: null,
      exploreMaxBudget: null,
      exploreSpotsSortOrder: "asc",
      explorePlansSortOrder: "asc",
      exploreSpotsSortBy: "name",
      explorePlansSortBy: "name",
    }),
  setSavedActiveTab: (tab) =>
    set({
      savedActiveTab: tab,
    }),
}));
