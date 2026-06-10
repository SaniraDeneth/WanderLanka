import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import FavoriteButton from "../FavoriteButton";

interface WanderCardProps {
  id: number;
  type: "SPOT" | "PLAN";
  title: string;
  imageUri: string;
  rating: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;

  duration?: string;
  overview?: string;

  distance?: number;
  entryFee?: string;
}

export default function WanderCard({
  id,
  type,
  title,
  imageUri,
  rating,
  isFavorite,
  onToggleFavorite,
  duration,
  overview,
  distance,
  entryFee,
}: WanderCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/details",
      params: { id, type }
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      className="bg-white rounded-3xl overflow-hidden border border-gray-100/60 shadow-sm mb-4 active:scale-[0.99]"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      }}
    >
      {/* Full-width Image Area */}
      <View className="relative h-48">
        <Image
          source={{ uri: imageUri }}
          className="w-full h-full"
          resizeMode="cover"
        />
        {/* Floating Duration Badge (if plan) */}
        {duration && (
          <View className="absolute bottom-3 left-3 bg-brand-black/70 rounded-lg px-3 py-1">
            <Text className="font-montserrat-bold text-[9px] text-white uppercase tracking-widest">
              {duration}
            </Text>
          </View>
        )}
        {/* Floating Favorite Button */}
        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={onToggleFavorite}
          className="absolute top-3 right-3"
        />
      </View>

      {/* Card Content Footer */}
      <View className="px-4 py-3">
        {/* Title */}
        <Text className="font-bebas text-[20px] text-brand-black leading-tight">
          {title}
        </Text>

        {/* Overview Snippet (if plan) */}
        {overview && (
          <Text
            className="text-gray-500 font-montserrat text-xs mt-1 leading-4.5"
            numberOfLines={2}
          >
            {overview}
          </Text>
        )}

        {/* Details Row: Rating + Distance (left) & Entry Fee (right) */}
        <View className="flex-row items-center justify-between mt-2">
          {/* Rating + Distance Group */}
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center">
              <Ionicons name="star" size={12} color="#A8D030" />
              <Text className="font-montserrat-bold text-xs text-brand-black ml-1">
                {rating.toFixed(1)}
              </Text>
            </View>

            {distance !== undefined && (
              <View className="flex-row items-center">
                <Ionicons name="navigate-circle-outline" size={13} color="#9CA3AF" />
                <Text className="font-montserrat text-xs text-gray-500 ml-1">
                  {distance} KM
                </Text>
              </View>
            )}
          </View>

          {/* Entry Fee Badge (if nearby spot) */}
          {entryFee && (
            <View className="bg-brand-mint border border-brand-green/20 px-3 py-1 rounded-lg">
              <Text className="font-montserrat-bold text-[9px] text-brand-evergreen uppercase tracking-wide">
                {entryFee}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
