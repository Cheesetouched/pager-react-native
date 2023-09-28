import { Image, Text, View } from "react-native";

import tw from "@utils/tailwind";
import Logo from "@assets/logo.png";

export default function NotifExample({ style, subtitle, title }) {
  return (
    <View
      style={tw.style(
        `flex flex-row bg-white opacity-80 rounded-[14px] p-[10px]`,
        style,
      )}
    >
      <Image source={Logo} style={tw`h-[38px] w-[38px]`} />

      <View style={tw`flex flex-1 ml-2 justify-center gap-y-[1px]`}>
        <Text
          style={tw.style(`text-[12px]`, {
            fontFamily: "Cabin_700Bold",
          })}
        >
          {title}
        </Text>

        <Text
          style={tw.style(`text-[12px]`, {
            fontFamily: "Cabin_400Regular",
          })}
        >
          {subtitle}
        </Text>
      </View>

      <Text
        style={tw.style(`text-[10px] text-gray-8 opacity-60 mt-1`, {
          fontFamily: "Cabin_400Regular",
        })}
      >
        now
      </Text>
    </View>
  );
}
