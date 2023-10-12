import { memo, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { isAfter } from "date-fns";
import * as Notifications from "expo-notifications";
import { useQueryClient } from "@tanstack/react-query";
import { SplashScreen, router, useNavigation } from "expo-router";

import tw from "@utils/tailwind";
import User from "@components/User";
import useUser from "@hooks/useUser";
import Button from "@components/Button";
import SafeView from "@components/SafeView";
import useMixpanel from "@hooks/useMixpanel";
import useFirebase from "@hooks/useFirebase";
import PageSheet from "@components/PageSheet";
import InviteUser from "@components/InviteUser";
import SearchIcon from "@assets/svgs/SearchIcon";
import NotifySheet from "@components/NotifySheet";
import { freeFor, isValid } from "@utils/helpers";
import MessageIcon from "@assets/svgs/MessageIcon";
import FriendsIcon from "@assets/svgs/FriendsIcon";
import useGetPages from "@hooks/queries/useGetPages";
import NoFriendsSheet from "@components/NoFriendsSheet";
import useGetFriends from "@hooks/queries/useGetFriends";
import useGetRequests from "@hooks/queries/useGetRequests";
import useGetDetailedPages from "@hooks/queries/useGetDetailedPages";

function isMarkedFree(freeTill) {
  if (!freeTill) {
    return false;
  }

  if (isValid(freeTill)) {
    return true;
  } else {
    return false;
  }
}

export default function Home() {
  useGetRequests();
  useGetDetailedPages();
  const noFriendsRef = useRef();
  const pageSheetRef = useRef();
  const mixpanel = useMixpanel();
  const { userData } = useUser();
  const notifySheetRef = useRef();
  const [all, setAll] = useState();
  const [free, setFree] = useState();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { pages, refetchingPages } = useGetPages();
  const { friends, refetchingFriends } = useGetFriends(userData?.friends);
  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  const { logout } = useFirebase({
    onLogout: () => {
      navigation.reset({
        index: 0,
        routes: [{ name: "(onboarding)/handle" }],
      });
    },
  });

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (friends && pages) {
      const all = [];
      const free = [];
      let extras = {};

      friends.map((friend) => {
        let isFree = false;
        let havePaged = false;

        pages?.sent?.map((page) => {
          if (page?.to === friend?.id && isValid(page?.validTill)) {
            havePaged = true;
          }

          if (page?.response?.free) {
            if (isValid(page?.response?.freeTill)) {
              isFree = true;
              extras = { freeTill: page?.response?.freeTill };
            }
          } else {
            if (page?.response?.freeFrom) {
              if (isAfter(new Date(page?.response?.freeFrom), new Date())) {
                extras = { freeFrom: page?.response?.freeFrom };
              }
            }
          }
        });

        pages?.received?.find((page) => {
          if (page?.from === friend?.id && isValid(page?.validTill)) {
            isFree = true;
            extras = { freeTill: page?.validTill };
          }
        });

        if (isFree) {
          free.push({ ...extras, ...friend });
        } else {
          all.push({
            ...extras,
            ...friend,
            paged: havePaged,
          });
        }
      });

      setAll(all);
      setFree(free);
    }
  }, [friends, pages, refetchingPages]);

  useEffect(() => {
    if (
      lastNotificationResponse?.notification?.request?.content?.data?.action ===
      "open_requests"
    ) {
      router.push("/requests");
    }
  }, [lastNotificationResponse]);

  if (!userData || !friends || !pages) {
    return (
      <SafeView>
        <View style={tw`flex flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" />
        </View>
      </SafeView>
    );
  }

  return (
    <SafeView>
      <View style={tw`relative flex flex-1 px-6 pt-2`}>
        <Header
          onLogout={logout}
          onFriends={() => router.push("/requests")}
          onPages={() => router.push("/pages")}
          onSearch={() => router.push("/friends")}
        />

        {friends?.length > 0 ? (
          <View style={tw`flex flex-1 mb-2`}>
            <FlatList
              ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
              ListHeaderComponent={
                <FreeFriends all={all} free={free} mixpanel={mixpanel} />
              }
              columnWrapperStyle={tw`justify-between`}
              contentContainerStyle={tw`pt-6 pb-10`}
              data={all}
              estimatedItemSize={114}
              numColumns={3}
              refreshControl={
                <RefreshControl
                  refreshing={refetchingFriends || refetchingPages}
                  onRefresh={() => {
                    queryClient.invalidateQueries(["friends"]);
                    queryClient.invalidateQueries(["pages", userData?.id]);
                  }}
                />
              }
              renderItem={({ item }) => (
                <User
                  data={item}
                  onPress={() => {
                    mixpanel.track("tapped_user");

                    router.push({
                      pathname: "/contact",
                      params: {
                        data: JSON.stringify({
                          ...item,
                          free: false,
                          paged: item?.paged,
                        }),
                      },
                    });
                  }}
                  paged={item?.paged}
                />
              )}
              showsVerticalScrollIndicator={false}
            />
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
      </View>

      {friends?.length > 0 && isMarkedFree(userData?.markedFreeTill) ? (
        <View style={tw`gap-y-1 mb-7`}>
          <Text
            style={tw.style(`text-white text-sm text-center`, {
              fontFamily: "Cabin_400Regular",
            })}
          >
            You're now marked free for
          </Text>

          <Text
            style={tw.style(`text-text-1 text-base text-center`, {
              fontFamily: "Cabin_700Bold",
            })}
          >
            {freeFor(userData?.markedFreeTill, "long")}
          </Text>
        </View>
      ) : null}

      {friends?.length > 0 ? (
        isMarkedFree(userData?.markedFreeTill) ? (
          <Button
            onPress={() => pageSheetRef?.current?.show()}
            style="absolute h-[50px] w-[50px] bottom-16 right-6"
            textStyle="text-xl leading-0"
          >
            👋🏻
          </Button>
        ) : (
          <Button
            onPress={() => pageSheetRef?.current?.show()}
            style="absolute h-[50px] w-[50px] bottom-16 right-6"
            textStyle="text-xl leading-0"
            variant="dark"
          >
            😴
          </Button>
        )
      ) : null}

      <NotifySheet ref={notifySheetRef} />

      <NoFriendsSheet ref={noFriendsRef} />

      <PageSheet
        onFree={() => notifySheetRef?.current?.show()}
        ref={pageSheetRef}
      />
    </SafeView>
  );
}

const FreeFriends = memo(({ all, free, mixpanel }) => {
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
                onPress={() => {
                  mixpanel.track("tapped_user");

                  router.push({
                    pathname: "/contact",
                    params: {
                      data: JSON.stringify({
                        ...item,
                        free: true,
                      }),
                    },
                  });
                }}
              />
            )}
          />
        </>
      ) : null}

      {all?.length > 0 ? (
        <Text
          style={tw.style(`text-lg text-white leading-snug mb-6`, {
            fontFamily: "Cabin_700Bold",
          })}
        >
          All friends 💤
        </Text>
      ) : null}
    </View>
  );
});

function Header({ onLogout, onFriends, onPages, onSearch }) {
  return (
    <View style={tw`flex flex-row justify-center mb-2`}>
      <TouchableOpacity onPress={onFriends} style={tw`absolute left-0 mt-1`}>
        <FriendsIcon />
      </TouchableOpacity>

      <TouchableOpacity onPress={onLogout}>
        <Text
          style={tw.style(`text-3xl text-text-1`, {
            fontFamily: "Lalezar_400Regular",
          })}
        >
          pager
        </Text>
      </TouchableOpacity>

      <View style={tw`absolute flex-row items-center right-0 gap-x-6`}>
        <TouchableOpacity onPress={onPages} style={tw`mb-[2px]`}>
          <MessageIcon />
        </TouchableOpacity>

        <TouchableOpacity onPress={onSearch}>
          <SearchIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
}
