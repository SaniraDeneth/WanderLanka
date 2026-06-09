import { useMemo } from "react";
import { useWanderStore } from "../store/useWanderStore";
import { useFilterStore } from "../store/useFilterStore";
import { useLocationStore } from "../store/useLocationStore";

// Hook to retrieve popular destinations.
export function usePopularDestinations() {
  const destinations = useWanderStore((s) => s.destinations);
  const homeVibe = useFilterStore((s) => s.homeVibe);
  const homeCategory = useFilterStore((s) => s.homeCategory);

  return useMemo(() => {
    const filtered = destinations.filter((dest) => {
      const matchVibe = homeVibe ? dest.vibeTag.toUpperCase() === homeVibe.toUpperCase() : true;
      const matchCategory = homeCategory ? dest.categoryId === homeCategory : true;
      return matchVibe && matchCategory;
    });
    return [...filtered]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }, [destinations, homeVibe, homeCategory]);
}

// Hook to retrieve nearby spots.
export function useNearbyDestinations(refreshKey = 0) {
  const destinations = useWanderStore((s) => s.destinations);
  const getSortedDestinations = useWanderStore((s) => s.getSortedDestinations);
  
  const homeVibe = useFilterStore((s) => s.homeVibe);
  const homeCategory = useFilterStore((s) => s.homeCategory);
  
  const userLatitude = useLocationStore((s) => s.userLatitude);
  const userLongitude = useLocationStore((s) => s.userLongitude);

  return useMemo(() => {
    const filtered = destinations.filter((dest) => {
      const matchVibe = homeVibe ? dest.vibeTag.toUpperCase() === homeVibe.toUpperCase() : true;
      const matchCategory = homeCategory ? dest.categoryId === homeCategory : true;
      return matchVibe && matchCategory;
    });

    return getSortedDestinations(filtered, userLatitude, userLongitude).slice(0, 3);
  }, [destinations, homeVibe, homeCategory, refreshKey, userLatitude, userLongitude]);
}

export function useDiscoverPlans() {
  return useWanderStore((s) => s.plans);
}

// Hook to retrieve filtered and searched destinations for Explore screen.
export function useFilteredDestinations(searchQuery = "") {
  const destinations = useWanderStore((s) => s.destinations);
  const exploreVibe = useFilterStore((s) => s.exploreVibe);
  const exploreCategory = useFilterStore((s) => s.exploreCategory);

  return useMemo(() => {
    return destinations.filter((dest) => {
      const matchVibe = exploreVibe ? dest.vibeTag.toUpperCase() === exploreVibe.toUpperCase() : true;
      const matchCategory = exploreCategory ? dest.categoryId === exploreCategory : true;
      const matchSearch = searchQuery
        ? dest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dest.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchVibe && matchCategory && matchSearch;
    });
  }, [destinations, exploreVibe, exploreCategory, searchQuery]);
}

// Hook to retrieve filtered and searched plans for Explore screen.
export function useFilteredPlans(searchQuery = "") {
  const plans = useWanderStore((s) => s.plans);

  return useMemo(() => {
    return plans.filter((plan) => {
      const matchSearch = searchQuery
        ? plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          plan.overview.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchSearch;
    });
  }, [plans, searchQuery]);
}

// Hook for Home Tab Filters
export function useHomeFilters() {
  const categories = useWanderStore((s) => s.categories);
  const homeVibe = useFilterStore((s) => s.homeVibe);
  const homeCategory = useFilterStore((s) => s.homeCategory);
  const setHomeVibe = useFilterStore((s) => s.setHomeVibe);
  const setHomeCategory = useFilterStore((s) => s.setHomeCategory);
  const resetHomeFilters = useFilterStore((s) => s.resetHomeFilters);

  return {
    categories,
    activeVibe: homeVibe,
    activeCategory: homeCategory,
    setActiveVibe: setHomeVibe,
    setActiveCategory: setHomeCategory,
    resetFilters: resetHomeFilters,
  };
}

// Hook for Explore Tab Filters
export function useExploreFilters() {
  const categories = useWanderStore((s) => s.categories);
  const exploreVibe = useFilterStore((s) => s.exploreVibe);
  const exploreCategory = useFilterStore((s) => s.exploreCategory);
  const setExploreVibe = useFilterStore((s) => s.setExploreVibe);
  const setExploreCategory = useFilterStore((s) => s.setExploreCategory);

  return {
    categories,
    activeVibe: exploreVibe,
    activeCategory: exploreCategory,
    setActiveVibe: setExploreVibe,
    setActiveCategory: setExploreCategory,
  };
}

//Hook to retrieve general destination actions (favorites toggling, location management).
export function useDestinationActions() {
  const toggleFavorite = useWanderStore((s) => s.toggleFavorite);
  const togglePlanFavorite = useWanderStore((s) => s.togglePlanFavorite);
  
  // Route location tracking from useLocationStore
  const fetchUserLocation = useLocationStore((s) => s.fetchUserLocation);
  const setUserLocation = useLocationStore((s) => s.setUserLocation);

  return {
    toggleFavorite,
    togglePlanFavorite,
    setUserLocation,
    fetchUserLocation,
  };
}
