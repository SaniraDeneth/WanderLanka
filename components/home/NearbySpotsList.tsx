import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, Text, View } from "react-native";
import { useDestinationStore } from "../../store/useDestinationStore";
import { useNearbyDestinations } from "../../viewmodels/useDestinationViewModel";
import WanderCard from "./WanderCard";

interface NearbySpotsListProps {
  refreshKey?: number;
}

export default function NearbySpotsList({ refreshKey = 0 }: NearbySpotsListProps) {
  const toggleFavorite = useDestinationStore((s) => s.toggleFavorite);
  const nearbySpots = useNearbyDestinations(refreshKey);

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
