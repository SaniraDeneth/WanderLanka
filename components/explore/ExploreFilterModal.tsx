import React from "react";
import {
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FilterChip from "../home/FilterChip";
import { useFilterStore } from "../../store/useFilterStore";
import { useLocationStore } from "../../store/useLocationStore";
import {
  useExploreFilters,
  useDestinationActions,
} from "../../viewmodels/useDestinationViewModel";

const VIBES = ["NATURE", "CULTURE", "ADVENTURE"];

interface ExploreFilterModalProps {
  visible: boolean;
  onClose: () => void;
  filteredSpotsCount: number;
  filteredPlansCount: number;
}

export default function ExploreFilterModal({
  visible,
  onClose,
  filteredSpotsCount,
  filteredPlansCount,
}: ExploreFilterModalProps) {
  const activeTab = useFilterStore((s) => s.exploreActiveTab);

  // Tab-specific filters retrieved from store
  const spotsMinRating = useFilterStore((s) => s.exploreSpotsMinRating);
  const setSpotsMinRating = useFilterStore((s) => s.setExploreSpotsMinRating);
  const plansMinRating = useFilterStore((s) => s.explorePlansMinRating);
  const setPlansMinRating = useFilterStore((s) => s.setExplorePlansMinRating);

  const spotsSortOrder = useFilterStore((s) => s.exploreSpotsSortOrder);
  const setSpotsSortOrder = useFilterStore((s) => s.setExploreSpotsSortOrder);
  const plansSortOrder = useFilterStore((s) => s.explorePlansSortOrder);
  const setPlansSortOrder = useFilterStore((s) => s.setExplorePlansSortOrder);

  const spotsSortBy = useFilterStore((s) => s.exploreSpotsSortBy);
  const setSpotsSortBy = useFilterStore((s) => s.setExploreSpotsSortBy);
  const plansSortBy = useFilterStore((s) => s.explorePlansSortBy);
  const setPlansSortBy = useFilterStore((s) => s.setExplorePlansSortBy);

  // Resolve active states based on activeTab
  const minRating = activeTab === "SPOTS" ? spotsMinRating : plansMinRating;
  const setMinRating = activeTab === "SPOTS" ? setSpotsMinRating : setPlansMinRating;
  const sortOrder = activeTab === "SPOTS" ? spotsSortOrder : plansSortOrder;
  const setSortOrder = activeTab === "SPOTS" ? setSpotsSortOrder : setPlansSortOrder;
  const sortBy = activeTab === "SPOTS" ? spotsSortBy : plansSortBy;

  const maxDistance = useFilterStore((s) => s.exploreMaxDistance);
  const setMaxDistance = useFilterStore((s) => s.setExploreMaxDistance);
  const maxDays = useFilterStore((s) => s.exploreMaxDays);
  const setMaxDays = useFilterStore((s) => s.setExploreMaxDays);
  const maxBudget = useFilterStore((s) => s.exploreMaxBudget);
  const setMaxBudget = useFilterStore((s) => s.setExploreMaxBudget);
  const resetExploreFilters = useFilterStore((s) => s.resetExploreFilters);

  const {
    categories,
    activeVibe,
    activeCategory,
    setActiveVibe,
    setActiveCategory,
  } = useExploreFilters();

  const { fetchUserLocation } = useDestinationActions();
  const permissionStatus = useLocationStore((s) => s.permissionStatus);

  const handleClearAllFilters = () => {
    resetExploreFilters();
  };

  const currentCount = activeTab === "SPOTS" ? filteredSpotsCount : filteredPlansCount;
  const noMatches = currentCount === 0;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-end"
        onPress={onClose}
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
                    ? `${filteredSpotsCount} SPOTS MATCHED`
                    : `${filteredPlansCount} PLANS MATCHED`}
                </Text>
              </View>
              <Pressable
                onPress={onClose}
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
              {noMatches && (
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
                        onChangeText={(val) => {
                          setMaxDistance(val ? parseFloat(val) : null);
                          if (val && permissionStatus !== "granted") {
                            fetchUserLocation();
                          }
                        }}
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
                {/* SORT BY SECTION */}
                <Text className="font-montserrat-bold text-[10px] text-gray-400 mb-1.5 uppercase tracking-wider">
                  SORT BY
                </Text>
                <View className="flex-row gap-2 mb-3">
                  <FilterChip
                    label="NAME"
                    isActive={sortBy === "name"}
                    onPress={() => {
                      if (activeTab === "SPOTS") {
                        setSpotsSortBy("name");
                      } else {
                        setPlansSortBy("name");
                      }
                    }}
                  />
                  {activeTab === "SPOTS" && (
                    <FilterChip
                      label="DISTANCE"
                      isActive={sortBy === "distance"}
                      onPress={() => {
                        setSpotsSortBy("distance");
                        if (permissionStatus !== "granted") {
                          fetchUserLocation();
                        }
                      }}
                    />
                  )}
                  <FilterChip
                    label="RATING"
                    isActive={sortBy === "rating"}
                    onPress={() => {
                      if (activeTab === "SPOTS") {
                        setSpotsSortBy("rating");
                      } else {
                        setPlansSortBy("rating");
                      }
                    }}
                  />
                </View>

                {/* SORT DIRECTION SECTION */}
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
              </View>
            </ScrollView>

            {/* Footer Action Button */}
            <View className="border-t border-gray-150 pt-4">
              <Pressable
                onPress={onClose}
                className="bg-brand-black py-4 rounded-2xl items-center justify-center active:scale-[0.98]"
              >
                <Text className="font-bebas text-lg text-white tracking-wider">
                  APPLY FILTERS ({activeTab === "SPOTS" ? `${filteredSpotsCount} SPOTS FOUND` : `${filteredPlansCount} PLANS FOUND`})
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
