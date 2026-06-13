import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import heroImage from "../../assets/images/ui/misty-mountain.png";
import CategoryCircle from "../../components/home/CategoryCircle";
import FilterChip from "../../components/home/FilterChip";
import NearbySpotsList from "../../components/home/NearbySpotsList";
import NotificationInboxModal from "../../components/home/NotificationInboxModal";
import SectionHeader from "../../components/home/SectionHeader";
import WanderCard from "../../components/home/WanderCard";
import WanderRow from "../../components/home/WanderRow";
import { useFilterStore } from "../../store/useFilterStore";
import { useNotificationStore } from "../../store/useNotificationStore";
import {
  useDestinationActions,
  useDiscoverPlans,
  useHomeFilters,
  usePopularDestinations,
} from "../../viewmodels/useDestinationViewModel";
import { useProfileViewModel } from "../../viewmodels/useProfileViewModel";

const AVATARS_MAP: Record<string, string> = {
  person: "person-outline",
  compass: "compass-outline",
  camera: "camera-outline",
  map: "map-outline",
  globe: "globe-outline",
  airplane: "airplane-outline",
  bicycle: "bicycle-outline",
  boat: "boat-outline",
  umbrella: "umbrella-outline",
};

const VIBES = ["NATURE", "CULTURE", "ADVENTURE", "RELAX", "LUXURY"];



export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useProfileViewModel();

  const {
    categories,
    activeVibe,
    activeCategory,
    setActiveVibe,
    setActiveCategory,
  } = useHomeFilters();

  const {
    toggleFavorite,
    togglePlanFavorite,
    fetchUserLocation,
  } = useDestinationActions();

  const popularSpots = usePopularDestinations();
  const plans = useDiscoverPlans();

  const setExploreActiveTab = useFilterStore((s) => s.setExploreActiveTab);
  const setExploreSpotsMinRating = useFilterStore((s) => s.setExploreSpotsMinRating);
  const setExploreSpotsSortOrder = useFilterStore((s) => s.setExploreSpotsSortOrder);
  const setExploreSpotsSortBy = useFilterStore((s) => s.setExploreSpotsSortBy);
  const setExploreSearchFocusRequested = useFilterStore((s) => s.setExploreSearchFocusRequested);

  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false);
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserLocation().finally(() => {
      setRefreshKey((prev) => prev + 1);
      setRefreshing(false);
    });
  }, [fetchUserLocation]);

  useEffect(() => {
    fetchUserLocation();
  }, [fetchUserLocation]);





  const handleNotificationPress = () => {
    setIsNotificationModalVisible(true);
  }

  const handleSearchPress = () => {
    setExploreActiveTab("SPOTS");
    setExploreSearchFocusRequested(true);
    router.push("/explore");
  };

  const handlePopularSeeAll = () => {
    setExploreActiveTab("SPOTS");
    setExploreSpotsMinRating(null);
    setExploreSpotsSortBy("rating");
    setExploreSpotsSortOrder("desc");
    router.push("/explore");
  };

  const handlePlansSeeAll = () => {
    setExploreActiveTab("PLANS");
    router.push("/explore");
  };

  const handleNearbySeeAll = () => {
    setExploreActiveTab("SPOTS");
    setExploreSpotsSortBy("distance");
    setExploreSpotsSortOrder("asc");
    router.push("/explore");
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "GOOD MORNING" : hour < 17 ? "GOOD AFTERNOON" : "GOOD EVENING";

  return (
    <ScreenWrapper bottomPadding={false}>
      {/* HEADER */}
      <View className="flex-row items-center justify-between py-3">
        {/* Avatar + Greeting */}
        <Pressable
          onPress={() => router.push("/profile")}
          className="flex-row items-center active:scale-[0.95]"
        >
          <View className="w-12 h-12 rounded-full border-2 border-brand-green bg-brand-mint items-center justify-center overflow-hidden mr-3">
            {profile?.avatar === "camera-photo" && profile.photoUri ? (
              <Image
                source={{ uri: profile.photoUri }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            ) : profile?.avatar && AVATARS_MAP[profile.avatar] ? (
              <Ionicons
                name={AVATARS_MAP[profile.avatar] as any}
                size={22}
                color="#228B22"
              />
            ) : (
              <Ionicons name="person-outline" size={22} color="#228B22" />
            )}
          </View>
          <View>
            <Text className="text-[10px] font-montserrat-bold tracking-widest text-gray-400 uppercase">
              HELLO, {greeting}
            </Text>
            <Text className="font-bebas text-[28px] text-brand-black leading-none">
              {profile?.name ? profile.name.toUpperCase() : "EXPLORER"}
            </Text>
          </View>
        </Pressable>

        {/* Notification Bell */}
        <Pressable
          onPress={handleNotificationPress}
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Ionicons name="notifications-outline" size={18} color="#228B22" />
          {unreadCount > 0 && (
            <View className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-brand-green" />
          )}
        </Pressable>
      </View>

      {/*  MAIN SCROLL */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6B7280" />
        }
      >
        {/* SEARCH BAR */}
        <View>
          <Pressable
            onPress={handleSearchPress}
            className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 py-4"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.04,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 1 },
            }}
          >
            <Ionicons name="search-outline" size={16} color="#9CA3AF" />
            <Text className="flex-1 font-bebas text-xl text-gray-400 ml-2.5">
              Search destinations...
            </Text>
          </Pressable>
        </View>

        {/* HERO BANNER */}
        <View className="mb-6 mt-8">
          <View
            className="relative overflow-hidden rounded-2xl"
            style={{ height: 200 }}
          >
            <Image
              source={heroImage}
              style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
              contentFit="cover"
            />
            {/* Gradient overlay */}
            <View
              className="absolute inset-0 flex-col items-end justify-center p-8"
              style={{ backgroundColor: "rgba(0,0,0,0.10)" }}
            >
              <View>
                <Text className="font-bebas text-3xl text-white">
                  EXPLORE THE
                </Text>
                <Text className="font-bebas text-3xl text-white mb-3">MISTY MOUNTAINS</Text>
                <Button
                  title="START EXPLORING"
                  onPress={() => router.push({ pathname: "/details", params: { id: 7, type: "PLAN" } })}
                  className="bg-brand-green px-6 py-2"
                  textClassName="text-2xl tracking-normal"
                />
              </View>
            </View>
          </View>
        </View>

        {/* SELECT YOUR VIBE */}
        <View className="mb-5">
          <Text className="font-bebas text-2xl text-brand-black mb-3">
            SELECT YOUR VIBE
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {VIBES.map((vibe) => (
              <FilterChip
                key={vibe}
                label={vibe}
                isActive={activeVibe?.toUpperCase() === vibe}
                onPress={() => setActiveVibe(vibe)}
              />
            ))}
          </ScrollView>
        </View>

        {/* CATEGORY */}
        <View className="mb-8">
          <SectionHeader
            title="CATEGORY"
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {categories.map((cat) => (
              <CategoryCircle
                key={cat.id}
                name={cat.name}
                imageUri={cat.imageUri}
                isActive={activeCategory === cat.id}
                onPress={() => setActiveCategory(cat.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* NEARBY SPOTS */}
        <View className="mb-5 ">
          <SectionHeader
            title="NEARBY SPOTS"
            onSeeAll={handleNearbySeeAll}
          />
          <NearbySpotsList refreshKey={refreshKey} />
        </View>

        {/* POPULAR DESTINATIONS */}
        <View className="mb-5">
          <SectionHeader
            title="POPULAR DESTINATIONS"
            onSeeAll={handlePopularSeeAll}
          />
          {popularSpots.map((spot) => (
            <WanderRow
              key={spot.id}
              id={spot.id}
              type="SPOT"
              title={spot.title}
              imageUri={spot.imageUri}
              rating={spot.rating}
              vibeTag={spot.vibeTag}
              isFavorite={spot.isFavorite}
              onToggleFavorite={() => toggleFavorite(spot.id)}
            />
          ))}
        </View>

        {/* DISCOVER PLANS */}
        <View>
          <SectionHeader
            title="DISCOVER PLANS"
            onSeeAll={handlePlansSeeAll}
          />
          {plans.slice(0, 3).map((plan) => (
            <WanderCard
              key={plan.id}
              id={plan.id}
              type="PLAN"
              title={plan.title}
              overview={plan.overview}
              duration={plan.duration}
              rating={plan.rating}
              imageUri={plan.imageUri}
              isFavorite={plan.isFavorite}
              onToggleFavorite={() => togglePlanFavorite(plan.id)}
            />
          ))}
        </View>
      </ScrollView>
      {/* Notification Inbox Sheet */}
      <NotificationInboxModal
        visible={isNotificationModalVisible}
        onClose={() => setIsNotificationModalVisible(false)}
      />
    </ScreenWrapper>
  );
}
