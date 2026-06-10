import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator, Image, Pressable,
  ScrollView,
  Text,
  View,
  Linking,
  Alert
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenWrapper from "../components/ScreenWrapper";
import WanderRow from "../components/home/WanderRow";
import FavoriteButton from "../components/FavoriteButton";
import { useWanderStore, getHaversineDistance } from "../store/useWanderStore";
import { useLocationStore } from "../store/useLocationStore";
import { useDetailsScreenData } from "../viewmodels/useDestinationViewModel";

export default function DetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, type } = useLocalSearchParams<{ id: string; type: "SPOT" | "PLAN" }>();

  // Load the categories list to look up category names for spots
  const categories = useWanderStore((s) => s.categories);
  const globalToggleFavorite = useWanderStore((s) => s.toggleFavorite);

  // Fetch spot/plan data from our viewmodel hook
  const { spotDetails, planDetails, recommendedSpots, loading, toggleFavorite } =
    useDetailsScreenData(Number(id), type);

  // Layout calculations
  const topOffset = insets.top > 0 ? insets.top + 10 : 16;
  const isPlan = type === "PLAN";

  // Resolve target details based on type
  const details = useMemo(() => {
    return isPlan ? planDetails : spotDetails;
  }, [isPlan, planDetails, spotDetails]);

  // Derived metadata parameters
  const transport = useMemo(() => {
    if (!isPlan) return "N/A";
    // Mock values matching the design based on plan ID/difficulty
    return Number(id) === 1 ? "Train / TukTuk" : "Train";
  }, [isPlan, id]);

  const difficulty = useMemo(() => {
    if (!isPlan) return "N/A";
    return Number(id) === 1 ? "Easy" : "Moderate";
  }, [isPlan, id]);

  const categoryName = useMemo(() => {
    if (isPlan || !spotDetails) return "";
    return categories.find((c) => c.id === spotDetails.categoryId)?.name || "N/A";
  }, [isPlan, spotDetails, categories]);

  const userLatitude = useLocationStore((s) => s.userLatitude);
  const userLongitude = useLocationStore((s) => s.userLongitude);

  const distanceText = useMemo(() => {
    if (isPlan || !spotDetails || userLatitude === null || userLongitude === null) {
      return "N/A";
    }
    const dist = getHaversineDistance(
      userLatitude,
      userLongitude,
      spotDetails.latitude,
      spotDetails.longitude
    );
    return `${dist.toFixed(1)} KM`;
  }, [isPlan, spotDetails, userLatitude, userLongitude]);

  // Back action
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/home");
    }
  };

  const handleGetDirections = () => {
    if (!spotDetails?.latitude || !spotDetails?.longitude) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${spotDetails.latitude},${spotDetails.longitude}`;

    Linking.openURL(url).catch((err) => {
      console.error("Failed to open directions link:", err);
      Alert.alert("Directions Error", "Could not launch map directions.");
    });
  };

  if (loading || !details) {
    return (
      <ScreenWrapper bottomPadding={false}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#A8D030" />
        </View>
      </ScreenWrapper>
    );
  }

  // Bookmarks state
  const isFavorite = details.isFavorite;

  const highlights = () => {
    if (isPlan) {
      const stopsCount = planDetails?.destinations?.length || 0;
      return (
        <>
          <View className="flex-row items-center justify-center flex-1 py-1">
            <Ionicons name="flame-outline" size={20} color="#000000" />
            <Text className="font-bebas text-lg text-brand-black ml-2 tracking-wider">
              {planDetails.duration}
            </Text>
          </View>
          <View className="w-px h-8 bg-gray-200" />
          <View className="flex-row items-center justify-center flex-1 py-1">
            <Ionicons name="time-outline" size={20} color="#000000" />
            <Text className="font-bebas text-lg text-brand-black ml-2 tracking-wider">
              {stopsCount} {stopsCount === 1 ? "Stop" : "Stops"}
            </Text>
          </View>
        </>
      );
    } else {
      return (
        <>
          <View className="flex-row items-center justify-center flex-1 py-1">
            <Ionicons name="star" size={20} color="#F59E0B" />
            <Text className="font-bebas text-lg text-brand-black ml-2 tracking-wider">
              ★ {spotDetails?.rating.toFixed(1)}
            </Text>
          </View>
          <View className="w-px h-8 bg-gray-200" />
          <View className="flex-row items-center justify-center flex-1 py-1">
            <Ionicons name="navigate-circle-outline" size={20} color="#000000" />
            <Text className="font-bebas text-lg text-brand-black ml-2 tracking-wider">
              {distanceText}
            </Text>
          </View>
        </>
      );
    }
  };

  const metrics = () => {
    if (isPlan) {
      return (
        <View className="flex-row justify-around py-4 border-b border-gray-100 bg-white/40 mt-6 mx-6 rounded-2xl px-2">
          <View className="items-center">
            <Text className="font-montserrat text-[9px] text-gray-400 tracking-wider uppercase mb-0.5">
              Transport
            </Text>
            <Text className="font-montserrat-bold text-sm text-brand-black">
              {transport}
            </Text>
          </View>
          <View className="items-center">
            <Text className="font-montserrat text-[9px] text-gray-400 tracking-wider uppercase mb-0.5">
              Difficulty
            </Text>
            <Text className="font-montserrat-bold text-sm text-brand-black">
              {difficulty}
            </Text>
          </View>
          <View className="items-center">
            <Text className="font-montserrat text-[9px] text-gray-400 tracking-wider uppercase mb-0.5">
              Est. Cost
            </Text>
            <Text className="font-montserrat-bold text-sm text-brand-black">
              ${planDetails.budget}
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View className="flex-row justify-around py-4 border-b border-gray-100 bg-white/40 mt-6 mx-6 rounded-2xl px-2">
          <View className="items-center">
            <Text className="font-montserrat text-[9px] text-gray-400 tracking-wider uppercase mb-0.5">
              Category
            </Text>
            <Text className="font-montserrat-bold text-sm text-brand-black">
              {categoryName}
            </Text>
          </View>
          <View className="items-center">
            <Text className="font-montserrat text-[9px] text-gray-400 tracking-wider uppercase mb-0.5">
              Vibe
            </Text>
            <Text className="font-montserrat-bold text-sm text-brand-black">
              {spotDetails?.vibeTag}
            </Text>
          </View>
          <View className="items-center">
            <Text className="font-montserrat text-[9px] text-gray-400 tracking-wider uppercase mb-0.5">
              Fee
            </Text>
            <Text className="font-montserrat-bold text-sm text-brand-black">
              {spotDetails?.entryFee}
            </Text>
          </View>
        </View>
      );
    }
  };

  // Render sub-list items (itinerary stops or recommended spots)
  const listItems = isPlan ? planDetails.destinations || [] : recommendedSpots || [];

  return (
    <ScreenWrapper noPadding={true} bottomPadding={false}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
        {/* HERO IMAGE */}
        <View className="w-full h-80 relative">
          <Image
            source={{ uri: details.imageUri }}
            className="w-full h-full"
            resizeMode="cover"
          />

          {/* BACK ACTION OVERLAY BUTTON */}
          <Pressable
            onPress={handleBack}
            className="absolute left-6 w-10 h-10 bg-black/40 rounded-full items-center justify-center"
            style={{ top: topOffset }}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </Pressable>

          {/* BOOKMARK HEART OVERLAY BUTTON */}
          <View
            className="absolute right-6"
            style={{ top: topOffset }}
          >
            <FavoriteButton
              isFavorite={isFavorite}
              onToggle={toggleFavorite}
            />
          </View>
        </View>

        {/* FLOATING HIGHLIGHTS OVERLAY CARD */}
        <View
          className="w-[90%] self-center bg-white rounded-3xl p-4 flex-row items-center justify-around shadow-xl -mt-10 border border-gray-100/50 z-40"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          {highlights()}
        </View>

        {/* METRICS ROW */}
        {metrics()}

        {/* TITLE & DESCRIPTION */}
        <View className="px-6 pt-5">
          <Text className="font-bebas text-3xl text-brand-black tracking-wide leading-tight mb-2">
            {details.title}
          </Text>
          <Text className="font-montserrat text-sm text-gray-500 leading-relaxed">
            {isPlan ? planDetails.overview : spotDetails?.description}
          </Text>

          {!isPlan && spotDetails?.latitude && (
            <Pressable
              onPress={handleGetDirections}
              className="bg-brand-black py-4 rounded-2xl items-center justify-center mt-6 active:scale-[0.98] flex-row gap-2"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
              }}
            >
              <Ionicons name="navigate" size={20} color="#FFFFFF" />
              <Text className="font-bebas text-lg text-white tracking-wider mt-0.5">GET DIRECTIONS</Text>
            </Pressable>
          )}
        </View>

        {/* BOTTOM RELATION LIST */}
        {listItems.length > 0 && (
          <View className="mt-8 px-6">
            <Text className="font-bebas text-2xl text-brand-black tracking-wider mb-4">
              {isPlan ? "ITINERARY STOPS" : "RECOMMENDED SPOTS"}
            </Text>

            {listItems.map((item: any, index: number) => (
              <WanderRow
                key={item.id}
                id={item.id}
                type="SPOT"
                title={isPlan ? `DAY ${index + 1}: ${item.title}` : item.title}
                imageUri={item.imageUri}
                rating={item.rating}
                isFavorite={item.isFavorite}
                onToggleFavorite={async () => {
                  await globalToggleFavorite(item.id);
                }}
                vibeTag={item.vibeTag}
                budget={item.entryFee || "FREE"}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}
