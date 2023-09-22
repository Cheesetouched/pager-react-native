import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

import tw from "@utils/tailwind";

export default function OutlineButton({
  children,
  disabled = false,
  loading = false,
  onPress,
  style,
  textStyle,
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
        `${loading ? "border border-neon/75" : "border border-neon"}`,
      )}
    >
      {loading ? (
        <ActivityIndicator color="gray" size="small" />
      ) : (
        <Text
          style={tw.style(
            `text-white text-center text-lg leading-snug`,
            `${textStyle ? textStyle : ""}`,
            {
              fontFamily: "NunitoSans_800ExtraBold",
            },
          )}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}
