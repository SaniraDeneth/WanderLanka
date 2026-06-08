import React from "react";
import { Pressable, Text } from "react-native";

interface VibeChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export default function VibeChip({ label, isActive, onPress }: VibeChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`py-2 px-8 rounded-md mr-3 ${isActive
        ? "bg-brand-black border border-transparent"
        : "bg-white border border-gray-100"
        }`}
    >
      <Text
        className={`font-bebas text-xl uppercase ${isActive ? "text-white" : "text-gray-500"
          }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
