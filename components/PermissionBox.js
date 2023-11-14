import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import tw from "@utils/tailwind";

export default function PermissionBox({
  allowButtonLabel,
  denyButtonLabel,
  loading = false,
  explanation,
  onAllow,
  onDeny,
  style,
  title,
}) {
  return (
    <View
      style={tw.style(
        `flex w-full bg-gray-5 opacity-90 rounded-2xl shadow-lg shadow-black`,
        style,
      )}
    >
      <View style={tw`p-4`}>
        <Text
          style={tw.style(`text-white text-center text-base`, {
            fontFamily: "Cabin_700Bold",
          })}
        >
          {title}
        </Text>

        <Text
          style={tw.style(`text-xs text-center text-gray-6 my-3 px-3`, {
            fontFamily: "Cabin_400Regular",
          })}
        >
          {explanation}
        </Text>
      </View>

      <View style={tw`flex bg-gray-7 h-[1px]`} />

      <View style={tw`flex flex-row h-[45px]`}>
        <TouchableOpacity
          disabled={loading}
          onPress={() => {
            if (!loading) {
              onDeny();
            }
          }}
          style={tw`flex flex-1 items-center justify-center`}
        >
          <Text
            style={tw.style(`text-white`, { fontFamily: "Cabin_400Regular" })}
          >
            {denyButtonLabel ? denyButtonLabel : "Later"}
          </Text>
        </TouchableOpacity>

        <View style={tw`flex bg-gray-7 w-[1px]`} />

        <TouchableOpacity
          onPress={() => {
            if (!loading) {
              onAllow();
            }
          }}
          style={tw`flex flex-1 items-center justify-center`}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text
              style={tw.style(`text-white`, { fontFamily: "Cabin_400Regular" })}
            >
              {allowButtonLabel ? allowButtonLabel : "OK"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
