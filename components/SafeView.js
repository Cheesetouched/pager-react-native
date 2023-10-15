import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import tw from "@utils/tailwind";

export default function SafeView({ children, style }) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={tw.style(`flex flex-1 bg-bg`, style)}>
        {children}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
