import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import tw from "@utils/tailwind";

export default function OutlineButton({
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
        `${loading ? "border border-accent/75" : "border border-accent"}`,
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
