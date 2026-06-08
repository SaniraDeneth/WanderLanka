import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { twMerge } from "tailwind-merge";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  className?: string;
  size?: number;
}

export default function FavoriteButton({
  isFavorite,
  onToggle,
  className,
  size = 17,
}: FavoriteButtonProps) {
  const [active, setActive] = useState(isFavorite);

  useEffect(() => {
    setActive(isFavorite);
  }, [isFavorite]);

  const handlePress = () => {
    setActive((prev) => !prev);
    onToggle();
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={8}
      className={twMerge(
        "w-9 h-9 bg-white/90 rounded-md items-center justify-center",
        className
      )}
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
      }}
    >
      <Ionicons
        name={active ? "heart" : "heart-outline"}
        size={size}
        color="#FF3B30"
      />
    </Pressable>
  );
}
