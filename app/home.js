import { memo, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as Notifications from "expo-notifications";
import { isAfter, isWithinInterval } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { SplashScreen, router, useNavigation } from "expo-router";

import tw from "@utils/tailwind";
import User from "@components/User";
import useUser from "@hooks/useUser";
import SafeView from "@components/SafeView";
import useFirebase from "@hooks/useFirebase";
import { isPageValid } from "@utils/helpers";
import PageSheet from "@components/PageSheet";
import InviteUser from "@components/InviteUser";
import SearchIcon from "@assets/svgs/SearchIcon";
import useGetPages from "@hooks/queries/useGetPages";
import NoFriendsSheet from "@components/NoFriendsSheet";
import useGetFriends from "@hooks/queries/useGetFriends";

export default function Home() {
  const noFriendsRef = useRef();
  const pageSheetRef = useRef();
  const { userData } = useUser();
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
      let pageDetails = null;

      friends.map((friend) => {
        let isFree = false;
        let hasSentPage = false;

        pages?.sent?.map((page) => {
          if (page?.to === friend?.id && isPageValid(page?.validTill)) {
            hasSentPage = true;
          }

          if (page?.response?.free) {
            if (isPageValid(page?.response?.freeTill)) {
              isFree = true;
            }
          } else {
            if (page?.response?.freeFrom) {
              const current = new Date();
              const start = new Date(page?.response?.freeFrom);
              const end = new Date(page?.response?.freeTill);

              if (isWithinInterval(current, { start, end })) {
                isFree = true;
              } else {
                if (isAfter(new Date(page?.response?.freeFrom), new Date())) {
                  extras = {
                    freeFrom: page?.response?.freeFrom,
                  };
                }
              }
            }
          }
        });

        pages?.received?.find((page) => {
          if (page?.from === friend?.id && isPageValid(page?.validTill)) {
            isFree = true;

            if (pageDetails === null && !page?.response) {
              pageDetails = {
                from: friend,
                pageId: page?.id,
              };
            }
          }
        });

        if (isFree) {
          free.push({ ...extras, ...friend });
        } else {
          all.push({
            ...extras,
            ...friend,
            sent: hasSentPage,
          });
        }
      });

      setAll(all);
      setFree(free);

      if (pageDetails) {
        router.push({
          pathname: "/page",
          params: {
            from: JSON.stringify(pageDetails?.from),
            pageId: pageDetails?.pageId,
          },
        });
      }
    }
  }, [friends, pages]);

  useEffect(() => {
    if (
      lastNotificationResponse?.notification?.request?.content?.data?.action ===
      "request"
    ) {
      router.push("/friends");
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
      <View style={tw`flex flex-1 px-6 pt-2`}>
        <Header onLogout={logout} onSearch={() => router.push("/friends")} />

        {friends?.length > 0 ? (
          <View style={tw`flex flex-1 mb-2`}>
            <FlatList
              ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
              ListHeaderComponent={<FreeFriends all={all} free={free} />}
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
                  freeFrom={item?.freeFrom}
                  onPress={() =>
                    router.push({
                      pathname: "/contact",
                      params: {
                        data: JSON.stringify({
                          ...item,
                          free: false,
                          paged: item?.sent,
                        }),
                      },
                    })
                  }
                  stroke={item?.sent}
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

      <PageSheet ref={pageSheetRef} />
      <NoFriendsSheet ref={noFriendsRef} />
    </SafeView>
  );
}

const FreeFriends = memo(({ all, free }) => {
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
                stroke
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

function Header({ onLogout, onSearch }) {
  return (
    <View style={tw`flex flex-row justify-center mb-2`}>
      <TouchableOpacity onPress={onLogout}>
        <Text
          style={tw.style(`text-3xl text-text-1`, {
            fontFamily: "Lalezar_400Regular",
          })}
        >
          pager
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onSearch} style={tw`absolute right-0`}>
        <SearchIcon />
      </TouchableOpacity>
    </View>
  );
}
