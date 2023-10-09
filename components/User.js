import { Text, TouchableOpacity, View } from "react-native";

import { differenceInHours, differenceInMinutes } from "date-fns";

import tw from "@utils/tailwind";
import Image from "@components/Image";

function freeFor(freeTill) {
  const current = new Date();
  const diffInHours = differenceInHours(freeTill, current);
  const diffInMinutes = differenceInMinutes(freeTill, current);

  if (diffInHours > 0) {
    return `${diffInHours}hr 👋🏻`;
  } else {
    return `${diffInMinutes}m 👋🏻`;
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
  onPress,
  showName = true,
  stroke = false,
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
            `${
              stroke && !data?.freeFrom
                ? `p-[2px] border-2 ${
                    disabled ? "border-gray-4" : "border-accent-deep"
                  }`
                : ""
            }`,
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
            {title
              ? title
              : free
              ? freeFor(data?.freeTill)
              : data?.freeFrom
              ? "🕒"
              : stroke
              ? "📟"
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
