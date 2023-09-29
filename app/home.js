import { memo, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SplashScreen, router } from "expo-router";

import tw from "@utils/tailwind";
import User from "@components/User";
import useUser from "@hooks/useUser";
import SafeView from "@components/SafeView";
import SearchIcon from "@assets/svgs/SearchIcon";
import Button from "@components/Button";

export default function Home() {
  const [busy, setBusy] = useState();
  const [free, setFree] = useState();
  const { userData, userLoading } = useUser({
    withFriends: true,
  });

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (userData) {
      const busy = [];
      const free = [];

      userData?.friendList?.map((friend) => {
        if (friend?.freeTill) {
          free.push(friend);
        } else {
          busy.push(friend);
        }
      });

      setBusy(busy);
      setFree(free);
    }
  }, [userData]);

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
      <View style={tw`flex flex-1 px-6 pt-4`}>
        <Header onSearch={() => router.push("/friends")} />

        <View style={tw`flex flex-1 pb-2`}>
          {busy ? (
            <FlatList
              ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
              ListHeaderComponent={<FreeFriends free={busy} />}
              columnWrapperStyle={tw`justify-between`}
              contentContainerStyle={tw`pt-6 pb-10`}
              data={[...busy, ...busy]}
              estimatedItemSize={114}
              numColumns={3}
              renderItem={({ item }) => (
                <User data={item} disabled title="😴" />
              )}
              showsVerticalScrollIndicator={false}
            />
          ) : null}
        </View>

        <Button textStyle="leading-tight" style="mb-4" variant="dark">
          {` Page friends  📟`}
        </Button>
      </View>
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
            columnWrapperStyle={tw`justify-between`}
            data={[...free, ...free]}
            estimatedItemSize={114}
            numColumns={3}
            renderItem={({ item }) => <User data={item} free title="1hr 👋🏻" />}
          />
        </>
      ) : null}

      <Text
        style={tw.style(`text-lg text-white leading-snug mt-8 mb-6`, {
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
