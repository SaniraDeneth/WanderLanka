import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import FavoriteButton from "../FavoriteButton";

interface PopularDestinationRowProps {
  id: number;
  title: string;
  imageUri: string;
  rating: number;
  vibeTag: string;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export default function PopularDestinationRow({
  title,
  imageUri,
  rating,
  vibeTag,
  isFavorite,
  onPress,
  onToggleFavorite,
}: PopularDestinationRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white p-3 rounded-2xl border border-gray-100/60 shadow-sm flex-row items-center mb-3"
      style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 1 } }}
    >
      {/* Thumbnail */}
      <View className="w-20 h-20 rounded-xl mr-3 overflow-hidden">
        <Image
          source={{ uri: imageUri }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Info */}
      <View className="flex-1">
        <Text
          className="font-bebas text-[17px] text-brand-black leading-tight"
          numberOfLines={1}
        >
          {title}
        </Text>
        <View className="flex-row items-center mt-1">
          <Ionicons name="star" size={11} color="#A8D030" />
          <Text className="font-montserrat-bold text-[10px] text-brand-black ml-1 mr-2">
            {rating.toFixed(1)}
          </Text>
        </View>
        <Text className="font-montserrat-bold text-[9px] text-brand-green uppercase tracking-widest mt-1.5">
          {vibeTag}
        </Text>
      </View>

      {/* Favorite Button */}
      <FavoriteButton
        isFavorite={isFavorite}
        onToggle={onToggleFavorite}
        className="bg-gray-50 ml-1"
        size={16}
      />
    </Pressable>
  );
}
