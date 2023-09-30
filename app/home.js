import { memo, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SplashScreen, router } from "expo-router";
import { differenceInMilliseconds } from "date-fns";

import tw from "@utils/tailwind";
import User from "@components/User";
import useUser from "@hooks/useUser";
import Button from "@components/Button";
import SafeView from "@components/SafeView";
import useInterval from "@hooks/useInterval";
import PageSheet from "@components/PageSheet";
import InviteUser from "@components/InviteUser";
import SearchIcon from "@assets/svgs/SearchIcon";
import { isFree, msToTime } from "@utils/helpers";
import useMarkBusy from "@hooks/mutations/useMarkBusy";
import NoFriendsSheet from "@components/NoFriendsSheet";
import useOptimisticUpdate from "@hooks/useOptimisticUpdate";

export default function Home() {
  const noFriendsRef = useRef();
  const pageSheetRef = useRef();
  const { markBusy } = useMarkBusy();
  const [busy, setBusy] = useState();
  const [free, setFree] = useState();
  const update = useOptimisticUpdate();
  const [timer, setTimer] = useState(0);
  const [delay, setDelay] = useState(null);
  const [ready, setReady] = useState(false);
  const { userData, userLoading } = useUser({ withFriends: true });

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (userData) {
      const busy = [];
      const free = [];
      const isUserFree = isFree(userData?.freeTill);

      userData?.friendList?.map((friend) => {
        if (isFree(friend?.freeTill)) {
          free.push(friend);
        } else {
          busy.push(friend);
        }
      });

      setBusy(busy);
      setFree(free);

      if (isUserFree) {
        const diff = differenceInMilliseconds(
          new Date(userData?.freeTill),
          new Date(Date.now()),
        );

        setDelay(1000);
        setTimer(diff);
      }

      if (free?.length > 0 && !isUserFree) {
        router.push("/constraint");
        setTimeout(() => {
          setReady(true);
        }, 200);
      } else {
        setReady(true);
      }
    }
  }, [userData]);

  useInterval(() => {
    if (timer <= 1000) {
      setDelay(null);

      update(["user", userData?.id], (old) => ({
        ...old,
        freeTill: null,
      }));
    } else {
      setTimer(timer - 1000);
    }
  }, delay);

  if (!userData || !ready) {
    return (
      <SafeView>
        <View style={tw`flex flex-1 items-center justify-center`}>
          {userLoading ? <ActivityIndicator size="large" /> : null}
        </View>
      </SafeView>
    );
  }

  return (
    <SafeView>
      <View style={tw`flex flex-1 px-6 pt-4`}>
        <Header onSearch={() => router.push("/friends")} />

        {userData?.friendList?.length > 0 ? (
          <View style={tw`flex flex-1 mb-2`}>
            {busy ? (
              <FlatList
                ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
                ListHeaderComponent={<FreeFriends free={free} />}
                columnWrapperStyle={tw`justify-between`}
                contentContainerStyle={tw`pt-6 pb-10`}
                data={busy}
                estimatedItemSize={114}
                numColumns={3}
                renderItem={({ item }) => (
                  <User
                    data={item}
                    disabled
                    onPress={() =>
                      router.push({
                        pathname: "/contact",
                        params: {
                          data: JSON.stringify({
                            ...item,
                            free: false,
                          }),
                        },
                      })
                    }
                  />
                )}
                showsVerticalScrollIndicator={false}
              />
            ) : null}
          </View>
        ) : (
          <View style={tw`flex flex-1 mb-2`}>
            <Text
              style={tw.style(`text-text-2 text-lg pt-6`, {
                fontFamily: "Cabin_700Bold",
              })}
            >
              Pretty empty in here...
            </Text>

            <InviteUser
              onPress={() => router.push("/friends")}
              style={tw`mt-5`}
            />
          </View>
        )}

        {isFree(userData?.freeTill) ? (
          <View style={tw`items-center mb-2`}>
            <Text
              style={tw.style(`text-white text-lg`, {
                fontFamily: "Cabin_400Regular",
              })}
            >
              You’re now marked free for
            </Text>

            <Text
              style={tw.style(`text-text-1 text-2xl mt-3`, {
                fontFamily: "Cabin_700Bold",
              })}
            >
              {msToTime(timer)} mins
            </Text>

            <TouchableOpacity onPress={markBusy}>
              <Text
                style={tw.style(`text-gray-4 text-lg mt-5`, {
                  fontFamily: "Cabin_400Regular",
                })}
              >
                cancel
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Button
            loading={userLoading}
            onPress={() => {
              if (userData?.friendList?.length > 0) {
                pageSheetRef?.current?.show();
              } else {
                noFriendsRef?.current?.show();
              }
            }}
            textStyle="leading-tight"
            style="mb-4"
            variant="dark"
          >
            Page friends 📟
          </Button>
        )}
      </View>

      <PageSheet ref={pageSheetRef} />
      <NoFriendsSheet ref={noFriendsRef} />
    </SafeView>
  );
}

const FreeFriends = memo(({ free }) => {
  return (
    <View>
      {free?.length > 0 ? (
        <>
          <Text
            style={tw.style(`text-lg text-white leading-snug mb-6`, {
              fontFamily: "Cabin_700Bold",
            })}
          >
            Free to Chat 👋🏻
          </Text>

          <FlatList
            ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
            style={tw`mb-8`}
            columnWrapperStyle={tw`justify-between`}
            data={free}
            estimatedItemSize={114}
            numColumns={3}
            renderItem={({ item }) => (
              <User
                data={item}
                free
                onPress={() =>
                  router.push({
                    pathname: "/contact",
                    params: {
                      data: JSON.stringify({
                        ...item,
                        free: true,
                      }),
                    },
                  })
                }
              />
            )}
          />
        </>
      ) : null}

      <Text
        style={tw.style(`text-lg text-white leading-snug mb-6`, {
          fontFamily: "Cabin_700Bold",
        })}
      >
        Away 💤
      </Text>
    </View>
  );
});

function Header({ onSearch }) {
  return (
    <View style={tw`flex flex-row justify-center mb-2`}>
      <Text
        style={tw.style(`text-3xl text-text-1`, {
          fontFamily: "Lalezar_400Regular",
        })}
      >
        pager
      </Text>

      <TouchableOpacity onPress={onSearch} style={tw`absolute right-0`}>
        <SearchIcon />
      </TouchableOpacity>
    </View>
  );
}
