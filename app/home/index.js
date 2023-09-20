import { Text, View } from "react-native";

import { router } from "expo-router";

import tw from "@utils/tailwind";
import Button from "@components/Button";
import useFirebase from "@hooks/useFirebase";

export default function Home() {
  const { loggingOut, logout } = useFirebase({
    onLogout: () => router.replace("/onboarding/handle"),
  });

  return (
    <View style={tw`flex flex-1 px-4 pt-4`}>
      <Text>home</Text>

      <Button loading={loggingOut} onPress={logout}>
        Logout
      </Button>
    </View>
  );
}
