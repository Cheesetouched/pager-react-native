import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";

import { BlurView } from "expo-blur";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import tw from "@utils/tailwind";

const FriendList = forwardRef((_, ref) => {
  const localRef = useRef();
  const snapPoints = useMemo(() => ["50%", "75%", "100%"], []);

  useImperativeHandle(ref, () => ({
    present: localRef?.current?.present,
  }));

  return (
    <BottomSheetModal
      index={0}
      ref={localRef}
      snapPoints={snapPoints}
      backgroundStyle={tw`bg-transparent`}
    >
      <BlurView intensity={75} style={tw`flex-1`} tint="dark" />
    </BottomSheetModal>
  );
});

export default FriendList;
