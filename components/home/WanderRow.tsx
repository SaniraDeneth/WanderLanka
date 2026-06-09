import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import FavoriteButton from "../FavoriteButton";

interface WanderRowProps {
  id: number;
  title: string;
  imageUri: string;
  rating: number;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
  vibeTag?: string;
  distance?: number;
  duration?: string;
  budget?: string;
  description?: string;
}

export default function WanderRow({
  title,
  imageUri,
  rating,
  isFavorite,
  onPress,
  onToggleFavorite,
  vibeTag,
  distance,
  duration,
  budget,
  description,
}: WanderRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white p-3 rounded-2xl border border-gray-100/60 shadow-sm flex-row items-center mb-3"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 1 },
      }}
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
      <View className="flex-1 justify-center">
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
          {distance !== undefined && distance > 0 && (
            <View className="flex-row items-center ml-1">
              <Ionicons name="navigate-circle-outline" size={12} color="#9CA3AF" />
              <Text className="font-montserrat text-[10px] text-gray-500 ml-1">
                {distance} KM
              </Text>
            </View>
          )}
        </View>

        {description && (
          <Text
            className="text-gray-400 font-montserrat text-[10px] mt-0.5 leading-tight"
            numberOfLines={1}
          >
            {description}
          </Text>
        )}

        {vibeTag ? (
          <Text className="font-montserrat-bold text-[9px] text-brand-green uppercase tracking-widest mt-1">
            {vibeTag}
          </Text>
        ) : (
          <View className="flex-row items-center mt-1 gap-1.5">
            {duration && (
              <View className="bg-brand-black/5 rounded px-1.5 py-0.5">
                <Text className="font-montserrat-bold text-[8px] text-brand-black uppercase tracking-wider">
                  {duration}
                </Text>
              </View>
            )}
            {budget && (
              <View className="bg-brand-mint border border-brand-green/20 rounded px-1.5 py-0.5">
                <Text className="font-montserrat-bold text-[8px] text-brand-evergreen uppercase tracking-wider">
                  {budget}
                </Text>
              </View>
            )}
          </View>
        )}
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
