import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface CategoryCircleProps {
  name: string;
  imageUri: string;
  isActive: boolean;
  onPress: () => void;
}

export default function CategoryCircle({
  name,
  imageUri,
  isActive,
  onPress,
}: CategoryCircleProps) {
  return (
    <Pressable onPress={onPress} className="items-center mr-5">
      {/* Outer ring for active state */}
      <View
        className={`rounded-full p-0.75 ${isActive ? "bg-brand-green" : "bg-transparent"
          }`}
      >
        <View className="w-15 h-15 rounded-full overflow-hidden border-2 border-white shadow-sm">
          <Image
            source={{ uri: imageUri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      </View>
      <Text className="font-bebas text-md text-gray-500 uppercase  mt-2 text-center">
        {name}
      </Text>
    </Pressable>
  );
}
