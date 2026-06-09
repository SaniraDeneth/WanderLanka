import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import CategoryCircle from "../../components/home/CategoryCircle";
import PopularDestinationRow from "../../components/home/DestinationRow";
import VibeChip from "../../components/home/VibeChip";
import ScreenWrapper from "../../components/ScreenWrapper";
import WanderCard from "../../components/home/WanderCard";
import {
  useDestinationActions,
  useDestinationFilters,
  useFilteredDestinations,
  useFilteredPlans,
} from "../../viewmodels/useDestinationViewModel";

const VIBES = ["NATURE", "CULTURE", "ADVENTURE"];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"SPOTS" | "PLANS">("SPOTS");

  const {
    categories,
    activeVibe,
    activeCategory,
    setActiveVibe,
    setActiveCategory,
  } = useDestinationFilters();

  const { toggleFavorite, togglePlanFavorite } = useDestinationActions();
  const destinations = useFilteredDestinations(searchQuery);
  const plans = useFilteredPlans(searchQuery);

  const handleCardPress = (title: string) =>
    Alert.alert("Coming Soon", `${title} detail page coming in next phase.`);

  return (
    <ScreenWrapper bottomPadding={false}>
      {/* HEADER */}
      <View className="py-4">
        <Text className="font-bebas text-4xl text-brand-black">EXPLORE</Text>
        <Text className="font-montserrat text-xs text-gray-400 mt-0.5 tracking-wider">
          FIND YOUR NEXT ADVENTURE IN SRI LANKA
        </Text>
      </View>

      {/* TAB SWITCHER */}
      <View className="flex-row bg-gray-100/80 p-1 rounded-2xl mb-4">
        <Pressable
          onPress={() => {
            setActiveTab("SPOTS");
            setSearchQuery("");
          }}
          className={`flex-1 py-3 rounded-xl items-center justify-center ${
            activeTab === "SPOTS" ? "bg-brand-black" : "bg-transparent"
          }`}
        >
          <Text
            className={`font-bebas text-lg tracking-wider ${
              activeTab === "SPOTS" ? "text-white" : "text-gray-500"
            }`}
          >
            SPOTS
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setActiveTab("PLANS");
            setSearchQuery("");
          }}
          className={`flex-1 py-3 rounded-xl items-center justify-center ${
            activeTab === "PLANS" ? "bg-brand-black" : "bg-transparent"
          }`}
        >
          <Text
            className={`font-bebas text-lg tracking-wider ${
              activeTab === "PLANS" ? "text-white" : "text-gray-500"
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
          className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 "
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

      {/* FILTERS & LIST SCROLL CONTAINER */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        {activeTab === "SPOTS" && (
          <>
            {/* VIBE FILTER */}
            <View className="mb-5">
              <Text className="font-bebas text-2xl mb-2.5">
                SELECT VIBE
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {VIBES.map((vibe) => (
                  <VibeChip
                    key={vibe}
                    label={vibe}
                    isActive={activeVibe?.toUpperCase() === vibe}
                    onPress={() => setActiveVibe(vibe)}
                  />
                ))}
              </ScrollView>
            </View>

            {/* CATEGORY FILTER */}
            <View className="mb-6">
              <Text className="font-bebas text-2xl mb-2.5">
                CATEGORIES
              </Text>
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
          </>
        )}

        {/* RESULTS COUNT & HEADER */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="font-bebas text-2xl text-brand-black">
            {activeTab === "SPOTS" ? "DESTINATIONS" : "TRAVEL PLANS"}
          </Text>
          <Text className="font-montserrat-bold text-[10px] text-brand-green tracking-wider uppercase">
            {activeTab === "SPOTS"
              ? `${destinations.length} SPOTS FOUND`
              : `${plans.length} PLANS FOUND`}
          </Text>
        </View>

        {/* DESTINATION / PLANS LIST */}
        {activeTab === "SPOTS" ? (
          destinations.length === 0 ? (
            <View className="bg-white p-8 rounded-3xl items-center border border-gray-100 mt-4">
              <Ionicons name="search-outline" size={32} color="#D1D5DB" />
              <Text className="font-bebas text-xl text-brand-black mt-3">NO RESULTS FOUND</Text>
              <Text className="font-montserrat text-xs text-gray-400 mt-1 text-center max-w-50">
                Try adjusting your vibe, category, or search filters.
              </Text>
            </View>
          ) : (
            destinations.map((spot) => (
              <PopularDestinationRow
                key={spot.id}
                id={spot.id}
                title={spot.title}
                imageUri={spot.imageUri}
                rating={spot.rating}
                vibeTag={spot.vibeTag}
                isFavorite={spot.isFavorite}
                onPress={() => handleCardPress(spot.title)}
                onToggleFavorite={() => toggleFavorite(spot.id)}
              />
            ))
          )
        ) : (
          plans.length === 0 ? (
            <View className="bg-white p-8 rounded-3xl items-center border border-gray-100 mt-4">
              <Ionicons name="search-outline" size={32} color="#D1D5DB" />
              <Text className="font-bebas text-xl text-brand-black mt-3">NO RESULTS FOUND</Text>
              <Text className="font-montserrat text-xs text-gray-400 mt-1 text-center max-w-50">
                Try searching for another travel plan.
              </Text>
            </View>
          ) : (
            plans.map((plan) => (
              <WanderCard
                key={plan.id}
                id={plan.id}
                title={plan.title}
                imageUri={plan.imageUri}
                rating={plan.rating}
                isFavorite={plan.isFavorite}
                duration={plan.duration}
                overview={plan.overview}
                onPress={() => handleCardPress(plan.title)}
                onToggleFavorite={() => togglePlanFavorite(plan.id)}
              />
            ))
          )
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}
