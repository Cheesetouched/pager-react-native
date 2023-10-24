import { useEffect } from "react";

import { SplashScreen, router } from "expo-router";
import { Lalezar_400Regular } from "@expo-google-fonts/lalezar";
import {
  useFonts,
  Cabin_400Regular,
  Cabin_400Regular_Italic,
  Cabin_600SemiBold,
  Cabin_700Bold,
} from "@expo-google-fonts/cabin";

import SafeView from "@components/SafeView";
import useFirebase from "@hooks/useFirebase";
import useLocalStorage from "@hooks/useLocalStorage";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { user } = useFirebase();
  const { getJson } = useLocalStorage();

  const [fontsLoaded] = useFonts({
    Lalezar_400Regular,
    Cabin_400Regular,
    Cabin_400Regular_Italic,
    Cabin_600SemiBold,
    Cabin_700Bold,
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
