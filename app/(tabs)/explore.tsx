import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import WanderRow from "../../components/home/WanderRow";
import ScreenWrapper from "../../components/ScreenWrapper";
import ExploreFilterModal from "../../components/explore/ExploreFilterModal";
import { useExploreScreenData } from "../../viewmodels/useDestinationViewModel";
import { useFilterStore } from "../../store/useFilterStore";

export default function ExploreScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const searchInputRef = useRef<TextInput>(null);

  const focusRequested = useFilterStore((s) => s.exploreSearchFocusRequested);
  const setFocusRequested = useFilterStore((s) => s.setExploreSearchFocusRequested);

  React.useEffect(() => {
    if (focusRequested) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
        setFocusRequested(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [focusRequested, setFocusRequested]);

  const {
    isFiltersVisible,
    setIsFiltersVisible,
    scrollY,
    setScrollY,
    activeTab,
    searchQuery,
    setSearchQuery,
    filteredSpots,
    filteredPlans,
    hasActiveFilters,
    handleClearAllFilters,
    changeTab,
    toggleFavorite,
    togglePlanFavorite,
  } = useExploreScreenData();

  const handleTabChange = (tab: "SPOTS" | "PLANS") => {
    changeTab(tab);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

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
              ref={searchInputRef}
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

        {/* MODAL FILTERS DIALOG */}
        <ExploreFilterModal
          visible={isFiltersVisible}
          onClose={() => setIsFiltersVisible(false)}
          filteredSpotsCount={filteredSpots.length}
          filteredPlansCount={filteredPlans.length}
        />

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
