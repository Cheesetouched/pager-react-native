import { memo, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
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
  const closedStuff = useRef([]);
  const statusSheetRef = useRef();
  const [all, setAll] = useState();
  const [away, setAway] = useState();
  const [free, setFree] = useState();
  const friendListRef = useRef(null);
  const queryClient = useQueryClient();
  const { requests } = useGetRequests();
  const params = useLocalSearchParams();
  const localStorage = useLocalStorage();
  const { notifyUsers } = usePushNotification();
  const { userData, refetchingUser } = useUser();
  const { pages, refetchingPages } = useGetPages();
  const { pages: detailedPages } = useGetDetailedPages();
  const lastNotif = Notifications.useLastNotificationResponse();
  const [badges, setBadges] = useState({ requests: 0, pages: 0 });
  const { friends, refetchingFriends } = useGetFriends(userData?.friends);

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

      detailedPages?.received?.external?.map((page) => {
        if (!page?.response) {
          awaitingResponse += 1;
        }
      });

      detailedPages?.received?.internal?.map((page) => {
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
    async function coreLogic() {
      if (friends && pages && !refetchingFriends && !refetchingPages) {
        const away = [];
        const free = [];
        let openContact = null;
        let latestValidPage = null;

        // Getting last notif data
        const notif = await Notifications.getLastNotificationResponseAsync();
        const notifData = notif?.notification?.request?.content?.data;

        friends.map((friend) => {
          let extras = {};
          let isFree = false;
          let havePaged = false;

          const sentPage = pages?.sent?.find((page) => {
            if (page?.to === friend?.id) {
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

            if (!isFree && isValid(sentPage?.validTill)) {
              havePaged = true;
            }
          }

          if (receivedPage) {
            isFree = true;
            extras = { freeTill: receivedPage?.validTill };

            if (!receivedPage?.response && latestValidPage === null) {
              latestValidPage = {
                from: JSON.stringify(friend),
                page: JSON.stringify(receivedPage),
              };
            }
          }

          if (isValid(friend?.markedFreeTill)) {
            isFree = true;
            extras = { freeTill: friend?.markedFreeTill };
          }

          const user = {
            ...extras,
            ...friend,
            free: isFree,
            paged: havePaged,
          };

          if (
            notifData?.action === "open_contact" &&
            notifData?.uid === friend?.id
          ) {
            openContact = user;
          }

          if (isFree) {
            free.push(user);
          } else {
            away.push(user);
          }
        });

        // Creating a combined list
        setAll([...away, ...free]);

        // Passing an extra value to keep the 3x3 grid in shape
        if (away?.length % 3 === 1) {
          away.push(null);
        }

        if (free?.length % 3 === 2) {
          free.push(null);
        }

        setAway(away);
        setFree(free);

        // Opening page response sheet if a valid page is found
        if (
          !closedStuff.current.includes(latestValidPage?.page?.id) &&
          latestValidPage !== null
        ) {
          closedStuff.current = [
            ...closedStuff.current,
            latestValidPage?.page?.id,
          ];

          router.push({
            pathname: "/page",
            params: latestValidPage,
          });
        }

        // Opening contact sheet if a user is free to sheet
        if (
          !closedStuff.current.includes(openContact?.id) &&
          openContact !== null
        ) {
          closedStuff.current = [...closedStuff.current, openContact?.id];

          router.push({
            pathname: "/contact",
            params: { data: JSON.stringify(openContact) },
          });
        }
      }
    }

    coreLogic();
  }, [friends, pages, refetchingFriends, refetchingPages]);

  useEffect(() => {
    const notifId = lastNotif?.notification.request.identifier;
    const notifData = lastNotif?.notification?.request?.content?.data;
    const closed = closedStuff.current.includes(notifId);

    if (all && !closed && lastNotif && queryClient && userData) {
      closedStuff.current = [...closedStuff.current, notifId];

      if (notifData?.action === "open_requests") {
        router.push("/requests");
      } else if (notifData?.action === "invalidate_user") {
        queryClient?.invalidateQueries(["user", userData?.id]);
      }
    }
  }, [all, lastNotif, queryClient, userData, refetchingPages]);

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

        {away !== undefined && friends?.length > 0 ? (
          <View style={tw`flex flex-1`}>
            <FlatList
              ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
              ListHeaderComponent={
                <FreeFriends away={away} free={free} mixpanel={mixpanel} />
              }
              columnWrapperStyle={tw`justify-between`}
              contentContainerStyle={tw`pt-6 pb-10`}
              data={["invite", ...away]}
              estimatedItemSize={114}
              numColumns={3}
              refreshControl={
                <RefreshControl
                  refreshing={
                    refetchingFriends || refetchingPages || refetchingUser
                  }
                  onRefresh={() => {
                    queryClient.invalidateQueries(["friends"]);
                    queryClient.invalidateQueries(["user", userData?.id]);
                    queryClient.invalidateQueries(["pages", userData?.id]);
                  }}
                />
              }
              renderItem={({ item }) => {
                if (item !== null) {
                  if (item === "invite") {
                    return (
                      <InviteUser onPress={() => router.push("/friends")} />
                    );
                  } else {
                    return (
                      <User
                        data={item}
                        free={item?.free}
                        onPress={() => {
                          mixpanel.track("tapped_user");

                          router.push({
                            pathname: "/contact",
                            params: { data: JSON.stringify(item) },
                          });
                        }}
                        paged={item?.paged}
                      />
                    );
                  }
                } else {
                  return <View style={tw`w-[92px]`} />;
                }
              }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={
                  refetchingFriends || refetchingPages || refetchingUser
                }
                onRefresh={() => {
                  queryClient.invalidateQueries(["friends"]);
                  queryClient.invalidateQueries(["user", userData?.id]);
                  queryClient.invalidateQueries(["pages", userData?.id]);
                }}
              />
            }
            style={tw`flex flex-1`}
          >
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
          </ScrollView>
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

      {all !== undefined ? (
        <FriendList
          friends={all}
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

const FreeFriends = memo(({ away, free, mixpanel }) => {
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
                    free={item?.free}
                    onPress={() => {
                      mixpanel.track("tapped_user");

                      router.push({
                        pathname: "/contact",
                        params: { data: JSON.stringify(item) },
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

      {away?.length > 0 ? (
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
    <View style={tw`flex flex-row justify-center`}>
      <TouchableOpacity onPress={onFriends} style={tw`absolute left-0`}>
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
        <TouchableOpacity onPress={onPages}>
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
