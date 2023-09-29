import { Text, TouchableOpacity, View } from "react-native";

import { BlurView } from "expo-blur";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import tw from "@utils/tailwind";
import Button from "@components/Button";

export default function Constraint() {
  return (
    <BlurView intensity={100} style={tw`flex flex-1`} tint="dark">
      <SafeAreaProvider>
        <SafeAreaView style={tw`flex flex-1 px-8`}>
          <View style={tw`flex flex-1 justify-center`}>
            <Text
              style={tw.style(
                `text-text-1 text-4xl leading-tight text-center`,
                {
                  fontFamily: "Lalezar_400Regular",
                },
              )}
            >
              You can only see who is free if you’re free...
            </Text>
          </View>

          <View style={tw`mb-10`}>
            <Button>Yep, I'm free now</Button>

            <TouchableOpacity>
              <Text
                style={tw.style(
                  `text-text-2 text-lg leading-tight text-center mt-5`,
                  {
                    fontFamily: "Cabin_700Bold",
                  },
                )}
              >
                Not free
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </BlurView>
  );
}
