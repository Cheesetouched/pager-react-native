import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BlurView } from "expo-blur";

import tw from "@utils/tailwind";

const width = Dimensions.get("window").width < 350 ? "w-[260px]" : "w-[300px]";

export default function Prompt({
  body,
  loading = false,
  onClose,
  onNo,
  onYes,
  visible,
}) {
  return (
    <Modal
      animationType="fade"
      hardwareAccelerated
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <BlurView
        intensity={75}
        style={tw`flex-1 items-center justify-center`}
        tint="dark"
      >
        <View style={tw`bg-bg flex rounded-3xl ${width} overflow-hidden`}>
          <View style={tw`flex p-5`}>
            <Text
              style={{
                ...tw`text-offwhite text-center text-2xl`,
                fontFamily: "Lalezar_400Regular",
              }}
            >
              {body?.title}
            </Text>

            <Text
              style={{
                ...tw`text-white text-center text-sm pt-3`,
                fontFamily: "Cabin_600SemiBold",
              }}
            >
              {body?.message}
            </Text>
          </View>

          <View style={tw`h-[0.5px] bg-gray-4 mt-2`} />

          <View style={tw`flex flex-row`}>
            <TouchableOpacity
              disabled={loading}
              onPress={onNo}
              style={tw`flex-1 items-center justify-center h-[50px]`}
            >
              <Text
                style={{
                  ...tw`text-white text-base`,
                  fontFamily: "Cabin_600SemiBold",
                }}
              >
                No
              </Text>
            </TouchableOpacity>

            <View style={tw`w-[0.5px] bg-gray-4`} />

            <TouchableOpacity
              disabled={loading}
              onPress={onYes}
              style={tw`flex flex-1 items-center justify-center`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text
                  style={{
                    ...tw`text-gray-4 text-base`,
                    fontFamily: "Cabin_600SemiBold",
                  }}
                >
                  Yes
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}
