import { ActivityIndicator, View } from "react-native";

import tw from "@utils/tailwind";
import { useLocalSearchParams } from "expo-router";
import SafeView from "@components/SafeView";

export default function Process() {
  const params = useLocalSearchParams();

  return (
    <SafeView>
      <View style={tw`flex flex-1 px-4 pt-4 items-center justify-center`}>
        <ActivityIndicator size="large" />
      </View>
    </SafeView>
  );
}
