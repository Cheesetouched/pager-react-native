import { useRef } from "react";
import { LogBox } from "react-native";

import { Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

  return (
    <AppContext.Provider value={{ alert: alertRef }}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />

          <Stack.Screen
            name="invite_options"
            options={{ presentation: "modal" }}
          />

          <Stack.Screen
            name="contact"
            options={{
              presentation: "modal",
              contentStyle: { backgroundColor: "#00000000" },
            }}
          />

          <Stack.Screen
            name="constraint"
            options={{ presentation: "transparentModal" }}
          />
        </Stack>
      </QueryClientProvider>

      <Alert ref={alertRef} />
    </AppContext.Provider>
  );
}
