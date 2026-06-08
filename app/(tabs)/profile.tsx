import React from "react";
import { Text, View } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";

export default function ProfileScreen() {
  return (
    <ScreenWrapper showGradients={true}>
      <View className="flex-1 items-center justify-center">
        <Text className="font-bebas text-3xl text-brand-black">Profile Screen</Text>
      </View>
    </ScreenWrapper>
  );
}
