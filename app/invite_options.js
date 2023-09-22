import { Linking, Text, TouchableOpacity, View } from "react-native";

import * as SMS from "expo-sms";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

import tw from "@utils/tailwind";
import SafeView from "@components/SafeView";

const inviteText =
  "Hey - I have an early access invite for you to free rn?. Here’s the link:";

export default function InviteOptions() {
  const { name, number } = useLocalSearchParams();

  return (
    <SafeView>
      <View style={tw`flex flex-1 px-6 pt-4`}>
        <Text
          style={tw.style(`flex text-text-1 text-2xl font-medium self-center`, {
            fontFamily: "NunitoSans_700Bold",
          })}
        >
          {`invite ${name} with`}
        </Text>

        <View style={tw`gap-y-8 mt-10`}>
          <TouchableOpacity
            style={tw`flex flex-row items-center gap-x-4`}
            onPress={() => {
              Linking.openURL(
                `whatsapp://send?text=${inviteText}&phone=${number}`,
              );

              router.back();
            }}
          >
            <FontAwesome5 name="whatsapp" size={30} color="white" />

            <Text
              style={tw.style(`text-white text-lg`, {
                fontFamily: "NunitoSans_700Bold",
              })}
            >
              WhatsApp
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`flex flex-row items-center gap-x-4`}
            onPress={async () => {
              await SMS.sendSMSAsync(number, inviteText);
              router.back();
            }}
          >
            <Ionicons name="chatbox-ellipses-outline" size={30} color="white" />

            <Text
              style={tw.style(`text-white text-lg`, {
                fontFamily: "NunitoSans_700Bold",
              })}
            >
              SMS
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeView>
  );
}
