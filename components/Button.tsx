import React from "react";
import { Pressable, Text } from "react-native";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  title: string;
  onPress: () => void;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
}

export default function Button({
  title,
  onPress,
  className = "",
  textClassName = "",
  disabled = false,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={twMerge(
        "w-full items-center justify-center py-4 px-8 rounded-lg",
        "bg-brand-black shadow shadow-black/10 active:scale-[0.98] active:opacity-90",
        disabled ? "opacity-50" : "opacity-100",
        className
      )}
    >
      <Text className={twMerge("font-bebas text-3xl text-white", textClassName)}>
        {title}
      </Text>
    </Pressable>
  );
}
