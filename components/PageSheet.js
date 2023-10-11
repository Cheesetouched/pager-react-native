import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import tw from "@utils/tailwind";
import Button from "@components/Button";
import useMarkAway from "@hooks/mutations/useMarkAway";
import useMarkFree from "@hooks/mutations/useMarkFree";

const PageSheet = forwardRef((_, ref) => {
  const { markAway } = useMarkAway();
  const { markFree } = useMarkFree();
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
            Set Status
          </Text>

          <View style={tw`items-center my-8 gap-y-5`}>
            <Button
              onPress={() => {
                markFree();
                setVisible(false);
              }}
              style="w-60"
              textStyle="leading-tight"
            >
              Free to chat 👋🏻
            </Button>

            <Button
              onPress={() => {
                markAway();
                setVisible(false);
              }}
              style="w-60"
              textStyle="leading-tight"
              variant="dark"
            >
              Away 😴
            </Button>
          </View>
        </View>
      </>
    </Modal>
  );
});

export default PageSheet;
