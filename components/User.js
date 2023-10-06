import { Text, TouchableOpacity, View } from "react-native";

import tw from "@utils/tailwind";
import Image from "@components/Image";

export default function User({
  data,
  dimension = "92",
  disabled = false,
  free = false,
  nameStyle,
  onPress,
  showName = true,
  stroke = false,
  title,
  titleContainerStyle,
  titleStyle,
  nameOverride = null,
}) {
  return (
    <View style={tw`flex flex-col`}>
      <TouchableOpacity onPress={onPress}>
        <View
          style={tw.style(
            `bg-gray-5 rounded-full h-[${dimension}px] w-[${dimension}px] shadow-lg`,
            `${stroke ? "p-[2px] border-2 border-accent-deep/90" : ""}`,
          )}
        >
          <Image
            src={data?.dp}
            style={`rounded-full ${!free || disabled ? "opacity-50" : ""}`}
          />
        </View>

        <View
          style={tw.style(
            `absolute bg-gray-5 h-[25px] px-3 self-center bottom-[-10px] rounded-full items-center justify-center`,
            titleContainerStyle,
          )}
        >
          <Text
            style={tw.style(`text-white text-xs leading-loose`, titleStyle, {
              fontFamily: "Cabin_700Bold",
            })}
          >
            {title ? title : free ? "1hr 👋🏻" : "😴"}
          </Text>
        </View>
      </TouchableOpacity>

      {showName ? (
        <Text
          style={tw.style(`text-gray-4 text-sm text-center mt-5`, nameStyle, {
            fontFamily: "Cabin_600SemiBold",
          })}
        >
          {nameOverride ? nameOverride : data?.name?.split(" ")[0]}
        </Text>
      ) : null}
    </View>
  );
}
