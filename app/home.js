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
import { SplashScreen, router, useLocalSearchParams } from "expo-router";

import tw from "@utils/tailwind";
import User from "@components/User";
import useUser from "@hooks/useUser";
import Button from "@components/Button";
import SafeView from "@components/SafeView";
import useMixpanel from "@hooks/useMixpanel";
import BadgeIcon from "@components/BadgeIcon";
import FriendList from "@components/FriendList";
import InviteUser from "@components/InviteUser";
import SearchIcon from "@assets/svgs/SearchIcon";
import StatusSheet from "@components/StatusSheet";
import { freeFor, isValid } from "@utils/helpers";
import MessageIcon from "@assets/svgs/MessageIcon";
import FriendsIcon from "@assets/svgs/FriendsIcon";
import useLocalStorage from "@hooks/useLocalStorage";
import useGetPages from "@hooks/queries/useGetPages";
import NoFriendsSheet from "@components/NoFriendsSheet";
import useGetFriends from "@hooks/queries/useGetFriends";
import useGetRequests from "@hooks/queries/useGetRequests";
import usePushNotification from "@hooks/usePushNotification";
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
  const noFriendsRef = useRef();
  const mixpanel = useMixpanel();
  const { userData } = useUser();
  const statusSheetRef = useRef();
  const [all, setAll] = useState();
  const [free, setFree] = useState();
  const friendListRef = useRef(null);
  const queryClient = useQueryClient();
  const { requests } = useGetRequests();
  const params = useLocalSearchParams();
  const localStorage = useLocalStorage();
  const { notifyUsers } = usePushNotification();
  const { pages, refetchingPages } = useGetPages();
  const { pages: detailedPages } = useGetDetailedPages();
  const [badges, setBadges] = useState({ requests: 0, pages: 0 });
  const { friends, refetchingFriends } = useGetFriends(userData?.friends);
  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    async function hasSeenWelcomeContext() {
      const welcomeContext = await localStorage.get("welcome_context");
      if (welcomeContext !== "seen") {
        router.push("/welcome_context");
      }
    }

    hasSeenWelcomeContext();
  }, [localStorage]);

  useEffect(() => {
    if (params?.showStatusSheet) {
      statusSheetRef?.current?.show();
    }
  }, [params]);

  useEffect(() => {
    if (requests) {
      setBadges((current) => ({
        ...current,
        requests: requests?.length,
      }));
    }
  }, [requests]);

  useEffect(() => {
    if (detailedPages) {
      let awaitingResponse = 0;

      detailedPages?.received?.map((page) => {
        if (!page?.response) {
          awaitingResponse += 1;
        }
      });

      setBadges((current) => ({
        ...current,
        pages: awaitingResponse,
      }));
    }
  }, [detailedPages]);

  useEffect(() => {
    if (friends && pages) {
      const all = [];
      const free = [];
      let extras = {};

      friends.map((friend) => {
        let isFree = false;
        let havePaged = false;

        if (isValid(friend?.markedFreeTill)) {
          isFree = true;
          extras = { freeTill: friend?.markedFreeTill };
        } else {
          const sentPage = pages?.sent?.find((page) => {
            if (page?.to === friend?.id && isValid(page?.validTill)) {
              return true;
            } else {
              return false;
            }
          });

          const receivedPage = pages?.received?.find((page) => {
            if (page?.from === friend?.id && isValid(page?.validTill)) {
              return true;
            } else {
              return false;
            }
          });

          if (sentPage) {
            if (sentPage?.response?.free) {
              if (isValid(sentPage?.response?.freeTill)) {
                isFree = true;
                extras = { freeTill: sentPage?.response?.freeTill };
              }
            } else {
              if (
                sentPage?.response?.freeFrom &&
                isAfter(sentPage?.response?.freeFrom, new Date())
              ) {
                extras = { freeFrom: sentPage?.response?.freeFrom };
              }
            }

            if (!isFree) {
              havePaged = true;
            }
          }

          if (receivedPage) {
            isFree = true;
            extras = { freeTill: receivedPage?.validTill };
          }
        }

        const user = {
          ...extras,
          ...friend,
          paged: havePaged,
        };

        if (isFree) {
          free.push(user);
        } else {
          all.push(user);
        }
      });

      // Passing an extra value to keep the 3x3 grid in shape
      if (all?.length % 3 === 2) {
        all.push(null);
      }

      if (free?.length % 3 === 2) {
        free.push(null);
      }

      setAll(all);
      setFree(free);
    }
  }, [friends, pages, refetchingPages]);

  useEffect(() => {
    if (lastNotificationResponse && queryClient && userData?.id) {
      const notifAction =
        lastNotificationResponse?.notification?.request?.content?.data?.action;

      if (notifAction === "open_requests") {
        router.push("/requests");
      } else if (notifAction === "invalidate_user") {
        queryClient?.invalidateQueries(["user", userData?.id]);
      }
    }
  }, [lastNotificationResponse, queryClient, userData]);

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
          badges={badges}
          onFriends={() => router.push("/requests")}
          onPages={() => router.push("/pages")}
          onSearch={() => router.push("/friends")}
        />

        {friends?.length > 0 ? (
          <View style={tw`flex flex-1`}>
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
              renderItem={({ item }) => {
                if (item !== null) {
                  return (
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
                  );
                } else {
                  return <View style={tw`w-[92px]`} />;
                }
              }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : (
          <View style={tw`flex flex-1`}>
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
        <View style={tw`gap-y-1 pb-8`}>
          <Text
            style={tw.style(`text-white text-sm text-center pt-2`, {
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
            onPress={() => statusSheetRef?.current?.show()}
            style="absolute h-[50px] w-[50px] bottom-16 right-6"
            textStyle="text-xl leading-0"
          >
            👋🏻
          </Button>
        ) : (
          <Button
            onPress={async () => {
              const statusContext = await localStorage.get("status_context");

              if (statusContext === "seen") {
                statusSheetRef?.current?.show();
              } else {
                router.push("status_context");
              }
            }}
            style="absolute h-[50px] w-[50px] bottom-16 right-6"
            textStyle="text-xl leading-0"
            variant="dark"
          >
            😴
          </Button>
        )
      ) : null}

      {all !== undefined && free !== undefined ? (
        <FriendList
          friends={[...all, ...free]}
          onSelected={(friends) => {
            const pushTokens = friends?.map((friend) => friend?.pushToken);

            notifyUsers(pushTokens, {
              data: { action: "open_contact", uid: userData?.id },
              body: `${userData?.name?.split(" ")[0]} is free to chat! 👋🏻`,
            });
          }}
          ref={friendListRef}
        />
      ) : null}

      <NoFriendsSheet ref={noFriendsRef} />

      <StatusSheet
        onFree={() => friendListRef?.current?.show()}
        ref={statusSheetRef}
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
            renderItem={({ item }) => {
              if (item !== null) {
                return (
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
                );
              } else {
                return <View style={tw`w-[92px]`} />;
              }
            }}
          />
        </>
      ) : null}

      {all?.length > 0 ? (
        <Text
          style={tw.style(`text-lg text-white leading-snug mb-6`, {
            fontFamily: "Cabin_700Bold",
          })}
        >
          Away 💤
        </Text>
      ) : null}
    </View>
  );
});

function Header({ badges, onFriends, onPages, onSearch }) {
  return (
    <View style={tw`flex flex-row justify-center mb-2`}>
      <TouchableOpacity onPress={onFriends} style={tw`absolute left-0 mt-1`}>
        <BadgeIcon count={badges?.requests}>
          <FriendsIcon />
        </BadgeIcon>
      </TouchableOpacity>

      <TouchableOpacity>
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
          <BadgeIcon count={badges?.pages}>
            <MessageIcon />
          </BadgeIcon>
        </TouchableOpacity>

        <TouchableOpacity onPress={onSearch}>
          <SearchIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
}
