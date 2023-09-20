import { useCallback, useEffect, useState } from "react";
import { AppState, Linking, Platform, Text, View } from "react-native";

import * as Device from "expo-device";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import {
  SplashScreen,
  useLocalSearchParams,
  useRootNavigation,
} from "expo-router";

import tw from "@utils/tailwind";
import Button from "@components/Button";
import SafeView from "@components/SafeView";
import useAppContext from "@hooks/useAppContext";

export default function Notification() {
  const { alert } = useAppContext();
  const params = useLocalSearchParams();
  const navigation = useRootNavigation();
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState();

  const ask = useCallback(() => {
    setLoading(true);

    getPushToken().then(async (pushToken) => {
      setLoading(false);

      if (pushToken) {
        return navigation.reset({
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
      } else {
        alert.current.show({
          title: "oops 😕",
          message:
            "without notifications, we cannot notify you when your friends are free",
        });
      }

      Notifications.getPermissionsAsync().then((data) => {
        setPermission(data);
      });
    });
  }, [alert, navigation, params]);

  useEffect(() => {
    SplashScreen.hideAsync();

    Notifications.getPermissionsAsync().then((data) => {
      setPermission(data);
    });
  }, []);

  useEffect(() => {
    const stateListener = AppState.addEventListener(
      "change",
      async (appState) => {
        if (appState === "active") {
          Notifications.getPermissionsAsync().then((data) => {
            if (data.granted) {
              ask();
            }
          });
        }
      },
    );

    return () => {
      stateListener.remove();
    };
  }, [ask]);

  return (
    <SafeView>
      <View style={tw`flex flex-1 px-4 pt-4`}>
        <Text
          style={tw.style(`flex text-text-1 text-3xl font-medium self-center`, {
            fontFamily: "NunitoSans_700Bold",
          })}
        >
          can we notify you? 🫠
        </Text>

        <View style={tw`flex flex-1 justify-center px-5`}>
          <Text
            style={tw.style(
              `flex text-white text-center text-2xl font-medium`,
              {
                fontFamily: "NunitoSans_700Bold",
              },
            )}
          >
            why?
          </Text>

          <Text
            style={tw.style(
              `flex text-white text-center text-lg font-medium mt-5`,
              {
                fontFamily: "NunitoSans_400Regular",
              },
            )}
          >
            the app sends you a notification when your friends are free.{" "}
          </Text>

          <Text
            style={tw.style(`text-center text-lg underline text-red-400 mt-2`, {
              fontFamily: "NunitoSans_700Bold",
            })}
          >
            without that, this app is not useful.
          </Text>
        </View>

        <Button
          loading={loading}
          onPress={() => {
            if (permission?.canAskAgain) {
              ask();
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

async function getPushToken() {
  let token = null;

  if (Platform.OS === "android") {
    await Notification.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notification.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return;
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })
    ).data;
  } else {
    token = "simulator";
  }

  return token;
}
