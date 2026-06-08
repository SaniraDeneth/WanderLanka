import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import BrandLoader from "../components/BrandLoader";
import Button from "../components/Button";
import ScreenWrapper from "../components/ScreenWrapper";
import { useProfileViewModel } from "../viewmodels/useProfileViewModel";



const AVATARS_MAP: Record<string, { icon: string; label: string }> = {
  person: { icon: "person-outline", label: "Traveler" },
  compass: { icon: "compass-outline", label: "Explorer" },
  camera: { icon: "camera-outline", label: "Shutterbug" },
  map: { icon: "map-outline", label: "Backpacker" },
  globe: { icon: "globe-outline", label: "Nomad" },
  airplane: { icon: "airplane-outline", label: "Flyer" },
  bicycle: { icon: "bicycle-outline", label: "Cyclist" },
  boat: { icon: "boat-outline", label: "Sailor" },
  umbrella: { icon: "umbrella-outline", label: "Vacationer" },
};

export default function HomeScreen() {
  const router = useRouter();
  const { profile, loading, clearProfile } = useProfileViewModel();

  const handleReset = async () => {
    try {
      await clearProfile();
      router.replace("/");
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper showGradients={true}>
        <BrandLoader className="flex-1" />
      </ScreenWrapper>
    );
  }

  const avatarInfo = profile?.avatar ? AVATARS_MAP[profile.avatar] : null;

  return (
    <ScreenWrapper showGradients={true}>
      <View className="grow justify-between p-2">
        {/* Top Header */}
        <View className="flex-row items-center justify-between mt-4">
          <View className="w-10 h-10" />
          <Text className="font-bebas text-2xl tracking-widest text-brand-black">
            WANDER<Text className="text-brand-green">LANKA</Text>
          </Text>
          <Pressable
            onPress={handleReset}
            className="w-10 h-10 bg-white border border-gray-100 rounded-full items-center justify-center active:scale-[0.95] shadow-sm"
          >
            <Ionicons name="log-out-outline" size={18} color="#FF3B30" />
          </Pressable>
        </View>

        {/* Profile Card Section */}
        <View className="flex-1 items-center justify-center my-10">
          <View className="bg-white rounded-3xl p-8 w-full shadow-lg shadow-black/5 border border-gray-100/50 items-center">
            {/* Avatar Frame */}
            <View className="relative mb-6">
              <View className="w-32 h-32 rounded-full bg-brand-green/10 border-4 border-brand-green items-center justify-center overflow-hidden">
                {profile?.avatar === "camera-photo" && profile.photoUri ? (
                  <Image
                    source={{ uri: profile.photoUri }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : avatarInfo ? (
                  <Ionicons name={avatarInfo.icon as any} size={60} color="#A8D030" />
                ) : (
                  <Ionicons name="person-outline" size={60} color="#A8D030" />
                )}
              </View>

              {/* Status Badge */}
              <View className="absolute bottom-1 right-1 bg-brand-black w-8 h-8 rounded-full border-2 border-white items-center justify-center">
                <Ionicons name="shield-checkmark" size={14} color="#A8D030" />
              </View>
            </View>

            {/* Traveler Welcome Message */}
            <Text className="font-montserrat-bold text-xs text-brand-green uppercase tracking-widest mb-1">
              Verified Sri Lankan Explorer
            </Text>

            <Text className="font-bebas text-5xl text-brand-black text-center mt-2 tracking-wide">
              AYUBOWAN, {profile?.name ? profile.name.toUpperCase() : "EXPLORER"}!
            </Text>

            <Text className="font-montserrat text-sm text-gray-500 mt-3 text-center leading-relaxed max-w-[85%]">
              Welcome to the Pearl of the Indian Ocean. Your personalized itinerary is being generated.
            </Text>

            {/* Profile badge info */}
            {avatarInfo && (
              <View className="bg-gray-50 px-4 py-2 rounded-full border border-gray-100/80 mt-6 flex-row items-center">
                <Ionicons name={avatarInfo.icon as any} size={14} color="#6B7280" />
                <Text className="font-montserrat-bold text-[10px] text-gray-500 uppercase tracking-widest ml-2">
                  Role: {avatarInfo.label}
                </Text>
              </View>
            )}

            {profile?.avatar === "camera-photo" && (
              <View className="bg-gray-50 px-4 py-2 rounded-full border border-gray-100/80 mt-6 flex-row items-center">
                <Ionicons name="camera-outline" size={14} color="#6B7280" />
                <Text className="font-montserrat-bold text-[10px] text-gray-500 uppercase tracking-widest ml-2">
                  Role: Custom Photo
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Footer Actions */}
        <View className="mb-4">
          <Button
            title="RESET SETUP"
            onPress={handleReset}
            className="bg-brand-black"
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}
