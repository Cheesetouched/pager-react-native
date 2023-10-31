import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import tw from "@utils/tailwind";

export default function OutlineButton({
  children,
  disabled = false,
  fontFamily = "Cabin_700Bold",
  icon = null,
  loading = false,
  onPress,
  style,
  textStyle,
  variant = "main",
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        if (!disabled && !loading) {
          if (onPress) {
            onPress();
          }
        }
      }}
      style={tw.style(
        `flex h-[50px] justify-center rounded-full`,
        `${style ? style : ""}`,
        `${
          loading
            ? `border ${
                variant === "main" ? "border-accent/75" : "border-gray-2/75"
              }`
            : `border ${variant === "main" ? "border-accent" : "border-gray-4"}`
        }`,
      )}
    >
      {loading ? (
        <ActivityIndicator color="gray" size="small" />
      ) : (
        <View>
          {icon ? icon : null}

          {children ? (
            <Text
              style={tw.style(
                `text-white text-center text-lg leading-tight`,
                `${textStyle ? textStyle : ""}`,
                { fontFamily },
              )}
            >
              {children}
            </Text>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
}
