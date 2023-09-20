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
import useLocalStorage from "@hooks/useLocalStorage";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { user } = useFirebase();
  const { getJson } = useLocalStorage();

  const [fontsLoaded] = useFonts({
    BarlowCondensed_700Bold,
    NunitoSans_400Regular,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded && user !== undefined) {
      if (user) {
        getJson("checkpoint").then((checkpoint) => {
          if (checkpoint) {
            router.replace(checkpoint);
          } else {
            router.replace("/home");
          }
        });
      } else {
        router.replace("/handle");
      }
    }
  }, [fontsLoaded, getJson, user]);

  return <SafeView />;
}
