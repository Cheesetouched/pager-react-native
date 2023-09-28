import { Text, View } from "react-native";

import { Image } from "expo-image";

import tw from "@utils/tailwind";

export default function ExampleUser({ children, src, style }) {
  return (
    <View style={tw.style(`flex h-[60px] w-[60px] rounded-full`, style)}>
      <Image source={src} style={tw`flex flex-1`} />

      <View
        style={tw`absolute bg-gray-5 h-[20px] w-[45px] self-center bottom-[-10px] rounded-full items-center justify-center`}
      >
        <Text
          style={tw.style(`text-white text-[10px]`, {
            fontFamily: "Cabin_700Bold",
          })}
        >
          {children}
        </Text>
      </View>
    </View>
  );
}
