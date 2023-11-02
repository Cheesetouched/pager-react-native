import { Text, TouchableOpacity, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import tw from "@utils/tailwind";
import InviteIcon from "@assets/svgs/InviteIcon";

export default function InviteUser({ onPress, style }) {
  return (
    <View style={tw`flex w-[100px] items-center`}>
      <TouchableOpacity
        onPress={onPress}
        style={tw.style(
          `h-[92px] w-[92px] border-2 border-text-2 rounded-full border-dashed`,
          style,
        )}
      >
        <LinearGradient
          colors={["#333333", "#33333300"]}
          style={tw`flex flex-1 rounded-full`}
        />

        <View
          style={tw`absolute bg-gray-5 h-[25px] px-3 self-center bottom-[-10px] rounded-full items-center justify-center`}
        >
          <InviteIcon />
        </View>
      </TouchableOpacity>

      <Text
        style={tw.style(`mt-5 text-gray-4 text-sm text-center`, {
          fontFamily: "Cabin_600SemiBold",
        })}
      >
        Invite Friends
      </Text>
    </View>
  );
}
