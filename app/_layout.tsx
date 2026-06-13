import { BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue";
import { Montserrat_400Regular, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { useAssets } from "expo-asset";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack, usePathname, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AppState } from "react-native";
import BrandLoader from "../components/BrandLoader";
import { notificationService } from "../services/notificationService";
import { useNotificationStore } from "../store/useNotificationStore";
import { useWanderStore } from "../store/useWanderStore";
import { useProfileViewModel } from "../viewmodels/useProfileViewModel";
import "./global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    BebasNeue_400Regular,
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const [assets, assetsError] = useAssets([
    require("../assets/images/ui/welcome-hero.png"),
  ]);

  const isLoaded = fontsLoaded && assets;
  const isError = fontError || assetsError;

  useEffect(() => {
    if (isLoaded || isError) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded, isError]);

  if (!isLoaded && !isError) {
    return null;
  }

  return <RootLayoutContent />;
}

function RootLayoutContent() {
  const { profile, loading: profileLoading, reloadProfile } = useProfileViewModel();
  const initDatabase = useWanderStore((state) => state.initDatabase);
  const dbLoading = useWanderStore((state) => state.loading);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    reloadProfile();
    initDatabase();
  }, [reloadProfile, initDatabase]);

  // Notifications and AppState Listener Effect
  useEffect(() => {
    // 1. Request notifications permissions
    notificationService.registerForPushNotificationsAsync();

    // 2. Listen to received alerts when app is running (foreground or background)
    const receivedSubscription = Notifications.addNotificationReceivedListener((notification) => {
      const { title, body } = notification.request.content;
      if (title && body) {
        useNotificationStore.getState().addNotification(title, body);
      }
    });

    // 3. Listen to tapped notification events
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const { title, body } = response.notification.request.content;
      if (title && body) {
        useNotificationStore.getState().addNotification(title, body);
      }
      // Can redirect to home or explore if needed
    });

    // 4. Schedule randomized alerts when user suspends app to background
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "background") {
        notificationService.scheduleRandomEngagementAlerts();
      }
    };

    const appStateSubscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
      appStateSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (profileLoading || dbLoading) return;

    const isAtWelcomeOrOnboarding = pathname === "/" || pathname === "/onboarding";

    if (profile?.onboarded) {
      if (isAtWelcomeOrOnboarding) {
        router.replace("/(tabs)/home");
      }
    } else {
      // Redirect to welcome from any screen that isn't the welcome/onboarding flow
      if (!isAtWelcomeOrOnboarding) {
        router.replace("/");
      }
    }
  }, [profile, profileLoading, dbLoading, pathname, router]);

  if (profileLoading || dbLoading) {
    return <BrandLoader className="flex-1 bg-brand-offwhite" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

