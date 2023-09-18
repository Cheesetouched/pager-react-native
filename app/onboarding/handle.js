import { Text, View } from "react-native";

import tw from "@utils/tailwind";

export default function Handle() {
  return (
    <View>
      <Text style={tw.style({ fontFamily: "NunitoSans_700Bold" })}>Handle</Text>
    </View>
  );
}
