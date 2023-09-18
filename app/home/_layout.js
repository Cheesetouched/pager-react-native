import { useEffect } from "react";

import { SplashScreen, Slot } from "expo-router";

import SafeView from "@components/SafeView";

export default function Layout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeView>
      <Slot />
    </SafeView>
  );
}
