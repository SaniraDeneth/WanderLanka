import { create } from "zustand";
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

export const useLocationStore = create<LocationState>((set, get) => ({
  userLatitude: null,
  userLongitude: null,
  permissionStatus: "undetermined",
  loading: false,

  setUserLocation: (latitude, longitude) => {
    console.log(`[Location Store] Store updated to: Lat=${latitude}, Lng=${longitude}`);
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
        console.log("[Location Store] Location permission denied. Using Colombo fallback.");
        get().setUserLocation(6.9271, 79.8612);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      console.log(`[Location Store] Live device coordinates: Lat=${location.coords.latitude}, Lng=${location.coords.longitude}`);
      get().setUserLocation(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error("[Location Store] fetchUserLocation error:", error);
      set({ permissionStatus: "denied" });
      get().setUserLocation(6.9271, 79.8612);
    } finally {
      set({ loading: false });
    }
  },
}));
