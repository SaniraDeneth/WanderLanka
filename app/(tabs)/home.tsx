import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import { dbService } from "../../services/dbService";
import { useDestinationStore } from "../../store/useDestinationStore";
import { useProfileViewModel } from "../../viewmodels/useProfileViewModel";

export default function HomeScreen() {
  const router = useRouter();
  const { profile, clearProfile } = useProfileViewModel();

  // Zustand Store states & actions
  const categories = useDestinationStore((state) => state.categories);
  const destinations = useDestinationStore((state) => state.destinations);
  const plans = useDestinationStore((state) => state.plans);
  const loadData = useDestinationStore((state) => state.loadData);
  const toggleFavorite = useDestinationStore((state) => state.toggleFavorite);
  const togglePlanFavorite = useDestinationStore((state) => state.togglePlanFavorite);
  const setUserLocation = useDestinationStore((state) => state.setUserLocation);
  const getSortedDestinations = useDestinationStore((state) => state.getSortedDestinations);
  const latitude = useDestinationStore((state) => state.userLatitude);
  const longitude = useDestinationStore((state) => state.userLongitude);

  // Set user mock location on mount to Colombo (6.9271, 79.8612) to test Haversine sorting
  useEffect(() => {
    setUserLocation(6.9271, 79.8612);
    console.log("latitude", latitude);
    console.log("longitude", longitude);
  }, [setUserLocation]);

  const sortedDestinations = getSortedDestinations(destinations);

  const handleReset = async () => {
    try {
      await clearProfile();
      router.replace("/");
    } catch (e) {
      console.error(e);
    }
  };

  // Insert Hikkaduwa Beach (Beaches category)
  const handleAddHikkaduwa = async () => {
    try {
      const db = await dbService.getDb();
      // Search for BEAHCES category ID
      const categoryRow = await db.getFirstAsync<{ id: number }>(
        "SELECT id FROM categories WHERE name = 'BEACHES';"
      );
      const catId = categoryRow?.id || 1;

      await db.runAsync(
        `INSERT INTO destinations (title, description, category_id, vibe_tag, latitude, longitude, image_uri, rating, entry_fee, is_favorite)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0);`,
        "HIKKADUWA CORAL REEF",
        "Famous for shallow coral reefs and wild sea turtles swimming close to the beach.",
        catId,
        "NATURE",
        6.1396,
        80.1012,
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=300",
        4.6,
        "FREE"
      );

      await loadData();
      Alert.alert("Success", "Inserted 'HIKKADUWA CORAL REEF' into SQLite database!");
    } catch (error) {
      console.error("Failed to insert dummy destination:", error);
      Alert.alert("Error", "Could not write to SQLite.");
    }
  };

  // Insert Adam's Peak (Mountains category)
  const handleAddAdamsPeak = async () => {
    try {
      const db = await dbService.getDb();
      const categoryRow = await db.getFirstAsync<{ id: number }>(
        "SELECT id FROM categories WHERE name = 'MOUNTAINS';"
      );
      const catId = categoryRow?.id || 2;

      await db.runAsync(
        `INSERT INTO destinations (title, description, category_id, vibe_tag, latitude, longitude, image_uri, rating, entry_fee, is_favorite)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0);`,
        "ADAM'S PEAK (SRI PADA)",
        "A sacred 2,243m peak holding the footprint of the Buddha, Shiva, or Adam depending on tradition.",
        catId,
        "ADVENTURE",
        6.8096,
        80.4994,
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=300",
        4.9,
        "FREE"
      );

      await loadData();
      Alert.alert("Success", "Inserted 'ADAM'S PEAK' into SQLite database!");
    } catch (error) {
      console.error("Failed to insert dummy destination:", error);
      Alert.alert("Error", "Could not write to SQLite.");
    }
  };

  return (
    <ScreenWrapper showGradients={true}>
      <ScrollView contentContainerStyle={{ padding: 16 }} className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-gray-500 text-xs font-montserrat">HELLO, GOOD MORNING</Text>
            <Text className="font-bebas text-3xl text-brand-black uppercase">
              {profile?.name || "EXPLORER"}
            </Text>
          </View>
          <Pressable
            onPress={handleReset}
            className="w-10 h-10 bg-white border border-gray-100 rounded-full items-center justify-center shadow-sm"
          >
            <Ionicons name="log-out-outline" size={18} color="#FF3B30" />
          </Pressable>
        </View>

        {/* Database Control Buttons */}
        <View className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
          <Text className="font-montserrat-bold text-xs text-brand-green uppercase mb-3">
            SQLite Controls (Add Dummy Spots)
          </Text>
          <View className="flex-row justify-between flex-wrap gap-2">
            <Pressable
              onPress={handleAddHikkaduwa}
              className="bg-brand-green py-2.5 px-4 rounded-xl flex-1 min-w-35 items-center"
            >
              <Text className="text-brand-black font-montserrat-bold text-xs">
                + Hikkaduwa Coral
              </Text>
            </Pressable>
            <Pressable
              onPress={handleAddAdamsPeak}
              className="bg-brand-black py-2.5 px-4 rounded-xl flex-1 min-w-35 items-center"
            >
              <Text className="text-white font-montserrat-bold text-xs">
                + Adam&apos;s Peak
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Categories Section */}
        <View className="mb-6">
          <Text className="font-bebas text-lg tracking-wider text-brand-black mb-3">
            Seeded Categories ({categories.length})
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {categories.map((cat) => (
              <View
                key={cat.id}
                className="bg-white border border-gray-100 rounded-full py-1.5 px-4 mr-2"
              >
                <Text className="font-montserrat text-xs text-brand-black">{cat.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Destinations Section */}
        <View className="mb-6">
          <Text className="font-bebas text-lg tracking-wider text-brand-black mb-1">
            Seeded Destinations ({destinations.length})
          </Text>
          <Text className="text-gray-400 text-[10px] font-montserrat mb-3">
            Sorted by Haversine distance from Colombo (6.9271° N, 79.8612° E)
          </Text>

          {sortedDestinations.map((dest) => (
            <View
              key={dest.id}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-3 flex-row justify-between items-center"
            >
              <View className="flex-1 mr-4">
                <Text className="font-bebas text-base text-brand-black">{dest.title}</Text>
                <Text className="text-gray-500 font-montserrat text-xs mt-1" numberOfLines={2}>
                  {dest.description}
                </Text>
                <View className="flex-row items-center mt-2 flex-wrap gap-2">
                  <View className="bg-gray-100 px-2 py-0.5 rounded-md">
                    <Text className="text-[10px] text-gray-600 font-montserrat-bold uppercase">
                      {dest.vibeTag}
                    </Text>
                  </View>
                  <Text className="text-[11px] text-brand-green font-montserrat-bold">
                    {dest.rating} ⭐
                  </Text>
                  <Text className="text-[11px] text-gray-400 font-montserrat">
                    ~{dest.distance} KM away
                  </Text>
                  <Text className="text-[11px] text-gray-400 font-montserrat-bold">
                    • {dest.entryFee}
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => toggleFavorite(dest.id)}
                className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center"
              >
                <Ionicons
                  name={dest.isFavorite ? "heart" : "heart-outline"}
                  size={20}
                  color={dest.isFavorite ? "#FF3B30" : "#9CA3AF"}
                />
              </Pressable>
            </View>
          ))}
        </View>

        {/* Plans Section */}
        <View className="mb-10">
          <Text className="font-bebas text-lg tracking-wider text-brand-black mb-3">
            Seeded Travel Plans ({plans.length})
          </Text>
          {plans.map((plan) => (
            <View
              key={plan.id}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-3 flex-row justify-between items-center"
            >
              <View className="flex-1 mr-4">
                <Text className="font-bebas text-base text-brand-black">{plan.title}</Text>
                <Text className="text-gray-500 font-montserrat text-xs mt-1">{plan.overview}</Text>
                <View className="flex-row items-center justify-between mt-3">
                  <Text className="text-[11px] text-brand-green font-montserrat-bold">
                    Duration: {plan.duration}
                  </Text>
                  <Text className="text-[11px] text-gray-400 font-montserrat">
                    Rating: {plan.rating} ⭐
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => togglePlanFavorite(plan.id)}
                className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center"
              >
                <Ionicons
                  name={plan.isFavorite ? "heart" : "heart-outline"}
                  size={20}
                  color={plan.isFavorite ? "#FF3B30" : "#9CA3AF"}
                />
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

