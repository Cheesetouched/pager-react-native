import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

import tw from "@utils/tailwind";
import Button from "@components/Button";

const NotifySheet = forwardRef((_, ref) => {
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    close: () => setVisible(false),
    show: () => setVisible(true),
  }));

  return (
    <Modal
      animationType="fade"
      hardwareAccelerated
      onRequestClose={() => setVisible(false)}
      style="z-10"
      transparent
      visible={visible}
    >
      <>
        <Pressable
          onPress={() => setVisible(false)}
          style={tw`bg-black/50 flex flex-1`}
        />

        <View style={tw`bg-bg p-6`}>
          <Text
            style={tw.style(`text-center text-xl text-white px-5`, {
              fontFamily: "Cabin_700Bold",
            })}
          >
            You're free to chat now!
          </Text>

          <View style={tw`items-center my-8 gap-y-5`}>
            <Button style="w-60" textStyle="leading-tight" variant="dark">
              Notify friends
            </Button>

            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={tw`mt-3`}
            >
              <Text
                style={tw.style(`text-text-2 text-sm`, {
                  fontFamily: "Cabin_700Bold",
                })}
              >
                CLOSE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    </Modal>
  );
});

export default NotifySheet;
