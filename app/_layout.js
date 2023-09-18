import { Stack } from "expo-router";
import { LogBox } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

LogBox.ignoreAllLogs();
const queryClient = new QueryClient();

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
