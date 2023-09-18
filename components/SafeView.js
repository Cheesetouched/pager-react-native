import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import tw from "@utils/tailwind";

export default function SafeView({ children }) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={tw`flex flex-1 bg-bg`}>{children}</SafeAreaView>
    </SafeAreaProvider>
  );
}
