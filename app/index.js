import { useEffect } from "react";

import { SplashScreen, router } from "expo-router";
import { BarlowCondensed_700Bold } from "@expo-google-fonts/barlow-condensed";
import {
  useFonts,
  NunitoSans_400Regular,
  NunitoSans_700Bold,
  NunitoSans_800ExtraBold,
} from "@expo-google-fonts/nunito-sans";

import SafeView from "@components/SafeView";
import useFirebase from "@hooks/useFirebase";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { user } = useFirebase();

  const [fontsLoaded] = useFonts({
    BarlowCondensed_700Bold,
    NunitoSans_400Regular,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded && user !== undefined) {
      if (user) {
        router.replace("/home");
      } else {
        router.replace("/onboarding/handle");
      }
    }
  }, [fontsLoaded, user]);

  return <SafeView />;
}
