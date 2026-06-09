import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useRef, useState } from "react";
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import FilterChip from "../../components/home/FilterChip";
import WanderRow from "../../components/home/WanderRow";
import ScreenWrapper from "../../components/ScreenWrapper";
import { getHaversineDistance, useDestinationStore } from "../../store/useDestinationStore";
import {
  useDestinationActions,
  useDestinationFilters,
} from "../../viewmodels/useDestinationViewModel";

const VIBES = ["NATURE", "CULTURE", "ADVENTURE"];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"SPOTS" | "PLANS">("SPOTS");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  // Advanced filter states
  const [minRating, setMinRating] = useState<number | null>(null);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [maxDays, setMaxDays] = useState<number | null>(null);
  const [maxBudget, setMaxBudget] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Scroll tracking and ScrollView ref for pull-down reset gesture
  const [scrollY, setScrollY] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    categories,
    activeVibe,
    activeCategory,
    setActiveVibe,
    setActiveCategory,
  } = useDestinationFilters();

  const { toggleFavorite, togglePlanFavorite } = useDestinationActions();

  // Load raw data from Zustand store
  const destinations = useDestinationStore((s) => s.destinations);
  const plans = useDestinationStore((s) => s.plans);
  const userLatitude = useDestinationStore((s) => s.userLatitude);
  const userLongitude = useDestinationStore((s) => s.userLongitude);

  // Reset all advanced filters
  const handleClearAllFilters = () => {
    setMinRating(null);
    setMaxDistance(null);
    setMaxDays(null);
    setMaxBudget(null);
    setSortOrder("asc");
    setActiveVibe(null);
    setActiveCategory(null);
  };

  const handleTabChange = (tab: "SPOTS" | "PLANS") => {
    setActiveTab(tab);
    setSearchQuery("");
    handleClearAllFilters();
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return (
      minRating !== null ||
      maxDistance !== null ||
      maxDays !== null ||
      maxBudget !== null ||
      sortOrder !== "asc" ||
      activeVibe !== null ||
      activeCategory !== null
    );
  }, [minRating, maxDistance, maxDays, maxBudget, sortOrder, activeVibe, activeCategory]);

  // Compute distances relative to user location (Colombo fallback if GPS denied)
  const computedDestinations = useMemo(() => {
    const lat = userLatitude ?? 6.9271;
    const lng = userLongitude ?? 79.8612;
    return destinations.map((dest) => {
      const dist = getHaversineDistance(lat, lng, dest.latitude, dest.longitude);
      return { ...dest, distance: parseFloat(dist.toFixed(1)) };
    });
  }, [destinations, userLatitude, userLongitude]);

  // Dynamic filtering & sorting for Spots (Destinations)
  const filteredSpots = useMemo(() => {
    let result = computedDestinations.filter((spot) => {
      const matchSearch = searchQuery
        ? spot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchVibe = activeVibe
        ? spot.vibeTag.toUpperCase() === activeVibe.toUpperCase()
        : true;

      const matchCategory = activeCategory ? spot.categoryId === activeCategory : true;

      const matchRating = minRating ? spot.rating >= minRating : true;

      const matchDistance = maxDistance ? spot.distance <= maxDistance : true;

      return matchSearch && matchVibe && matchCategory && matchRating && matchDistance;
    });

    if (maxDistance !== null) {
      // Auto sort by closest distance if distance filter is applied
      result.sort((a, b) => a.distance - b.distance);
    } else {
      result.sort((a, b) =>
        sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      );
    }

    return result;
  }, [computedDestinations, searchQuery, activeVibe, activeCategory, minRating, maxDistance, sortOrder]);

  // Dynamic filtering & sorting for Plans (Itineraries)
  const filteredPlans = useMemo(() => {
    let result = plans.filter((plan) => {
      const matchSearch = searchQuery
        ? plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.overview.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchRating = minRating ? plan.rating >= minRating : true;

      let matchDays = true;
      if (maxDays !== null) {
        const parsedDays = parseInt(plan.duration);
        if (!isNaN(parsedDays)) {
          matchDays = parsedDays <= maxDays;
        }
      }

      const matchBudget = maxBudget && plan.budget ? plan.budget <= maxBudget : true;

      return matchSearch && matchRating && matchDays && matchBudget;
    });

    result.sort((a, b) =>
      sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    );

    return result;
  }, [plans, searchQuery, minRating, maxDays, maxBudget, sortOrder]);

  const handleCardPress = (title: string) =>
    Alert.alert("Coming Soon", `${title} detail page coming in next phase.`);

  return (
    <ScreenWrapper bottomPadding={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* HEADER */}
        <View className="py-4 flex-row justify-between items-center">
          <View>
            <Text className="font-bebas text-4xl text-brand-black">EXPLORE</Text>
            <Text className="font-montserrat text-xs text-gray-400 mt-0.5 tracking-wider">
              FIND YOUR NEXT ADVENTURE IN SRI LANKA
            </Text>
          </View>
          <Pressable
            onPress={() => setIsFiltersVisible(true)}
            hitSlop={8}
            className={`p-3 rounded-2xl border ${isFiltersVisible || hasActiveFilters
                ? "bg-brand-black border-brand-black"
                : "bg-white border-gray-200"
              } shadow-sm`}
          >
            <Ionicons
              name={isFiltersVisible || hasActiveFilters ? "funnel" : "funnel-outline"}
              size={18}
              color={isFiltersVisible || hasActiveFilters ? "#FFFFFF" : "#1F2937"}
            />
          </Pressable>
        </View>

        {/* TAB SWITCHER */}
        <View className="flex-row bg-gray-100/80 p-1 rounded-2xl mb-4">
          <Pressable
            onPress={() => handleTabChange("SPOTS")}
            className={`flex-1 py-3 rounded-xl items-center justify-center ${activeTab === "SPOTS" ? "bg-brand-black" : "bg-transparent"
              }`}
          >
            <Text
              className={`font-bebas text-lg tracking-wider ${activeTab === "SPOTS" ? "text-white" : "text-gray-500"
                }`}
            >
              SPOTS
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleTabChange("PLANS")}
            className={`flex-1 py-3 rounded-xl items-center justify-center ${activeTab === "PLANS" ? "bg-brand-black" : "bg-transparent"
              }`}
          >
            <Text
              className={`font-bebas text-lg tracking-wider ${activeTab === "PLANS" ? "text-white" : "text-gray-500"
                }`}
            >
              PLANS
            </Text>
          </Pressable>
        </View>

        {/* SEARCH INPUT */}
        <View className="mb-4">
          <Pressable
            onPress={() => setSearchQuery("")}
            hitSlop={8}
            className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.04,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 1 },
            }}
          >
            <Ionicons name="search-outline" size={16} color="#9CA3AF" />
            <TextInput
              placeholder={activeTab === "SPOTS" ? "Search destinations..." : "Search travel plans..."}
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 font-bebas text-xl text-brand-black ml-2.5 py-4 justify-center items-center h-max w-max"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </Pressable>
        </View>


        {/* BOTTOM SHEET MODAL FOR FILTERS */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isFiltersVisible}
          onRequestClose={() => setIsFiltersVisible(false)}
        >
          <Pressable
            className="flex-1 bg-black/50 justify-end"
            onPress={() => setIsFiltersVisible(false)}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              className="w-full"
            >
              <Pressable
                className="bg-white rounded-t-[36px] px-6 pt-4 pb-8 w-full shadow-2xl"
                style={{ maxHeight: 600 }}
                onPress={(e) => e.stopPropagation()}
              >
                {/* Drag Handle Indicator */}
                <View className="items-center mb-4">
                  <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
                </View>

                {/* Modal Title Bar */}
                <View className="flex-row justify-between items-center mb-5">
                  <View>
                    <Text className="font-bebas text-3xl text-brand-black">
                      {activeTab === "SPOTS" ? "SPOT FILTER SETTINGS" : "PLAN FILTER SETTINGS"}
                    </Text>
                    <Text className="font-montserrat-bold text-[10px] text-brand-green tracking-wider uppercase mt-1">
                      {activeTab === "SPOTS"
                        ? `${filteredSpots.length} SPOTS MATCHED`
                        : `${filteredPlans.length} PLANS MATCHED`}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setIsFiltersVisible(false)}
                    className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
                  >
                    <Ionicons name="close" size={16} color="#4B5563" />
                  </Pressable>
                </View>

                {/* Scrollable filter config options */}
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 16 }}
                >
                  {((activeTab === "SPOTS" && filteredSpots.length === 0) ||
                    (activeTab === "PLANS" && filteredPlans.length === 0)) && (
                    <Pressable
                      onPress={handleClearAllFilters}
                      className="bg-red-50/60 border border-red-200 px-4 py-3.5 rounded-2xl mb-4 flex-row items-center justify-center active:scale-[0.98]"
                    >
                      <Ionicons name="refresh-outline" size={14} color="#EF4444" />
                      <Text className="font-montserrat-bold text-[10px] text-red-500 ml-2 uppercase tracking-wider">
                        NO MATCHES FOUND. TAP TO RESET FILTERS
                      </Text>
                    </Pressable>
                  )}
                  {activeTab === "SPOTS" ? (
                    <>
                      {/* Vibe Selector */}
                      <View className="mb-4">
                        <Text className="font-montserrat-bold text-[10px] text-gray-400 mb-1.5 uppercase tracking-wider">
                          SELECT VIBE
                        </Text>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ gap: 8 }}
                          className="mb-1"
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

                      {/* Category Selector */}
                      <View className="mb-4">
                        <Text className="font-montserrat-bold text-[10px] text-gray-400 mb-1.5 uppercase tracking-wider">
                          CATEGORIES
                        </Text>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ gap: 8 }}
                          className="mb-1"
                        >
                          {categories.map((cat) => (
                            <FilterChip
                              key={cat.id}
                              label={cat.name}
                              isActive={activeCategory === cat.id}
                              onPress={() => setActiveCategory(cat.id)}
                            />
                          ))}
                        </ScrollView>
                      </View>

                      {/* Rating Selector */}
                      <View className="mb-4">
                        <Text className="font-montserrat-bold text-[10px] text-gray-400 mb-1.5 uppercase tracking-wider">
                          MINIMUM RATING
                        </Text>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ gap: 8 }}
                          className="mb-1"
                        >
                          {[null, 4.0, 4.5, 4.8].map((val) => (
                            <FilterChip
                              key={String(val)}
                              label={val === null ? "ANY" : `★ ${val.toFixed(1)}+`}
                              isActive={minRating === val}
                              onPress={() => setMinRating(val)}
                            />
                          ))}
                        </ScrollView>
                      </View>

                      {/* Distance Filter */}
                      <View className="flex-row items-center justify-between mb-4">
                        <Text className="font-montserrat-bold text-[10px] text-gray-400 uppercase tracking-wider mr-3">
                          MAX DISTANCE (KM FROM MY LOCATION)
                        </Text>
                        <View className="flex-row items-center gap-2">
                          <TextInput
                            value={maxDistance !== null ? String(maxDistance) : ""}
                            onChangeText={(val) => setMaxDistance(val ? parseFloat(val) : null)}
                            placeholder="e.g. 50"
                            keyboardType="numeric"
                            style={{ width: 90, height: 36, textAlign: "center" }}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-montserrat text-brand-black"
                          />
                        </View>
                      </View>
                    </>
                  ) : (
                    <>
                      {/* Rating Selector for Plans */}
                      <View className="mb-4">
                        <Text className="font-montserrat-bold text-[10px] text-gray-400 mb-1.5 uppercase tracking-wider">
                          MINIMUM RATING
                        </Text>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ gap: 8 }}
                          className="mb-1"
                        >
                          {[null, 4.0, 4.5, 4.8].map((val) => (
                            <FilterChip
                              key={String(val)}
                              label={val === null ? "ANY" : `★ ${val.toFixed(1)}+`}
                              isActive={minRating === val}
                              onPress={() => setMinRating(val)}
                            />
                          ))}
                        </ScrollView>
                      </View>

                      {/* Days & Budget Filters */}
                      <View className="flex-row gap-3 mb-4">
                        <View className="flex-1">
                          <Text className="font-montserrat-bold text-[10px] text-gray-400 mb-1.5 uppercase tracking-wider">
                            MAX DAYS
                          </Text>
                          <TextInput
                            value={maxDays !== null ? String(maxDays) : ""}
                            onChangeText={(val) => setMaxDays(val ? parseInt(val) : null)}
                            placeholder="e.g. 3"
                            keyboardType="numeric"
                            style={{ height: 36, textAlign: "center" }}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-montserrat text-brand-black w-full"
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="font-montserrat-bold text-[10px] text-gray-400 mb-1.5 uppercase tracking-wider">
                            MAX BUDGET ($)
                          </Text>
                          <TextInput
                            value={maxBudget !== null ? String(maxBudget) : ""}
                            onChangeText={(val) => setMaxBudget(val ? parseFloat(val) : null)}
                            placeholder="e.g. 100"
                            keyboardType="numeric"
                            style={{ height: 36, textAlign: "center" }}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-montserrat text-brand-black w-full"
                          />
                        </View>
                      </View>
                    </>
                  )}

                  {/* Sorting Options */}
                  <View className="border-t border-gray-100 pt-3">
                    {activeTab === "SPOTS" && maxDistance !== null ? (
                      <Text className="font-montserrat text-[9px] text-brand-green uppercase tracking-wider mt-1">
                        Auto-sorted by closest distance first
                      </Text>
                    ) : (
                      <>
                        <Text className="font-montserrat-bold text-[10px] text-gray-400 mb-1.5 uppercase tracking-wider">
                          SORT DIRECTION
                        </Text>
                        <View className="flex-row gap-2">
                          <FilterChip
                            label="ASCENDING"
                            isActive={sortOrder === "asc"}
                            onPress={() => setSortOrder("asc")}
                          />
                          <FilterChip
                            label="DESCENDING"
                            isActive={sortOrder === "desc"}
                            onPress={() => setSortOrder("desc")}
                          />
                        </View>
                      </>
                    )}
                  </View>
                </ScrollView>

                {/* Footer Action Button */}
                <View className="border-t border-gray-150 pt-4">
                  <Pressable
                    onPress={() => setIsFiltersVisible(false)}
                    className="bg-brand-black py-4 rounded-2xl items-center justify-center active:scale-[0.98]"
                  >
                    <Text className="font-bebas text-lg text-white tracking-wider">
                      APPLY FILTERS (
                      {activeTab === "SPOTS"
                        ? `${filteredSpots.length} SPOTS FOUND`
                        : `${filteredPlans.length} PLANS FOUND`}
                      )
                    </Text>
                  </Pressable>
                </View>
              </Pressable>
            </KeyboardAvoidingView>
          </Pressable>
        </Modal>

        {/* LIST SCROLL CONTAINER */}
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
          onScroll={(e) => {
            setScrollY(e.nativeEvent.contentOffset.y);
          }}
          scrollEventThrottle={16}
          onScrollEndDrag={(e) => {
            if (e.nativeEvent.contentOffset.y < -70) {
              handleClearAllFilters();
            }
          }}
        >
          <View style={{ position: "relative" }}>
            {/* Pull-down gesture indicator */}
            {scrollY < 0 && (
              <View
                style={{
                  position: "absolute",
                  top: -35,
                  left: 0,
                  right: 0,
                  height: 30,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text className="font-bebas text-xs text-gray-400 tracking-wider">
                  {scrollY < -60 ? "RELEASE TO REMOVE ALL FILTERS" : "SWIPE DOWN TO REMOVE ALL FILTERS"}
                </Text>
              </View>
            )}

            {/* RESULTS COUNT & HEADER */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="font-bebas text-2xl text-brand-black">
                {activeTab === "SPOTS" ? "DESTINATIONS" : "TRAVEL PLANS"}
              </Text>
              <Text className="font-montserrat-bold text-[10px] text-brand-green tracking-wider uppercase">
                {activeTab === "SPOTS"
                  ? `${filteredSpots.length} SPOTS FOUND`
                  : `${filteredPlans.length} PLANS FOUND`}
              </Text>
            </View>

            {/* DESTINATION / PLANS LIST */}
            {activeTab === "SPOTS" ? (
              filteredSpots.length === 0 ? (
                <View className="bg-white p-8 rounded-3xl items-center border border-gray-100 mt-4">
                  <Ionicons name="search-outline" size={32} color="#D1D5DB" />
                  <Text className="font-bebas text-xl text-brand-black mt-3">NO SPOTS FOUND</Text>
                  <Text className="font-montserrat text-xs text-gray-400 mt-1 text-center max-w-50 mb-4">
                    Try adjusting your search query, vibe, category, or advanced rating/distance filters.
                  </Text>
                  <Pressable
                    onPress={handleClearAllFilters}
                    className="bg-brand-black px-5 py-3 rounded-2xl active:scale-[0.98]"
                  >
                    <Text className="font-bebas text-sm text-white tracking-wider">RESET ALL FILTERS</Text>
                  </Pressable>
                </View>
              ) : (
                filteredSpots.map((spot) => (
                  <WanderRow
                    key={spot.id}
                    id={spot.id}
                    title={spot.title}
                    imageUri={spot.imageUri}
                    rating={spot.rating}
                    vibeTag={spot.vibeTag}
                    isFavorite={spot.isFavorite}
                    distance={spot.distance}
                    onPress={() => handleCardPress(spot.title)}
                    onToggleFavorite={() => toggleFavorite(spot.id)}
                  />
                ))
              )
            ) : (
              filteredPlans.length === 0 ? (
                <View className="bg-white p-8 rounded-3xl items-center border border-gray-100 mt-4">
                  <Ionicons name="search-outline" size={32} color="#D1D5DB" />
                  <Text className="font-bebas text-xl text-brand-black mt-3">NO PLANS FOUND</Text>
                  <Text className="font-montserrat text-xs text-gray-400 mt-1 text-center max-w-50 mb-4">
                    Try adjusting your search query, rating, duration, or budget filters.
                  </Text>
                  <Pressable
                    onPress={handleClearAllFilters}
                    className="bg-brand-black px-5 py-3 rounded-2xl active:scale-[0.98]"
                  >
                    <Text className="font-bebas text-sm text-white tracking-wider">RESET ALL FILTERS</Text>
                  </Pressable>
                </View>
              ) : (
                filteredPlans.map((plan) => (
                  <WanderRow
                    key={plan.id}
                    id={plan.id}
                    title={plan.title}
                    imageUri={plan.imageUri}
                    rating={plan.rating}
                    isFavorite={plan.isFavorite}
                    duration={plan.duration}
                    budget={plan.budget ? `$${plan.budget}` : undefined}
                    description={plan.overview}
                    onPress={() => handleCardPress(plan.title)}
                    onToggleFavorite={() => togglePlanFavorite(plan.id)}
                  />
                ))
              )
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
