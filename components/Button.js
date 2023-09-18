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
        `flex h-11 justify-center rounded-xl`,
        `${style ? style : ""}`,
        `${loading ? "bg-button/75" : "bg-button"}`,
      )}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text
          style={tw.style(`text-black text-center text-base`, {
            fontFamily: "NunitoSans_700Bold",
          })}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}
