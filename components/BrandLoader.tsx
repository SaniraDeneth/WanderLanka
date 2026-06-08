import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";

interface BrandLoaderProps {
  className?: string;
  size?: "small" | "large";
}

export default function BrandLoader({ className = "", size = "large" }: BrandLoaderProps) {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  const textSizeClass = size === "small" ? "text-4xl" : "text-7xl";
  const letterSpacingClass = size === "small" ? "tracking-[2px]" : "tracking-[4px]";

  return (
    <View className={`items-center justify-center ${className}`}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text className={`font-bebas ${textSizeClass} ${letterSpacingClass} text-brand-black text-center`}>
          W<Text className="text-brand-green">LANKA</Text>
        </Text>
      </Animated.View>
    </View>
  );
}
