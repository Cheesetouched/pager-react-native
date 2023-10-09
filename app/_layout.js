import { useEffect, useRef, useState } from "react";
import { AppState, LogBox } from "react-native";

import { Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from "@tanstack/react-query";

import Alert from "@components/Alert";
import AppContext from "@utils/context";

LogBox.ignoreAllLogs();
const queryClient = new QueryClient();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Layout() {
  const alertRef = useRef();
  const [appState, setAppState] = useState(null);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (status) => {
      setAppState(status);
      focusManager.setFocused(status === "active");
    });

    return () => subscription.remove();
  }, []);

  return (
    <AppContext.Provider value={{ appState, alert: alertRef }}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />

          <Stack.Screen
            name="contact"
            options={{
              presentation: "modal",
              contentStyle: { backgroundColor: "#00000000" },
            }}
          />

          <Stack.Screen
            name="pages"
            options={{
              presentation: "modal",
              contentStyle: { backgroundColor: "#00000000" },
            }}
          />

          <Stack.Screen
            name="requests"
            options={{
              presentation: "modal",
              contentStyle: { backgroundColor: "#00000000" },
            }}
          />

          <Stack.Screen
            name="page"
            options={{ presentation: "transparentModal" }}
          />
        </Stack>
      </QueryClientProvider>

      <Alert ref={alertRef} />
    </AppContext.Provider>
  );
}
