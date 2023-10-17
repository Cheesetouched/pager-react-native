import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Text, View } from "react-native";

import { BlurView } from "expo-blur";
import { BottomSheetTextInput, BottomSheetModal } from "@gorhom/bottom-sheet";

import tw from "@utils/tailwind";
import SafeView from "@components/SafeView";
import SearchIconGray from "@assets/svgs/SearchIconGray";

const FriendList = forwardRef((_, ref) => {
  const localRef = useRef();
  const snapPoints = useMemo(() => ["50%", "75%", "100%"], []);

  useImperativeHandle(ref, () => ({
    show: localRef?.current?.present,
  }));

  return (
    <BottomSheetModal
      backgroundStyle={tw`bg-transparent`}
      index={0}
      ref={localRef}
      snapPoints={snapPoints}
      handleComponent={null}
    >
      <SafeView style="bg-transparent">
        <BlurView
          intensity={75}
          style={tw`flex-1 rounded-t-3xl overflow-hidden px-6`}
          tint="dark"
        >
          <View style={tw`bg-text-2 h-1 w-20 self-center my-6 rounded-full`} />

          <Text
            style={tw.style(`text-white text-center text-lg leading-none`, {
              fontFamily: "Cabin_600SemiBold",
            })}
          >
            Notify Friends
          </Text>

          <BlurView
            intensity={15}
            style={tw`flex-row h-[45px] rounded-xl overflow-hidden mt-6 items-center px-3`}
          >
            <SearchIconGray />

            <BottomSheetTextInput
              placeholder="Search Friends"
              placeholderTextColor="#797979"
              selectionColor="#797979"
              style={tw`flex-1 ml-2 text-white`}
            />
          </BlurView>
        </BlurView>
      </SafeView>
    </BottomSheetModal>
  );
});

export default FriendList;
