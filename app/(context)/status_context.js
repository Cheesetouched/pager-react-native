import { Text, View } from "react-native";

import { Image } from "expo-image";
import { router } from "expo-router";

import tw from "@utils/tailwind";
import Button from "@components/Button";
import Status1 from "@assets/status_1.png";
import SafeView from "@components/SafeView";
import useLocalStorage from "@hooks/useLocalStorage";

export default function StatusContext() {
  const localStorage = useLocalStorage();

  return (
    <SafeView>
      <View style={tw`flex-1 items-center justify-center`}>
        <View style={tw`absolute items-center top-5`}>
          <View style={tw`items-center`}>
            <Text
              style={tw.style(`text-white text-xl`, {
                fontFamily: "Cabin_600SemiBold",
              })}
            >
              Let people know when you’ve got
            </Text>

            <Text
              style={tw.style(`text-white text-xl`, {
                fontFamily: "Cabin_600SemiBold",
              })}
            >
              some time on your hand
            </Text>
          </View>

          <Text
            style={tw.style(`text-gray-4 mt-3`, {
              fontFamily: "Cabin_400Regular",
            })}
          >
            Notify friends when you are free to chat
          </Text>

          <View style={tw.style(`mt-8`, { transform: [{ rotate: "-4deg" }] })}>
            <Button style="w-40" textStyle="leading-tight">
              Free to chat 👋🏻
            </Button>
          </View>
        </View>

        <Image source={Status1} style={tw`h-[374px] w-[303px] mt-16`} />

        <View style={tw`absolute bottom-12 items-center w-full`}>
          <Button
            onPress={() => {
              localStorage.save("status_context", "seen");

              router.push({
                pathname: "/home",
                params: { showStatusSheet: true },
              });
            }}
            style="w-40"
            textStyle="leading-snug"
            variant="dark"
          >
            Let's go 🚀
          </Button>
        </View>
      </View>
    </SafeView>
  );
}
