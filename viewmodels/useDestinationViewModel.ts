import { useMemo } from "react";
import { useDestinationStore, getHaversineDistance } from "../store/useDestinationStore";


// Hook to retrieve popular destinations.
export function usePopularDestinations() {
  const destinations = useDestinationStore((s) => s.destinations);
  const activeVibe = useDestinationStore((s) => s.activeVibe);
  const activeCategory = useDestinationStore((s) => s.activeCategory);

  return useMemo(() => {
    const filtered = destinations.filter((dest) => {
      const matchVibe = activeVibe ? dest.vibeTag.toUpperCase() === activeVibe.toUpperCase() : true;
      const matchCategory = activeCategory ? dest.categoryId === activeCategory : true;
      return matchVibe && matchCategory;
    });
    return [...filtered]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }, [destinations, activeVibe, activeCategory]);
}

// Hook to retrieve nearby spots.
export function useNearbyDestinations(refreshKey = 0) {
  const destinations = useDestinationStore((s) => s.destinations);
  const activeVibe = useDestinationStore((s) => s.activeVibe);
  const activeCategory = useDestinationStore((s) => s.activeCategory);
  
  // Select coordinates to check hasLocation, but exclude from memo deps to avoid tracking minor movement.
  const userLatitude = useDestinationStore((s) => s.userLatitude);
  const userLongitude = useDestinationStore((s) => s.userLongitude);
  const hasLocation = userLatitude !== null && userLongitude !== null;

  return useMemo(() => {
    const filtered = destinations.filter((dest) => {
      const matchVibe = activeVibe ? dest.vibeTag.toUpperCase() === activeVibe.toUpperCase() : true;
      const matchCategory = activeCategory ? dest.categoryId === activeCategory : true;
      return matchVibe && matchCategory;
    });

    if (!hasLocation) {
      return filtered.map((dest) => ({ ...dest, distance: 0 })).slice(0, 3);
    }

    return filtered
      .map((dest) => {
        const distance = getHaversineDistance(
          userLatitude!,
          userLongitude!,
          dest.latitude,
          dest.longitude
        );
        return { ...dest, distance: parseFloat(distance.toFixed(1)) };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  }, [destinations, activeVibe, activeCategory, refreshKey, hasLocation]);
}


export function useDiscoverPlans() {
  return useDestinationStore((s) => s.plans);
}

// Hook to retrieve filtered and searched destinations for Explore screen.
export function useFilteredDestinations(searchQuery = "") {
  const destinations = useDestinationStore((s) => s.destinations);
  const activeVibe = useDestinationStore((s) => s.activeVibe);
  const activeCategory = useDestinationStore((s) => s.activeCategory);

  return useMemo(() => {
    return destinations.filter((dest) => {
      const matchVibe = activeVibe ? dest.vibeTag.toUpperCase() === activeVibe.toUpperCase() : true;
      const matchCategory = activeCategory ? dest.categoryId === activeCategory : true;
      const matchSearch = searchQuery
        ? dest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dest.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchVibe && matchCategory && matchSearch;
    });
  }, [destinations, activeVibe, activeCategory, searchQuery]);
}


// Hook to retrieve destination filters (categories, vibes, and active selections).
export function useDestinationFilters() {
  const categories = useDestinationStore((s) => s.categories);
  const activeVibe = useDestinationStore((s) => s.activeVibe);
  const activeCategory = useDestinationStore((s) => s.activeCategory);
  const setActiveVibe = useDestinationStore((s) => s.setActiveVibe);
  const setActiveCategory = useDestinationStore((s) => s.setActiveCategory);

  return {
    categories,
    activeVibe,
    activeCategory,
    setActiveVibe,
    setActiveCategory,
  };
}

//Hook to retrieve general destination actions (favorites toggling, location management).
export function useDestinationActions() {
  const toggleFavorite = useDestinationStore((s) => s.toggleFavorite);
  const togglePlanFavorite = useDestinationStore((s) => s.togglePlanFavorite);
  const setUserLocation = useDestinationStore((s) => s.setUserLocation);
  const fetchUserLocation = useDestinationStore((s) => s.fetchUserLocation);

  return {
    toggleFavorite,
    togglePlanFavorite,
    setUserLocation,
    fetchUserLocation,
  };
}
