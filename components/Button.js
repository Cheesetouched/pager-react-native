import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import tw from "@utils/tailwind";

export default function Button({
  children,
  disabled = false,
  icon = null,
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
        `${loading ? "bg-accent/75" : "bg-accent"}`,
      )}
    >
      {loading ? (
        <ActivityIndicator color="black" />
      ) : (
        <View>
          {icon ? icon : null}

          {children ? (
            <Text
              style={tw.style(
                `text-white text-center text-lg leading-snug`,
                `${textStyle ? textStyle : ""}`,
                {
                  fontFamily: "Cabin_700Bold",
                },
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
