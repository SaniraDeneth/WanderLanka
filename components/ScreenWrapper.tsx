import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { twMerge } from "tailwind-merge";


interface ScreenWrapperProps {
  children: React.ReactNode;
  showGradients?: boolean;
  bottomPadding?: boolean;
  className?: string;
  noPadding?: boolean;
}

export default function ScreenWrapper({
  children,
  showGradients = true,
  bottomPadding = true,
  className: customClassName,
  noPadding = false,
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-brand-offwhite">
      {/* SVG BACKGROUND OVERLAYS */}
      {showGradients && (
        <View className="absolute inset-0 z-0 pointer-events-none">
          <Svg width="100%" height="100%">
            <Defs>
              <RadialGradient
                id="glowTopLeft"
                cx="0%"
                cy="0%"
                rx="80%"
                ry="80%"
              >
                <Stop offset="0%" stopColor="#D4F0C0" stopOpacity="0.7" />
                <Stop offset="100%" stopColor="#D4F0C0" stopOpacity="0" />
              </RadialGradient>

              {/* 2. Bottom-Right Green Glow */}
              <RadialGradient
                id="glowBottomRight"
                cx="100%"
                cy="100%"
                rx="80%"
                ry="80%"
              >
                <Stop offset="0%" stopColor="#E2F5D6" stopOpacity="0.6" />
                <Stop offset="100%" stopColor="#E2F5D6" stopOpacity="0" />
              </RadialGradient>
            </Defs>

            {/* Draw the gradients onto the screen */}
            <Rect width="100%" height="100%" fill="url(#glowTopLeft)" />
            <Rect width="100%" height="100%" fill="url(#glowBottomRight)" />
          </Svg>
        </View>
      )}

      {/* Main Content Area */}
      <View
        className={twMerge(
          "flex-1 z-10",
          !noPadding && "px-4",
          customClassName
        )}
        style={{
          paddingTop: !noPadding ? insets.top : 0,
          paddingBottom: !noPadding && bottomPadding ? (insets.bottom > 0 ? insets.bottom : 16) : 0,
        }}
      >
        {children}
      </View>
    </View>
  );
}
