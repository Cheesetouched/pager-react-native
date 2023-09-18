import { useRef } from "react";
import { LogBox } from "react-native";

import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Alert from "@components/Alert";
import AppContext from "@utils/context";

LogBox.ignoreAllLogs();
const queryClient = new QueryClient();

export default function Layout() {
  const alertRef = useRef();

  return (
    <AppContext.Provider value={{ alert: alertRef }}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </QueryClientProvider>

      <Alert ref={alertRef} />
    </AppContext.Provider>
  );
}
