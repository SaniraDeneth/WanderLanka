import React from "react";
import { Pressable, Text } from "react-native";

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
      className={`
        w-full items-center justify-center
        bg-brand-black py-4 px-8 rounded-lg
        shadow shadow-black/10
        active:scale-[0.98] active:opacity-90
        ${disabled ? "opacity-50" : "opacity-100"}
        ${className}
      `}
    >
      <Text
        className={`
          font-bebas text-4xl text-white tracking-[1.5px]
          ${textClassName}
        `}
      >
        {title}
      </Text>
    </Pressable>
  );
}
