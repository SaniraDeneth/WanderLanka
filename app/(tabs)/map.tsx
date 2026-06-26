import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Image, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Callout, Marker, PROVIDER_DEFAULT } from "react-native-maps";
import BrandLoader from "../../components/BrandLoader";
import Button from "../../components/Button";
import ScreenWrapper from "../../components/ScreenWrapper";
import { getHaversineDistance } from "../../store/useWanderStore";
import { getLocalImage } from "../../utils/imageMap";
import { Logger } from "../../utils/logger";
import { useMapScreenData } from "../../viewmodels/useDestinationViewModel";

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
  const [mapReady, setMapReady] = useState(false);

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

  useEffect(() => {
    // Delay rendering the MapView slightly until transition finishes to avoid navigation lag
    const timer = setTimeout(() => {
      setMapReady(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Compute selected spot distance on demand
  const selectedSpotDistanceText = useMemo(() => {
    if (!selectedSpot || userLatitude === null || userLongitude === null) return "N/A";
    const dist = getHaversineDistance(
      userLatitude,
      userLongitude,
      selectedSpot.latitude,
      selectedSpot.longitude
    );
    return `${dist.toFixed(1)} KM`;
  }, [selectedSpot, userLatitude, userLongitude]);

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
      Logger.error("Failed to open directions link:", err);
      Alert.alert("Error", "Could not launch map directions.");
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
      <View className="flex-1 overflow-hidden relative">
        {mapReady ? (
          <MapView
            ref={mapRef}
            provider={PROVIDER_DEFAULT}
            style={StyleSheet.absoluteFillObject}
            initialRegion={SRI_LANKA_CENTER}
            showsUserLocation={true}
            showsMyLocationButton={true}
            showsCompass={false}
            onPress={(e) => {
              // Only clear the selected spot if the user clicked on the map itself, not a marker
              if (e.nativeEvent && e.nativeEvent.action !== 'marker-press') {
                setSelectedSpot(null);
              }
            }}
          >
            {destinations.map((dest) => (
              <Marker
                key={dest.id}
                coordinate={{ latitude: dest.latitude, longitude: dest.longitude }}
                pinColor="green"
                onPress={(e) => {
                  if (e && e.stopPropagation) {
                    e.stopPropagation();
                  }
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
                <Callout tooltip={true}>
                  <View />
                </Callout>
              </Marker>
            ))}
          </MapView>
        ) : (
          <BrandLoader className="flex-1 bg-brand-offwhite" />
        )}

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
                    {selectedSpotDistanceText} away
                  </Text>
                </View>
              </View>
            </View>

            {/* Bottom Row: Actions */}
            <View className="flex-row items-center gap-2">
              <View className="flex-1">
                <Button
                  title="GET DIRECTIONS"
                  onPress={() => handleGetDirections(selectedSpot.latitude, selectedSpot.longitude)}
                  className="bg-brand-green py-2 px-0 w-full"
                  textClassName="text-xl text-brand-black tracking-wider"
                />
              </View>

              <View className="flex-1">
                <Button
                  title="VIEW DETAILS"
                  onPress={() => handleCardPress(selectedSpot.id, "SPOT")}
                  className="bg-brand-black py-2 px-0 w-full"
                  textClassName="text-xl text-white tracking-wider"
                />
              </View>
            </View>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}
