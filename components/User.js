import { Text, TouchableOpacity, View } from "react-native";

import tw from "@utils/tailwind";
import Image from "@components/Image";

export default function User({ data, free = false, title }) {
  return (
    <View style={tw`flex flex-col`}>
      <TouchableOpacity>
        <View style={tw`h-[92px] w-[92px]`}>
          <Image
            src={data?.dp}
            style={`rounded-full ${!free ? "opacity-40" : ""}`}
          />
        </View>

        <View
          style={tw`absolute bg-gray-5 h-[25px] px-3 self-center bottom-[-10px] rounded-full items-center justify-center`}
        >
          <Text
            style={tw.style(`text-white text-xs leading-loose`, {
              fontFamily: "Cabin_700Bold",
            })}
          >
            {title}
          </Text>
        </View>
      </TouchableOpacity>

      <Text
        style={tw.style(`text-gray-4 text-sm text-center mt-5`, {
          fontFamily: "Cabin_600SemiBold",
        })}
      >
        {data?.name?.split(" ")[0]}
      </Text>
    </View>
  );
}
