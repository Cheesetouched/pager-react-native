import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Text, View } from "react-native";

import { BlurView } from "expo-blur";
import {
  BottomSheetFlatList,
  BottomSheetTextInput,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";

import tw from "@utils/tailwind";
import SafeView from "@components/SafeView";
import FriendCard from "@components/FriendCard";
import SearchIconGray from "@assets/svgs/SearchIconGray";

const FriendList = forwardRef(({ friends }, ref) => {
  const localRef = useRef();
  const [selected, setSelected] = useState([]);
  const [allFriends, setAllFriends] = useState(friends);
  const snapPoints = useMemo(() => ["75%", "100%"], []);

  const evaluateCheck = useCallback(
    (user) => {
      const checked = selected.find((friend) => user?.id === friend?.id);
      return !!checked;
    },
    [selected],
  );

  const onCheck = useCallback(
    (user) => {
      const result = selected?.find((friend) => friend?.id === user?.id);

      if (result) {
        setSelected((current) =>
          current?.filter((friend) => friend?.id !== user?.id),
        );
      } else {
        setSelected((current) => [...current, user]);
      }
    },
    [selected],
  );

  const search = useCallback(
    (text) => {
      const filtered = friends.filter((friend) => {
        const lowercase = friend?.name.toLowerCase();
        const searchTerm = text.toString().toLowerCase();
        return lowercase.indexOf(searchTerm) > -1;
      });

      setAllFriends(filtered);
    },
    [friends],
  );

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
              onChangeText={search}
              placeholder="Search Friends"
              placeholderTextColor="#797979"
              selectionColor="#797979"
              style={tw`flex-1 ml-2 text-white`}
            />
          </BlurView>

          <BottomSheetFlatList
            ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
            data={allFriends}
            renderItem={({ item }) => (
              <FriendCard
                checked={() => evaluateCheck(item)}
                data={item}
                onCheck={() => onCheck(item)}
              />
            )}
            contentContainerStyle={tw`mt-6`}
          />
        </BlurView>
      </SafeView>
    </BottomSheetModal>
  );
});

export default FriendList;
