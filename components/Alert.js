import React, { forwardRef, memo, useImperativeHandle, useState } from "react";
import { View, Modal, Text, Dimensions } from "react-native";

import tw from "@utils/tailwind";
import Button from "@components/Button";

const width = Dimensions.get("window").width < 350 ? "w-[260px]" : "w-[300px]";

const Alert = forwardRef((_, ref) => {
  const [data, setData] = useState(null);
  const [show, setShow] = useState(false);

  useImperativeHandle(ref, () => ({
    show: (data) => {
      setShow(true);
      setData(data);
    },
  }));

  return (
    <Modal
      animationType="fade"
      hardwareAccelerated
      onRequestClose={() => setShow(false)}
      transparent
      visible={show}
    >
      <View style={tw`bg-black/60 flex flex-1 items-center justify-center`}>
        <View style={tw`bg-bg flex rounded-3xl p-5 ${width}`}>
          <Text
            style={tw.style(`text-white text-xl text-center`, {
              fontFamily: "NunitoSans_700Bold",
            })}
          >
            {data?.title}
          </Text>

          {data?.message && (
            <Text
              style={{
                ...tw`text-text-gray text-center text-sm mt-5 mb-6`,
                fontFamily: "NunitoSans_400Regular",
              }}
            >
              {data?.message}
            </Text>
          )}

          <Button style="h-11" onPress={() => setShow(false)}>
            {data?.ctaTitle ? data?.ctaTitle : "cool"}
          </Button>
        </View>
      </View>
    </Modal>
  );
});

export default memo(Alert);
