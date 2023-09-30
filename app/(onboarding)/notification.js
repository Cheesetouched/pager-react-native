import { useCallback, useEffect, useState } from "react";
import { Linking, Text, View } from "react-native";

import {
  SplashScreen,
  useLocalSearchParams,
  useRootNavigation,
} from "expo-router";

import tw from "@utils/tailwind";
import Button from "@components/Button";
import SafeView from "@components/SafeView";
import NotifExample from "@components/NotifExample";
import PermissionBox from "@components/PermissionBox";
import useNotifications from "@hooks/useNotifications";

export default function Notification() {
  const params = useLocalSearchParams();
  const navigation = useRootNavigation();
  const [deniedView, setDeniedView] = useState(false);

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
    onGranted,
  });

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeView>
      <View style={tw`flex flex-1 px-8 pt-4`}>
        {!deniedView ? (
          <>
            <Text
              style={tw.style(
                `flex text-text-1 text-3xl font-medium self-center mt-2 leading-snug`,
                {
                  fontFamily: "Lalezar_400Regular",
                },
              )}
            >
              Find out when who is free
            </Text>

            <Text
              style={tw.style(
                `flex text-gray-4 text-center text-sm font-medium`,
                {
                  fontFamily: "Cabin_400Regular",
                },
              )}
            >
              p.s. - pager is an app which works on notifications. it may not be
              useful without it :\
            </Text>
          </>
        ) : null}

        {!permission?.canAskAgain || deniedView ? (
          <View style={tw`flex flex-1 justify-center px-3`}>
            <Text
              style={tw.style(
                `flex text-text-1 text-3xl font-medium self-center mt-2`,
                {
                  fontFamily: "Lalezar_400Regular",
                },
              )}
            >
              Oops!
            </Text>

            <Text
              style={tw.style(
                `flex text-gray-4 text-center text-base font-medium mt-5`,
                {
                  fontFamily: "Cabin_400Regular",
                },
              )}
            >
              We know notifications are annoying. But pager is useless without
              it.
            </Text>

            <Button
              onPress={() => {
                if (permission?.canAskAgain) {
                  requestNotifications();
                } else {
                  Linking.openSettings();
                }
              }}
              style="mt-10 mx-14"
            >
              {permission?.canAskAgain ? "Allow" : "Allow from settings"}
            </Button>

            <NotifExample
              title="Someone paged!"
              subtitle="Page back to see who it is 📟"
              style={{ marginTop: 100, transform: [{ rotate: "-1.5deg" }] }}
            />
          </View>
        ) : (
          <View style={tw`flex flex-1 justify-center px-3`}>
            <View style={tw`mx-3`}>
              <PermissionBox
                explanation="Pager will let you know when your friends are free to chat."
                loading={loading}
                onAllow={() => {
                  if (permission?.canAskAgain) {
                    requestNotifications();
                  } else {
                    Linking.openSettings();
                  }
                }}
                onDeny={() => setDeniedView(true)}
                title="Get notified"
              />
            </View>

            <Text style={tw`text-5xl self-end mr-14 mt-5 leading-tight`}>
              👆
            </Text>

            <NotifExample
              title="One of your friends is free!"
              subtitle="Mark yourself as free to see who it is!"
              style={{ marginTop: 80, transform: [{ rotate: "-1.5deg" }] }}
            />
          </View>
        )}
      </View>
    </SafeView>
  );
}
