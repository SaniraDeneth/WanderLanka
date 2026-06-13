import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { useRouter } from "expo-router";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useMapScreenData } from "../../viewmodels/useDestinationViewModel";
import { getLocalImage } from "../../utils/imageMap";

// Default map boundaries centered on Sri Lanka
const SRI_LANKA_CENTER = {
  latitude: 7.8731,
  longitude: 80.7718,
  latitudeDelta: 2.8,
  longitudeDelta: 2.8,
};

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);

  const {
    userLatitude,
    userLongitude,
    destinations,
    permissionStatus,
    fetchUserLocation,
  } = useMapScreenData();

  useEffect(() => {
    fetchUserLocation();
  }, [fetchUserLocation]);

  const handleCenterUser = () => {
    if (permissionStatus !== "granted") {
      fetchUserLocation();
    } else if (userLatitude !== null && userLongitude !== null) {
      mapRef.current?.animateToRegion(
        {
          latitude: userLatitude,
          longitude: userLongitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    } else {
      Alert.alert("GPS Loading", "Fetching your exact coordinates...");
      fetchUserLocation();
    }
  };

  const handleCardPress = (id: number, type: "SPOT" | "PLAN") => {
    router.push({
      pathname: "/details",
      params: { id, type }
    });
  };

  const handleGetDirections = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    Linking.openURL(url).catch((err) => {
      console.error("Failed to open directions link:", err);
      Alert.alert("Directions Error", "Could not launch map directions.");
    });
  };

  return (
    <ScreenWrapper bottomPadding={false} className="px-0">
      {/* HEADER */}
      <View className="py-4 flex-row justify-between items-center px-4">
        <View>
          <Text className="font-bebas text-4xl text-brand-black">DESTINATION MAP</Text>
          <Text className="font-montserrat text-xs text-gray-400 mt-0.5 tracking-wider uppercase">
            {destinations.length} Spots loaded across Sri Lanka
          </Text>
        </View>
      </View>

      {/* MAP VIEW CONTAINER */}
      <View className="flex-1 overflow-hidden border border-gray-150 shadow-md relative">
        <MapView
          ref={mapRef}
          provider={PROVIDER_DEFAULT}
          style={StyleSheet.absoluteFillObject}
          initialRegion={SRI_LANKA_CENTER}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={false}
          onPress={() => setSelectedSpot(null)}
        >
          {destinations.map((dest) => (
            <Marker
              key={dest.id}
              coordinate={{ latitude: dest.latitude, longitude: dest.longitude }}
              onPress={(e) => {
                e.stopPropagation();
                setSelectedSpot(dest);
                // Animate and center to marker coordinates
                mapRef.current?.animateToRegion(
                  {
                    latitude: dest.latitude,
                    longitude: dest.longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
                  },
                  500
                );
              }}
            >
              <View className="items-center justify-center">
                <View className="bg-brand-black border border-brand-green/30 p-2 rounded-full shadow-lg">
                  <Ionicons name="compass" size={14} color="#A8D030" />
                </View>
                <View className="w-1.5 h-1.5 bg-brand-green rounded-full -mt-0.5 shadow-sm" />
              </View>
            </Marker>
          ))}
        </MapView>

        {/* FLOATING GPS CENTER BUTTON */}
        <Pressable
          onPress={handleCenterUser}
          className="absolute right-4 w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg border border-gray-150 z-40"
          style={{
            bottom: selectedSpot ? 165 : 16,
          }}
        >
          <Ionicons
            name="compass-outline"
            size={22}
            color={permissionStatus === "granted" ? "#228B22" : "#9CA3AF"}
          />
        </Pressable>

        {/* SPOT DETAILS OVERLAY CARD */}
        {selectedSpot && (
          <View
            className="absolute left-4 right-4 bottom-4 bg-white rounded-3xl p-4 border border-gray-100 shadow-2xl z-50"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
            }}
          >
            {/* Close Button - positioned absolutely at top right */}
            <Pressable
              onPress={() => setSelectedSpot(null)}
              className="absolute top-3 right-3 w-8 h-8 bg-gray-100 rounded-full items-center justify-center z-50"
              hitSlop={8}
            >
              <Ionicons name="close" size={16} color="#4B5563" />
            </Pressable>

            {/* Top Row: Thumbnail and Content */}
            <View className="flex-row items-center mb-3">
              {/* Image Thumbnail */}
              <Image
                source={getLocalImage(selectedSpot.imageUri)}
                className="w-16 h-16 rounded-2xl bg-gray-100 mr-4"
                resizeMode="cover"
              />
              {/* Details Content */}
              <View className="flex-1 mr-8">
                <Text className="font-bebas text-xl text-brand-black tracking-wider leading-none mb-1">
                  {selectedSpot.title}
                </Text>
                <Text className="font-montserrat-bold text-[9px] text-brand-green tracking-widest uppercase mb-1">
                  {selectedSpot.vibeTag}
                </Text>
                <View className="flex-row items-center gap-2">
                  <Text className="font-montserrat-bold text-xs text-brand-black">
                    ★ {selectedSpot.rating.toFixed(1)}
                  </Text>
                  <Text className="text-[10px] font-montserrat text-gray-400">
                    {selectedSpot.distance} km away
                  </Text>
                </View>
              </View>
            </View>

            {/* Bottom Row: Actions */}
            <View className="flex-row items-center gap-2">
              <Pressable
                onPress={() => handleGetDirections(selectedSpot.latitude, selectedSpot.longitude)}
                className="flex-1 bg-brand-green py-2.5 rounded-xl flex-row items-center justify-center gap-1.5 active:scale-[0.98]"
              >
                <Ionicons name="navigate" size={14} color="#000000" />
                <Text className="font-bebas text-md text-brand-black tracking-wider">
                  GET DIRECTIONS
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleCardPress(selectedSpot.id, "SPOT")}
                className="flex-1 bg-brand-black py-2.5 rounded-xl flex-row items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Text className="font-bebas text-md text-white tracking-wider">
                  VIEW DETAILS
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}
