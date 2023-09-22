import { Text, TouchableOpacity, View } from "react-native";

import tw from "@utils/tailwind";
import Image from "@components/Image";

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name?.split(" ");

  if (parts.length === 0) {
    return "?";
  } else if (parts.length === 1) {
    return parts[0][0].toString().toUpperCase();
  } else {
    return (parts[0][0] + parts[1][0]).toString().toUpperCase();
  }
};

export default function ContactCard({ data }) {
  return (
    <TouchableOpacity
      style={tw`flex flex-row items-center`}
      onPress={() => console.log(data)}
    >
      {data?.image ? (
        <View style={tw`h-[50px] w-[50px]`}>
          <Image src={data?.image} style="rounded-full" />
        </View>
      ) : (
        <View
          style={tw`bg-neon items-center justify-center h-[50px] w-[50px] rounded-full`}
        >
          <Text
            style={tw.style(`text-xl`, {
              fontFamily: "NunitoSans_800ExtraBold",
            })}
          >
            {getInitials(data?.name)}
          </Text>
        </View>
      )}

      <View style={tw`flex flex-1 ml-4`}>
        <Text
          style={tw.style(`text-base text-white`, {
            fontFamily: "NunitoSans_700Bold",
          })}
        >
          {data?.name}
        </Text>
        <Text
          style={tw.style(`text-sm text-text-gray`, {
            fontFamily: "NunitoSans_400Regular",
          })}
        >
          {data?.number}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
