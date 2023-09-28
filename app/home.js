import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { SplashScreen, useRootNavigation } from "expo-router";

import tw from "@utils/tailwind";
import useUser from "@hooks/useUser";
import Button from "@components/Button";
import SafeView from "@components/SafeView";
import useFirebase from "@hooks/useFirebase";
import useLocalStorage from "@hooks/useLocalStorage";

export default function Home() {
  const { clear } = useLocalStorage();
  const navigation = useRootNavigation();
  const { userData, userLoading } = useUser({
    withFriends: true,
  });

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
    SplashScreen.hideAsync();
  }, []);

  console.log(userData);

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
