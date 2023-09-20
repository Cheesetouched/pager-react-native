import { useEffect } from "react";
import { View } from "react-native";

import { SplashScreen, router } from "expo-router";

import tw from "@utils/tailwind";
import Button from "@components/Button";
import SafeView from "@components/SafeView";
import useFirebase from "@hooks/useFirebase";
import useLocalStorage from "@hooks/useLocalStorage";

export default function Home() {
  const { clear } = useLocalStorage();

  const { loggingOut, logout } = useFirebase({
    onLogout: () => {
      clear();
      router.replace("/handle");
    },
  });

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeView>
      <View style={tw`flex flex-1 px-4 pt-4`}>
        <Button loading={loggingOut} onPress={logout}>
          Logout
        </Button>
      </View>
    </SafeView>
  );
}
