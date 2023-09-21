import { Text, View } from "react-native";

import tw from "@utils/tailwind";
import Button from "@components/Button";
import SafeView from "@components/SafeView";

export default function Invite() {
  return (
    <SafeView>
      <View style={tw`flex flex-1 px-4 pt-4`}>
        <Text
          style={tw.style(`flex text-text-1 text-2xl font-medium self-center`, {
            fontFamily: "NunitoSans_700Bold",
          })}
        >
          let's get your buddies on 🥳
        </Text>

        <View style={tw`flex flex-1 justify-center px-5`}>
          <Text
            style={tw.style(
              `flex text-white text-center text-2xl font-medium`,
              {
                fontFamily: "NunitoSans_700Bold",
              },
            )}
          >
            why?
          </Text>

          <Text
            style={tw.style(
              `flex text-white text-center text-lg font-medium mt-5`,
              {
                fontFamily: "NunitoSans_400Regular",
              },
            )}
          >
            the app sends you a notification when your friends are free.{" "}
          </Text>

          <Text
            style={tw.style(`text-center text-lg underline text-red-400 mt-2`, {
              fontFamily: "NunitoSans_700Bold",
            })}
          >
            without that, this app is not useful.
          </Text>
        </View>

        <Button style="mb-4">allow</Button>
      </View>
    </SafeView>
  );
}
