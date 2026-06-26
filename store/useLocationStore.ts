import { create } from "zustand";
import { Logger } from "../utils/logger";
import * as Location from "expo-location";
import { Alert, Linking } from "react-native";

interface LocationState {
  userLatitude: number | null;
  userLongitude: number | null;
  permissionStatus: "undetermined" | "granted" | "denied";
  loading: boolean;

  setUserLocation: (latitude: number, longitude: number) => void;
  fetchUserLocation: (showDeniedAlert?: boolean) => Promise<void>;
}

function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  userLatitude: null,
  userLongitude: null,
  permissionStatus: "undetermined",
  loading: false,

  setUserLocation: (latitude, longitude) => {
    const currentLat = get().userLatitude;
    const currentLng = get().userLongitude;
    if (currentLat !== null && currentLng !== null) {
      const distance = getDistanceInKm(currentLat, currentLng, latitude, longitude);
      if (distance < 0.1) {
        return;
      }
    }
    set({ userLatitude: latitude, userLongitude: longitude });
  },

  fetchUserLocation: async (showDeniedAlert = true) => {
    set({ loading: true });
    try {
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      
      let status = existingStatus;
      if (existingStatus !== "granted") {
        const { status: requestStatus } = await Location.requestForegroundPermissionsAsync();
        status = requestStatus;
      }

      set({ permissionStatus: status === "granted" ? "granted" : "denied" });

      if (status !== "granted") {
        if (showDeniedAlert) {
          setTimeout(() => {
            Alert.alert(
              "Location Access Required",
              "WanderLanka needs location access to find and sort nearby spots. Please enable location permissions in your device settings.",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Open Settings", onPress: () => Linking.openSettings() }
              ]
            );
          }, 500);
        }
        get().setUserLocation(6.9271, 79.8612);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      get().setUserLocation(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      Logger.error("[Location Store] fetchUserLocation error:", error);
      set({ permissionStatus: "denied" });
      get().setUserLocation(6.9271, 79.8612);
    } finally {
      set({ loading: false });
    }
  },
}));
