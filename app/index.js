import { useEffect } from "react";

import { SplashScreen, router } from "expo-router";

import SafeView from "@components/SafeView";
import useFirebase from "@hooks/useFirebase";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { user } = useFirebase();

  useEffect(() => {
    if (user !== undefined) {
      if (user) {
        router.replace("/home");
      } else {
        router.replace("/onboarding/handle");
      }
    }
  }, [user]);

  return <SafeView />;
}
