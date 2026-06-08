import Button from "@/components/Button";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Text, View } from "react-native";
import BrandLoader from "../components/BrandLoader";
import ScreenWrapper from "../components/ScreenWrapper";

export default function WelcomeScreen() {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleGetStarted = () => {
    router.push("/onboarding");
  };

  return (
    <ScreenWrapper showGradients={true}>
      {/* Hero Illustration Section */}
      <View className="w-full h-2/3 relative overflow-hidden justify-center items-center">
        {!imageLoaded && (
          <BrandLoader className="absolute inset-0 bg-brand-offwhite/50" size="large" />
        )}
        <Image
          source={require("../assets/images/welcome-hero.png")}
          className="w-full h-full"
          resizeMode="contain"
          onLoad={() => setImageLoaded(true)}
        />
      </View>

      {/* Bottom Content Section */}
      <View className="flex-1 items-center px-7 pb-3 relative">
        {/* Logo Brand Typography */}
        <Text className="font-bebas text-7xl text-brand-black  text-center">
          WANDAR <Text className="text-brand-green">LANKA</Text>
        </Text>

        {/* Description */}
        <Text className="font-bebas text-2xl text-gray-600 text-center mt-2.5 leading-5.75 max-w-67.5">
          Your ultimate localized companion for exploring the island.
        </Text>

        {/* Action Button */}
        <View className="w-full mt-6 px-3 z-10">
          <Button
            title="LET'S START"
            onPress={handleGetStarted}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}