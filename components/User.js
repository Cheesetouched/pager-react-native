import { Text, TouchableOpacity, View } from "react-native";

import tw from "@utils/tailwind";
import Image from "@components/Image";
import { freeFor } from "@utils/helpers";

function getBorderStyle(disabled, free, freeFrom, paged) {
  if (disabled) {
    return "p-[2px] border-2 border-gray-4";
  } else {
    if (free) {
      return "p-[2px] border-2 border-accent-deep";
    } else {
      if (freeFrom) {
        return "p-[2px] border-2 border-gray-4";
      } else if (paged) {
        return "p-[2px] border-2 border-gray-4";
      } else {
        return "";
      }
    }
  }
}

export default function User({
  data,
  dimension = "92",
  disabled = false,
  free = false,
  freeTextStyle,
  nameOverride = null,
  nameStyle,
  overrideFree = false,
  onPress,
  showName = true,
  paged = false,
  title,
  titleContainerStyle,
  titleStyle,
}) {
  return (
    <View style={tw`relative flex-col items-center`}>
      <TouchableOpacity
        onPress={onPress}
        style={tw`relative w-[${dimension}px]`}
      >
        <View
          style={tw.style(
            `bg-gray-5 rounded-full h-[${dimension}px] w-[${dimension}px] shadow-lg`,
            getBorderStyle(disabled, free, data?.freeFrom, paged),
          )}
        >
          <Image
            src={data?.dp}
            style={`rounded-full ${
              overrideFree ? "" : !free || disabled ? "opacity-50" : ""
            }`}
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
            {title
              ? title
              : free
              ? freeFor(data?.freeTill)
              : data?.freeFrom
              ? "🕒"
              : "😴"}
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

      {data?.freeFrom ? (
        <Text
          style={tw.style(`text-gray-4 text-xs mt-1`, freeTextStyle, {
            fontFamily: "Cabin_400Regular",
          })}
        >
          Free at{" "}
          {new Date(data?.freeFrom)?.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      ) : null}
    </View>
  );
}
