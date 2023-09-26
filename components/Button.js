import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import tw from "@utils/tailwind";

export default function Button({
  children,
  disabled = false,
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
          onPress();
        }
      }}
      style={tw.style(
        `h-[50px] bg-[#242424] rounded-full shadow-lg`,
        `${style ? style : ""}`,
      )}
    >
      <LinearGradient
        colors={[`${variant === "main" ? "#52A98F" : "#333333"}`, "#242424"]}
        style={tw.style(`flex flex-1 justify-center rounded-full`)}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <View>
            {icon ? icon : null}

            {children ? (
              <Text
                style={tw.style(
                  `text-white text-center text-base leading-none`,
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
      </LinearGradient>
    </TouchableOpacity>
  );
}
