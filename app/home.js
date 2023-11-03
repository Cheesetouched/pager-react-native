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
import { Image } from "expo-image";
import Toast from "react-native-toast-message";
import * as Notifications from "expo-notifications";
import { useQueryClient } from "@tanstack/react-query";
import { SplashScreen, router, useLocalSearchParams } from "expo-router";

import tw from "@utils/tailwind";
import User from "@components/User";
import Logo from "@assets/logo.png";
import useUser from "@hooks/useUser";
import { isValid } from "@utils/helpers";
import SafeView from "@components/SafeView";
import useMixpanel from "@hooks/useMixpanel";
import BadgeIcon from "@components/BadgeIcon";
import FriendList from "@components/FriendList";
import InviteUser from "@components/InviteUser";
import SearchIcon from "@assets/svgs/SearchIcon";
import useCoreAction from "@hooks/useCoreAction";
import StatusSheet from "@components/StatusSheet";
import MessageIcon from "@assets/svgs/MessageIcon";
import FriendsIcon from "@assets/svgs/FriendsIcon";
import useLocalStorage from "@hooks/useLocalStorage";
import useGetPages from "@hooks/queries/useGetPages";
import NoFriendsSheet from "@components/NoFriendsSheet";
import useGetFriends from "@hooks/queries/useGetFriends";
import useGetRequests from "@hooks/queries/useGetRequests";
import useGetInviteCount from "@hooks/queries/useGetInviteCount";
import useGetDetailedPages from "@hooks/queries/useGetDetailedPages";

export default function Home() {
  const noFriendsRef = useRef();
  const mixpanel = useMixpanel();
  const closedStuff = useRef([]);
  const statusSheetRef = useRef();
  const { page } = useCoreAction();
  const [all, setAll] = useState();
  const [free, setFree] = useState();
  const friendListRef = useRef(null);
  const queryClient = useQueryClient();
  const { requests } = useGetRequests();
  const params = useLocalSearchParams();
  const localStorage = useLocalStorage();
  const { invites } = useGetInviteCount();
  const [freeLater, setFreeLater] = useState();
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
        const all = [];
        const free = [];
        const freeLater = [];
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
            if (extras?.freeFrom) {
              freeLater.push(user);
            }
          }

          all.push(user);
        });

        // Passing an extra value to keep the 3x3 grid in shape
        if (freeLater?.length % 3 === 2) {
          freeLater.push(null);
        }

        if (free?.length % 3 === 2) {
          free.push(null);
        }

        setAll(all);
        setFree(free);
        setFreeLater(freeLater);

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

        // Opening contact sheet if a user is free to chat
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

  if (
    !userData ||
    !friends ||
    invites === undefined ||
    !pages ||
    !free ||
    !freeLater
  ) {
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

        {invites >= 1 ? (
          free?.length > 0 || freeLater?.length > 0 ? (
            <View style={tw`flex flex-1`}>
              <FlatList
                ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
                ListHeaderComponent={
                  <FreeFriends
                    freeLater={freeLater}
                    free={free}
                    mixpanel={mixpanel}
                  />
                }
                columnWrapperStyle={tw`justify-between`}
                contentContainerStyle={tw`pt-6 pb-10`}
                data={freeLater}
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
                    return (
                      <User
                        data={item}
                        free={item?.free}
                        indicator={false}
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
                  } else {
                    return <View style={tw`w-[80px]`} />;
                  }
                }}
                showsVerticalScrollIndicator={false}
              />
            </View>
          ) : null
        ) : (
          <ScrollView
            contentContainerStyle={tw`flex-1 items-center justify-center`}
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
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={tw.style(`text-gray-2 text-xl`, {
                fontFamily: "Lalezar_400Regular",
              })}
            >
              INVITE A FRIEND TO
            </Text>

            <Text
              style={tw.style(`text-gray-2 text-xl`, {
                fontFamily: "Lalezar_400Regular",
              })}
            >
              USE PAGER
            </Text>

            <InviteUser
              onPress={() => router.push("/friends")}
              style={tw`mt-10`}
            />
          </ScrollView>
        )}

        {invites >= 1 ? (
          <>
            {free?.length > 0 || freeLater?.length > 0 ? (
              <Pager onPress={() => friendListRef.current.show()} />
            ) : (
              <PagerFullView
                onPress={() => friendListRef.current.show()}
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
              />
            )}
          </>
        ) : null}
      </View>

      {all !== undefined ? (
        <FriendList
          friends={all}
          onSelected={async (friends, note) => {
            Toast.show({
              position: "bottom",
              type: "main",
              text1:
                "Woo! We’ve sent your page and will notify you when anyone responds.",
            });

            await Promise.all(
              friends?.map((friend) =>
                page({
                  from: userData?.id,
                  to: friend?.id,
                  note,
                }),
              ),
            );
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

const FreeFriends = memo(({ freeLater, free, mixpanel }) => {
  return (
    <View>
      {free?.length > 0 ? (
        <>
          <Text
            style={tw.style(`text-lg text-white leading-snug mb-5`, {
              fontFamily: "Cabin_700Bold",
            })}
          >
            Free to chat 👋🏻
          </Text>

          <FlatList
            ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
            style={tw`mb-10`}
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
                    indicator={false}
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
                return <View style={tw`w-[80px]`} />;
              }
            }}
          />
        </>
      ) : null}

      {freeLater?.length > 0 ? (
        <Text
          style={tw.style(`text-lg text-white leading-snug mb-5`, {
            fontFamily: "Cabin_700Bold",
          })}
        >
          Free later 🕒
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

function Pager({ onPress }) {
  return (
    <View style={tw`justify-center items-center pt-2 mb-4`}>
      <Text
        style={tw.style(`text-gray-2 text-xl`, {
          fontFamily: "Lalezar_400Regular",
        })}
      >
        Tap the pager button to
      </Text>

      <Text
        style={tw.style(`text-gray-2 text-xl`, {
          fontFamily: "Lalezar_400Regular",
        })}
      >
        ping someone
      </Text>

      <TouchableOpacity
        onPress={onPress}
        style={tw`border border-gray-4 mt-5 rounded-full p-[6px] border-dashed shadow-xl shadow-black bg-bg`}
      >
        <Image source={Logo} style={tw`h-[65px] w-[65px]`} />
      </TouchableOpacity>
    </View>
  );
}

function PagerFullView({ onPress, refreshControl }) {
  return (
    <ScrollView
      contentContainerStyle={tw`flex-1 justify-center items-center`}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={tw.style(`text-gray-2 text-xl`, {
          fontFamily: "Lalezar_400Regular",
        })}
      >
        Tap the pager button to
      </Text>

      <Text
        style={tw.style(`text-gray-2 text-xl`, {
          fontFamily: "Lalezar_400Regular",
        })}
      >
        ping someone
      </Text>

      <TouchableOpacity
        onPress={onPress}
        style={tw`border border-gray-4 mt-5 rounded-full p-[6px] border-dashed shadow-xl shadow-black bg-bg`}
      >
        <Image source={Logo} style={tw`h-[65px] w-[65px]`} />
      </TouchableOpacity>
    </ScrollView>
  );
}
