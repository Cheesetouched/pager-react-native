import { memo, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as Notifications from "expo-notifications";
import { SplashScreen, router, useNavigation } from "expo-router";

import tw from "@utils/tailwind";
import User from "@components/User";
import useUser from "@hooks/useUser";
import SafeView from "@components/SafeView";
import useFirebase from "@hooks/useFirebase";
import PageSheet from "@components/PageSheet";
import InviteUser from "@components/InviteUser";
import SearchIcon from "@assets/svgs/SearchIcon";
import NoFriendsSheet from "@components/NoFriendsSheet";

export default function Home() {
  const noFriendsRef = useRef();
  const pageSheetRef = useRef();
  const navigation = useNavigation();
  const { userData, userLoading } = useUser();
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
    if (
      lastNotificationResponse?.notification?.request?.content?.data?.action ===
      "request"
    ) {
      router.push("/friends");
    }
  }, [lastNotificationResponse]);

  if (!userData) {
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
      <View style={tw`flex flex-1 px-6 pt-2`}>
        <Header onLogout={logout} onSearch={() => router.push("/friends")} />

        {userData?.friendList?.length > 0 ? (
          <View style={tw`flex flex-1 mb-2`}>
            {false ? (
              <FlatList
                ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
                ListHeaderComponent={<FreeFriends free={[]} />}
                columnWrapperStyle={tw`justify-between`}
                contentContainerStyle={tw`pt-6 pb-10`}
                data={[]}
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
        All friends 💤
      </Text>
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
