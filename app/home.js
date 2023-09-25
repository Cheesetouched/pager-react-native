import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { SplashScreen, router, useRootNavigation } from "expo-router";

import tw from "@utils/tailwind";
import useUser from "@hooks/useUser";
import Button from "@components/Button";
import SafeView from "@components/SafeView";
import useFirebase from "@hooks/useFirebase";
import useLocalStorage from "@hooks/useLocalStorage";

export default function Home() {
  const navigation = useRootNavigation();
  const { clear, get } = useLocalStorage();
  const { userData, userLoading } = useUser();

  const { loggingOut, logout } = useFirebase({
    onLogout: () => {
      clear();
      navigation.reset({
        index: 0,
        routes: [{ name: "(onboarding)/handle" }],
      });
    },
  });

  useEffect(() => {
    if (userData) {
      get("first_launch").then((first_launch) => {
        if (first_launch === null) {
          router.push("/friends");
        }
      });
    }
  }, [get, userData]);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeView>
      <View style={tw`flex flex-1 px-4 pt-4`}>
        <View style={tw`flex flex-1 items-center justify-center`}>
          {userLoading ? <ActivityIndicator size="large" /> : null}
        </View>

        <Button loading={loggingOut} onPress={logout}>
          Logout
        </Button>
      </View>
    </SafeView>
  );
}
