import { useEffect, useRef, useState } from "react";
import { AppState, LogBox } from "react-native";

import { Stack } from "expo-router";
import { Mixpanel } from "mixpanel-react-native";
import * as Notifications from "expo-notifications";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from "@tanstack/react-query";

import tw from "@utils/tailwind";
import Alert from "@components/Alert";
import AppContext from "@utils/context";
import constants from "@utils/constants";

LogBox.ignoreAllLogs();
const queryClient = new QueryClient();
const mixpanel = new Mixpanel(constants.MIXPANEL_PROJECT_TOKEN, true);
mixpanel.init();

if (__DEV__) {
  mixpanel.optOutTracking();
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Layout() {
  const alertRef = useRef();
  const responseListener = useRef();
  const [appState, setAppState] = useState(null);

  useEffect(() => {
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        ({ notification }) => {
          if (notification?.request?.content?.data?.event) {
            mixpanel.track(notification?.request?.content?.data?.event);
          }

          mixpanel.track("tapped_notification");
        },
      );

    const subscription = AppState.addEventListener("change", (status) => {
      setAppState(status);
      focusManager.setFocused(status === "active");
    });

    return () => {
      subscription.remove();
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <GestureHandlerRootView style={tw`flex-1`}>
      <BottomSheetModalProvider>
        <AppContext.Provider value={{ appState, alert: alertRef, mixpanel }}>
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

              <Stack.Screen
                name="(context)/welcome_context"
                options={{ presentation: "fullScreenModal" }}
              />

              <Stack.Screen
                name="(context)/status_context"
                options={{ presentation: "fullScreenModal" }}
              />
            </Stack>
          </QueryClientProvider>

          <Alert ref={alertRef} />
        </AppContext.Provider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
