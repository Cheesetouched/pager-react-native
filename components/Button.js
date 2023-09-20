import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

import tw from "@utils/tailwind";

export default function Button({
  children,
  disabled = false,
  loading = false,
  onPress,
  style,
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        if (!disabled && !loading) {
          onPress();
        }
      }}
      style={tw.style(
        `flex h-[50px] justify-center rounded-xl`,
        `${style ? style : ""}`,
        `${loading ? "bg-neon/75" : "bg-neon"}`,
      )}
    >
      {loading ? (
        <ActivityIndicator color="black" />
      ) : (
        <Text
          style={tw.style(`text-black text-center text-lg leading-snug`, {
            fontFamily: "NunitoSans_800ExtraBold",
          })}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}
