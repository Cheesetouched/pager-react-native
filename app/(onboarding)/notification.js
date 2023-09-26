import { useCallback, useEffect } from "react";
import { Linking, Text, View } from "react-native";

import {
  SplashScreen,
  useLocalSearchParams,
  useRootNavigation,
} from "expo-router";

import tw from "@utils/tailwind";
import Button from "@components/Button";
import SafeView from "@components/SafeView";
import useAppContext from "@hooks/useAppContext";
import useNotifications from "@hooks/useNotifications";

export default function Notification() {
  const { alert } = useAppContext();
  const params = useLocalSearchParams();
  const navigation = useRootNavigation();

  const onDenied = useCallback(() => {
    alert.current.show({
      title: "oops 😕",
      message:
        "without notifications, we cannot notify you when your friends are free",
    });
  }, [alert]);

  const onGranted = useCallback(
    (pushToken) => {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "(onboarding)/process",
            params: {
              ...params,
              pushToken,
            },
          },
        ],
      });
    },
    [navigation, params],
  );

  const { loading, permission, requestNotifications } = useNotifications({
    onDenied,
    onGranted,
  });

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeView>
      <View style={tw`flex flex-1 px-4 pt-4`}>
        <Text
          style={tw.style(`flex text-text-1 text-3xl font-medium self-center`, {
            fontFamily: "Cabin_600SemiBold",
          })}
        >
          can we notify you? 🫠
        </Text>

        <View style={tw`flex flex-1 justify-center px-5`}>
          <Text
            style={tw.style(
              `flex text-white text-center text-2xl font-medium`,
              {
                fontFamily: "Cabin_600SemiBold",
              },
            )}
          >
            why?
          </Text>

          <Text
            style={tw.style(
              `flex text-white text-center text-lg font-medium mt-5`,
              {
                fontFamily: "Cabin_400Regular",
              },
            )}
          >
            the app sends you a notification when your friends are free.{" "}
          </Text>

          <Text
            style={tw.style(`text-center text-lg underline text-red-400 mt-2`, {
              fontFamily: "Cabin_600SemiBold",
            })}
          >
            without that, this app is not useful.
          </Text>
        </View>

        <Button
          loading={loading}
          onPress={() => {
            if (permission?.canAskAgain) {
              requestNotifications();
            } else {
              Linking.openSettings();
            }
          }}
          style="mb-4"
        >
          {permission?.canAskAgain ? "allow" : "allow from settings"}
        </Button>
      </View>
    </SafeView>
  );
}
