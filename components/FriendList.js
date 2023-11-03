import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { BlurView } from "expo-blur";
import { router } from "expo-router";
import Checkbox from "expo-checkbox";
import { AntDesign } from "@expo/vector-icons";
import {
  BottomSheetFlatList,
  BottomSheetTextInput,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";

import tw from "@utils/tailwind";
import Button from "@components/Button";
import SafeView from "@components/SafeView";
import useKeyboard from "@hooks/useKeyboard";
import FriendCard from "@components/FriendCard";
import InviteCard from "@components/InviteCard";
import SearchIconGray from "@assets/svgs/SearchIconGray";

const FriendList = forwardRef(({ friends, onSelected }, ref) => {
  const localRef = useRef();
  const [note, setNote] = useState("");
  const [query, setQuery] = useState("");
  const { keyboardVisible } = useKeyboard();
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

  useEffect(() => {
    const filtered = friends.filter((friend) => {
      const lowercase = friend?.name.toLowerCase();
      const searchTerm = query.toString().toLowerCase();
      return lowercase.indexOf(searchTerm) > -1;
    });

    setAllFriends(filtered);
  }, [friends, query]);

  useImperativeHandle(ref, () => ({
    show: localRef?.current?.present,
  }));

  return (
    <BottomSheetModal
      backgroundStyle={tw`bg-transparent`}
      index={1}
      ref={localRef}
      snapPoints={snapPoints}
      handleComponent={null}
    >
      <SafeView style="bg-transparent">
        <BlurView
          intensity={75}
          style={tw`flex-1 rounded-t-3xl overflow-hidden`}
          tint="dark"
        >
          <View style={tw`flex-1 px-6`}>
            <View
              style={tw`bg-text-2 h-1 w-24 self-center my-5 rounded-full`}
            />

            <Text
              style={tw.style(`text-white text-center text-lg leading-none`, {
                fontFamily: "Cabin_600SemiBold",
              })}
            >
              Page Friends
            </Text>

            <InviteCard style="mt-4" />

            <BlurView
              intensity={15}
              style={tw`flex-row h-[45px] rounded-xl overflow-hidden mt-4 items-center px-3`}
            >
              <SearchIconGray />

              <BottomSheetTextInput
                onChangeText={setQuery}
                placeholder="Search Friends"
                placeholderTextColor="#797979"
                selectionColor="#797979"
                style={tw`flex-1 ml-2 text-white`}
                value={query}
              />

              {query?.length > 0 ? (
                <TouchableOpacity onPress={() => setQuery("")}>
                  <AntDesign name="close" size={16} color="#797979" />
                </TouchableOpacity>
              ) : null}
            </BlurView>

            {friends?.length > 0 ? (
              <BottomSheetFlatList
                ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
                ListHeaderComponent={
                  <Everyone
                    friends={friends}
                    setSelected={setSelected}
                    selected={selected}
                  />
                }
                contentContainerStyle={tw`pb-10`}
                data={allFriends}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <FriendCard
                    checked={() => evaluateCheck(item)}
                    data={item}
                    onCheck={() => onCheck(item)}
                  />
                )}
                showsVerticalScrollIndicator={false}
                style={tw`my-2 pt-4`}
              />
            ) : (
              <View style={tw`flex-1 justify-center gap-y-1`}>
                <Text
                  style={tw.style(
                    `text-gray-4 text-center text-lg leading-none`,
                    {
                      fontFamily: "Cabin_600SemiBold",
                    },
                  )}
                >
                  No one here yet
                </Text>

                <Text
                  style={tw.style(
                    `text-gray-4 text-center text-lg leading-none`,
                    {
                      fontFamily: "Cabin_600SemiBold",
                    },
                  )}
                >
                  Invite friends to start paging
                </Text>
              </View>
            )}
          </View>

          {friends?.length === 0 ? (
            <View style={tw`px-6`}>
              <Button
                onPress={() => {
                  localRef?.current?.close();
                  router.push("/friends");
                }}
                style={`h-[45px] self-center w-full ${
                  keyboardVisible ? "mb-2" : "mb-10"
                }`}
                variant="dark"
              >
                Invite friends
              </Button>
            </View>
          ) : selected?.length > 0 ? (
            <>
              <View style={tw`mb-5`}>
                <View style={tw`bg-gray-3 h-[1px] w-full`} />
                <BottomSheetTextInput
                  maxLength={60}
                  onChangeText={setNote}
                  placeholder="Write a note..."
                  placeholderTextColor="#858585"
                  selectionColor="white"
                  style={tw.style(`h-[45px] px-6 text-white`, {
                    fontFamily: "Cabin_400Regular",
                  })}
                  value={note}
                />
                <View style={tw`bg-gray-3 h-[1px] w-full`} />
              </View>

              <View style={tw`px-6`}>
                <Button
                  onPress={() => {
                    onSelected(selected, note.trim());

                    setNote("");
                    setQuery("");
                    setSelected([]);
                    localRef?.current?.close();
                  }}
                  style={`h-[45px] self-center w-full ${
                    keyboardVisible ? "mb-2" : "mb-10"
                  }`}
                >
                  Ask if they're free
                </Button>
              </View>
            </>
          ) : null}
        </BlurView>
      </SafeView>
    </BottomSheetModal>
  );
});

function Everyone({ friends, setSelected, selected }) {
  const checked = friends?.length === selected?.length;

  return (
    <TouchableOpacity
      onPress={() => {
        if (checked) {
          setSelected([]);
        } else {
          setSelected(friends);
        }
      }}
      style={tw`flex-row items-center mb-[20px]`}
    >
      <BlurView
        intensity={15}
        style={tw`h-[45px] w-[45px] rounded-full overflow-hidden items-center justify-center`}
      >
        <Text style={tw`text-lg pl-[2px] pt-[2px]`}>🌎</Text>
      </BlurView>

      <Text
        style={tw.style(
          `flex-1 text-base text-text-2 ml-3 leading-none`,
          checked ? "text-white" : "text-text-2",
          {
            fontFamily: "Cabin_700Bold",
          },
        )}
      >
        Page All
      </Text>

      <Checkbox
        color={checked ? "#43C37C" : undefined}
        onValueChange={() => {
          if (checked) {
            setSelected([]);
          } else {
            setSelected(friends);
          }
        }}
        style={tw`border-text-2 rounded-full h-6 w-6`}
        value={checked}
      />
    </TouchableOpacity>
  );
}

export default FriendList;
