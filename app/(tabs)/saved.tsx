import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import WanderRow from "../../components/home/WanderRow";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useSavedScreenData } from "../../viewmodels/useDestinationViewModel";

export default function SavedScreen() {
  const {
    activeTab,
    setActiveTab,
    savedSpots,
    savedPlans,
    toggleFavorite,
    togglePlanFavorite,
  } = useSavedScreenData();

  const handleCardPress = (title: string) =>
    Alert.alert("Coming Soon", `${title} detail page coming in next phase.`);

  return (
    <ScreenWrapper bottomPadding={false}>
      {/* HEADER */}
      <View className="py-4 flex-row justify-between items-center">
        <View>
          <Text className="font-bebas text-4xl text-brand-black">SAVED BOOKMARKS</Text>
          <Text className="font-montserrat text-xs text-gray-400 mt-0.5 tracking-wider">
            YOUR PERSONAL COLLECTION OF PLACES & PLANS
          </Text>
        </View>
      </View>

      {/* TAB SWITCHER */}
      <View className="flex-row bg-gray-100/80 p-1 rounded-2xl mb-4">
        <Pressable
          onPress={() => setActiveTab("SPOTS")}
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
          onPress={() => setActiveTab("PLANS")}
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

      {/* LIST SCROLL CONTAINER */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View>
          {/* RESULTS COUNT & HEADER */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="font-bebas text-2xl text-brand-black">
              {activeTab === "SPOTS" ? "BOOKMARKED DESTINATIONS" : "BOOKMARKED TRAVEL PLANS"}
            </Text>
            <Text className="font-montserrat-bold text-[10px] text-brand-green tracking-wider uppercase">
              {activeTab === "SPOTS"
                ? `${savedSpots.length} SPOTS`
                : `${savedPlans.length} PLANS`}
            </Text>
          </View>

          {/* LIST RENDER */}
          {activeTab === "SPOTS" ? (
            savedSpots.length === 0 ? (
              <View className="bg-white p-8 rounded-3xl items-center border border-gray-100 mt-4">
                <Ionicons name="bookmark-outline" size={32} color="#D1D5DB" />
                <Text className="font-bebas text-xl text-brand-black mt-3">NO SAVED SPOTS</Text>
                <Text className="font-montserrat text-xs text-gray-400 mt-1 text-center max-w-[200px] mb-4">
                  {"Explore Sri Lanka's destinations and tap the heart icon to save spots here."}
                </Text>
              </View>
            ) : (
              savedSpots.map((spot) => (
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
            savedPlans.length === 0 ? (
              <View className="bg-white p-8 rounded-3xl items-center border border-gray-100 mt-4">
                <Ionicons name="bookmark-outline" size={32} color="#D1D5DB" />
                <Text className="font-bebas text-xl text-brand-black mt-3">NO SAVED PLANS</Text>
                <Text className="font-montserrat text-xs text-gray-400 mt-1 text-center max-w-[200px] mb-4">
                  Explore itineraries and tap the heart icon to save travel plans here.
                </Text>
              </View>
            ) : (
              savedPlans.map((plan) => (
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
    </ScreenWrapper>
  );
}
