import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Alert, Text, View } from "react-native";
import { useDestinationStore } from "../../store/useDestinationStore";
import WanderCard from "./WanderCard";

export default function NearbySpotsList() {
  console.log("NearbySpotsList rendered");

  // Subscribe to all pieces of state that should trigger a recalculation
  const userLatitude = useDestinationStore((s) => s.userLatitude);
  const userLongitude = useDestinationStore((s) => s.userLongitude);
  const destinations = useDestinationStore((s) => s.destinations);
  const activeVibe = useDestinationStore((s) => s.activeVibe);
  const activeCategory = useDestinationStore((s) => s.activeCategory);

  const getFilteredDestinations = useDestinationStore((s) => s.getFilteredDestinations);
  const getSortedDestinations = useDestinationStore((s) => s.getSortedDestinations);
  const toggleFavorite = useDestinationStore((s) => s.toggleFavorite);

  // useMemo "stores" the calculated array and forces an update when dependencies change
  const nearbySpots = useMemo(() => {
    const filtered = getFilteredDestinations();
    const sorted = getSortedDestinations(filtered);
    return sorted.slice(0, 2);
  }, [destinations, activeVibe, activeCategory, userLatitude, userLongitude]);

  const handleCardPress = (title: string) =>
    Alert.alert("Coming Soon", `${title} detail page coming in next phase.`);

  // console.log("user", userLatitude, userLongitude)

  if (nearbySpots.length === 0) {
    return (
      <View className="bg-white p-6 rounded-3xl items-center border border-gray-100">
        <Ionicons name="compass-outline" size={28} color="#D1D5DB" />
        <Text className="font-montserrat text-xs text-gray-400 mt-2 text-center">
          No spots match your current filters.
        </Text>
      </View>
    );
  }

  return (
    <>
      {nearbySpots.map((spot) => (
        <WanderCard
          key={spot.id}
          id={spot.id}
          title={spot.title}
          imageUri={spot.imageUri}
          rating={spot.rating}
          distance={spot.distance}
          entryFee={spot.entryFee}
          isFavorite={spot.isFavorite}
          onPress={() => handleCardPress(spot.title)}
          onToggleFavorite={() => toggleFavorite(spot.id)}
        />
      ))}
    </>
  );
}
