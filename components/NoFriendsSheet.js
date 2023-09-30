import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { router } from "expo-router";

import tw from "@utils/tailwind";
import Button from "@components/Button";

const NoFriendsSheet = forwardRef((_, ref) => {
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
      transparent
      visible={visible}
    >
      <>
        <Pressable
          onPress={() => setVisible(false)}
          style={tw`bg-black/50 flex flex-1`}
        />

        <View style={tw`bg-bg h-60 p-10`}>
          <Text
            style={tw.style(`text-center text-xl text-white px-5`, {
              fontFamily: "Cabin_700Bold",
            })}
          >
            Can't page unless you have friends on here
          </Text>

          <View style={tw`items-center`}>
            <Button
              onPress={() => {
                setVisible(false);
                router.push("/friends");
              }}
              style="w-60 mt-10"
              variant="dark"
            >
              Invite friends
            </Button>
          </View>
        </View>
      </>
    </Modal>
  );
});

export default NoFriendsSheet;
