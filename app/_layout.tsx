import { BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue";
import { Montserrat_400Regular, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { useAssets } from "expo-asset";
import { useFonts } from "expo-font";
import { Stack, usePathname, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import BrandLoader from "../components/BrandLoader";
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
    require("../assets/images/welcome-hero.png"),
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
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    reloadProfile();
  }, [reloadProfile]);

  useEffect(() => {
    if (profileLoading) return;

    const isAtWelcomeOrOnboarding = pathname === "/" || pathname === "/onboarding";

    if (profile?.onboarded) {
      if (isAtWelcomeOrOnboarding) {
        router.replace("/home");
      }
    } else {
      if (pathname === "/home") {
        router.replace("/");
      }
    }
  }, [profile, profileLoading, pathname, router]);

  if (profileLoading) {
    return <BrandLoader className="flex-1 bg-brand-offwhite" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
