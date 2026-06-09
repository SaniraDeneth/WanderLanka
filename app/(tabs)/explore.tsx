import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import CategoryCircle from "../../components/home/CategoryCircle";
import PopularDestinationRow from "../../components/home/DestinationRow";
import VibeChip from "../../components/home/VibeChip";
import ScreenWrapper from "../../components/ScreenWrapper";
import {
  useDestinationActions,
  useDestinationFilters,
  useFilteredDestinations,
} from "../../viewmodels/useDestinationViewModel";

const VIBES = ["NATURE", "CULTURE", "ADVENTURE"];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    categories,
    activeVibe,
    activeCategory,
    setActiveVibe,
    setActiveCategory,
  } = useDestinationFilters();

  const { toggleFavorite } = useDestinationActions();
  const destinations = useFilteredDestinations(searchQuery);

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
            placeholder="Search destinations..."
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

        {/* RESULTS COUNT & HEADER */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="font-bebas text-2xl text-brand-black">DESTINATIONS</Text>
          <Text className="font-montserrat-bold text-[10px] text-brand-green tracking-wider uppercase">
            {destinations.length} SPOTS FOUND
          </Text>
        </View>

        {/* DESTINATION LIST */}
        {destinations.length === 0 ? (
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
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}
