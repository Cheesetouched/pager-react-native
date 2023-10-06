import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import tw from "@utils/tailwind";
import Button from "@components/Button";

const PageSheet = forwardRef((_, ref) => {
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

        <View style={tw`bg-bg p-10`}>
          <Text
            style={tw.style(`text-center text-xl text-white px-5`, {
              fontFamily: "Cabin_700Bold",
            })}
          >
            let your friends know you’re free to chat rn
          </Text>

          <View style={tw`items-center mt-10`}>
            <Button
              onPress={() => {
                setVisible(false);
              }}
              style="w-60"
            >
              Send it!
            </Button>

            <Text
              style={tw.style(`text-center text-text-2 text-xs mt-5`, {
                fontFamily: "Cabin_400Regular",
              })}
            >
              friends see your name only if they are free to chat
            </Text>
          </View>
        </View>
      </>
    </Modal>
  );
});

export default PageSheet;
