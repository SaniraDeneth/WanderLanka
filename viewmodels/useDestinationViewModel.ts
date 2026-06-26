import { useEffect, useMemo, useState } from "react";
import { useFilterStore } from "../store/useFilterStore";
import { planService } from "../services/planService";
import { useLocationStore } from "../store/useLocationStore";
import { getHaversineDistance, useWanderStore } from "../store/useWanderStore";

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

// Hook to encapsulate all filtering, sorting, tab switching, and search logic for the Explore screen.
export function useExploreScreenData() {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Store-bound filter states
  const activeTab = useFilterStore((s) => s.exploreActiveTab);
  const setActiveTab = useFilterStore((s) => s.setExploreActiveTab);
  const searchQuery = useFilterStore((s) => s.exploreSearchQuery);
  const setSearchQuery = useFilterStore((s) => s.setExploreSearchQuery);

  // Tab-specific filters retrieved from store
  const spotsMinRating = useFilterStore((s) => s.exploreSpotsMinRating);
  const plansMinRating = useFilterStore((s) => s.explorePlansMinRating);
  const spotsSortOrder = useFilterStore((s) => s.exploreSpotsSortOrder);
  const plansSortOrder = useFilterStore((s) => s.explorePlansSortOrder);
  const spotsSortBy = useFilterStore((s) => s.exploreSpotsSortBy);
  const plansSortBy = useFilterStore((s) => s.explorePlansSortBy);

  const maxDistance = useFilterStore((s) => s.exploreMaxDistance);
  const maxDays = useFilterStore((s) => s.exploreMaxDays);
  const maxBudget = useFilterStore((s) => s.exploreMaxBudget);
  const resetExploreFilters = useFilterStore((s) => s.resetExploreFilters);

  const { activeVibe, activeCategory } = useExploreFilters();
  const { toggleFavorite, togglePlanFavorite } = useDestinationActions();

  // Load raw data from Zustand store
  const destinations = useWanderStore((s) => s.destinations);
  const plans = useWanderStore((s) => s.plans);
  const userLatitude = useLocationStore((s) => s.userLatitude);
  const userLongitude = useLocationStore((s) => s.userLongitude);

  // Reset all advanced filters
  const handleClearAllFilters = () => {
    resetExploreFilters();
  };

  const changeTab = (tab: "SPOTS" | "PLANS") => {
    setActiveTab(tab);
    setSearchQuery("");
  };

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return (
      spotsMinRating !== null ||
      plansMinRating !== null ||
      maxDistance !== null ||
      maxDays !== null ||
      maxBudget !== null ||
      spotsSortBy !== "name" ||
      plansSortBy !== "name" ||
      spotsSortOrder !== "asc" ||
      plansSortOrder !== "asc" ||
      activeVibe !== null ||
      activeCategory !== null
    );
  }, [
    spotsMinRating,
    plansMinRating,
    maxDistance,
    maxDays,
    maxBudget,
    spotsSortBy,
    plansSortBy,
    spotsSortOrder,
    plansSortOrder,
    activeVibe,
    activeCategory,
  ]);

  // Compute distances relative to user location (Colombo fallback if GPS denied)
  const computedDestinations = useMemo(() => {
    const lat = userLatitude ?? 6.9271;
    const lng = userLongitude ?? 79.8612;
    return destinations.map((dest) => {
      const dist = getHaversineDistance(lat, lng, dest.latitude, dest.longitude);
      return { ...dest, distance: parseFloat(dist.toFixed(1)) };
    });
  }, [destinations, userLatitude, userLongitude]);

  // Dynamic filtering & sorting for Spots (Destinations)
  const filteredSpots = useMemo(() => {
    let result = computedDestinations.filter((spot) => {
      const matchSearch = searchQuery
        ? spot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchVibe = activeVibe
        ? spot.vibeTag.toUpperCase() === activeVibe.toUpperCase()
        : true;

      const matchCategory = activeCategory ? spot.categoryId === activeCategory : true;

      const matchRating = spotsMinRating ? spot.rating >= spotsMinRating : true;

      const matchDistance = maxDistance ? spot.distance <= maxDistance : true;

      return matchSearch && matchVibe && matchCategory && matchRating && matchDistance;
    });

    if (spotsSortBy === "distance") {
      result.sort((a, b) =>
        spotsSortOrder === "asc" ? a.distance - b.distance : b.distance - a.distance
      );
    } else if (spotsSortBy === "rating") {
      result.sort((a, b) =>
        spotsSortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating
      );
    } else {
      result.sort((a, b) =>
        spotsSortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      );
    }

    return result;
  }, [
    computedDestinations,
    searchQuery,
    activeVibe,
    activeCategory,
    spotsMinRating,
    maxDistance,
    spotsSortBy,
    spotsSortOrder,
  ]);

  // Dynamic filtering & sorting for Plans (Itineraries)
  const filteredPlans = useMemo(() => {
    let result = plans.filter((plan) => {
      const matchSearch = searchQuery
        ? plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.overview.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchRating = plansMinRating ? plan.rating >= plansMinRating : true;

      let matchDays = true;
      if (maxDays !== null) {
        const parsedDays = parseInt(plan.duration);
        if (!isNaN(parsedDays)) {
          matchDays = parsedDays <= maxDays;
        }
      }

      const matchBudget = maxBudget && plan.budget ? plan.budget <= maxBudget : true;

      return matchSearch && matchRating && matchDays && matchBudget;
    });

    if (plansSortBy === "rating") {
      result.sort((a, b) =>
        plansSortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating
      );
    } else {
      result.sort((a, b) =>
        plansSortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      );
    }

    return result;
  }, [plans, searchQuery, plansMinRating, maxDays, maxBudget, plansSortBy, plansSortOrder]);

  return {
    isFiltersVisible,
    setIsFiltersVisible,
    scrollY,
    setScrollY,
    activeTab,
    searchQuery,
    setSearchQuery,
    filteredSpots,
    filteredPlans,
    hasActiveFilters,
    handleClearAllFilters,
    changeTab,
    toggleFavorite,
    togglePlanFavorite,
  };
}

// Hook to encapsulate all calculations for the Saved screen.
export function useSavedScreenData() {
  const activeTab = useFilterStore((s) => s.savedActiveTab);
  const setActiveTab = useFilterStore((s) => s.setSavedActiveTab);

  const destinations = useWanderStore((s) => s.destinations);
  const plans = useWanderStore((s) => s.plans);

  const userLatitude = useLocationStore((s) => s.userLatitude);
  const userLongitude = useLocationStore((s) => s.userLongitude);

  const { toggleFavorite, togglePlanFavorite } = useDestinationActions();

  const savedSpots = useMemo(() => {
    const lat = userLatitude ?? 6.9271;
    const lng = userLongitude ?? 79.8612;
    const favorited = destinations.filter((dest) => dest.isFavorite);
    return favorited.map((dest) => {
      const dist = getHaversineDistance(lat, lng, dest.latitude, dest.longitude);
      return { ...dest, distance: parseFloat(dist.toFixed(1)) };
    });
  }, [destinations, userLatitude, userLongitude]);

  const savedPlans = useMemo(() => {
    return plans.filter((plan) => plan.isFavorite);
  }, [plans]);

  return {
    activeTab,
    setActiveTab,
    savedSpots,
    savedPlans,
    toggleFavorite,
    togglePlanFavorite,
  };
}

// Hook to encapsulate all calculations for the Map screen.
export function useMapScreenData() {
  const destinations = useWanderStore((s) => s.destinations);
  const userLatitude = useLocationStore((s) => s.userLatitude);
  const userLongitude = useLocationStore((s) => s.userLongitude);
  const permissionStatus = useLocationStore((s) => s.permissionStatus);
  const fetchUserLocation = useLocationStore((s) => s.fetchUserLocation);
  const { toggleFavorite } = useDestinationActions();

  return {
    userLatitude,
    userLongitude,
    destinations,
    permissionStatus,
    fetchUserLocation,
    toggleFavorite,
  };
}

// Hook to retrieve full details of a specific Spot or Plan, including relations
export function useDetailsScreenData(id: number, type: "SPOT" | "PLAN") {
  const destinations = useWanderStore((s) => s.destinations);
  const toggleFavorite = useWanderStore((s) => s.toggleFavorite);
  const togglePlanFavorite = useWanderStore((s) => s.togglePlanFavorite);

  const [planDetails, setPlanDetails] = useState<any>(null);
  const [loading, setLoading] = useState(type === "PLAN");

  // Load detailed plan info (with nested destinations) if viewing a PLAN
  useEffect(() => {
    if (type === "PLAN") {
      setLoading(true);
      planService.fetchPlanDetails(id).then((details) => {
        setPlanDetails(details);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    }
  }, [id, type]);

  // Resolve Spot Details from store if viewing a SPOT
  const spotDetails = useMemo(() => {
    if (type === "SPOT") {
      return destinations.find((d) => d.id === id) || null;
    }
    return null;
  }, [destinations, id, type]);

  // Recommended spots (other spots in same category, excluding current spot)
  const recommendedSpots = useMemo(() => {
    if (type === "SPOT" && spotDetails) {
      return destinations
        .filter((d) => d.categoryId === spotDetails.categoryId && d.id !== id)
        .slice(0, 3);
    }
    return [];
  }, [destinations, spotDetails, id, type]);

  const handleToggleFavorite = async () => {
    if (type === "SPOT") {
      await toggleFavorite(id);
    } else {
      await togglePlanFavorite(id);
    }
  };

  return {
    spotDetails,
    planDetails,
    recommendedSpots,
    loading,
    toggleFavorite: handleToggleFavorite,
  };
}


