import React from "react";
import { Pressable, Text } from "react-native";

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  className?: string;
}

export default function FilterChip({ label, isActive, onPress, className = "" }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`py-2 px-8 rounded-md mr-3 border ${
        isActive
          ? "bg-brand-black border-brand-black"
          : "bg-white border-gray-100"
      } ${className}`}
    >
      <Text
        className={`font-bebas text-xl uppercase ${
          isActive ? "text-white" : "text-gray-500"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
