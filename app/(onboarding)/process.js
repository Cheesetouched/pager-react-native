import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import tw from "@utils/tailwind";
import SafeView from "@components/SafeView";
import useMixpanel from "@hooks/useMixpanel";
import useFirebase from "@hooks/useFirebase";
import useLocalStorage from "@hooks/useLocalStorage";
import useCreateUser from "@hooks/mutations/useCreateUser";

export default function Process() {
  const { user } = useFirebase();
  const mixpanel = useMixpanel();
  const { remove } = useLocalStorage();
  const params = useLocalSearchParams();

  const { createUser } = useCreateUser({
    onSuccess: (_, user) => {
      remove("checkpoint");

      mixpanel.identify(user?.uid);
      mixpanel.getPeople().set("$avatar", user?.data?.dp);
      mixpanel.getPeople().set("handle", user?.data?.handle);
      mixpanel.getPeople().set("$name", user?.data?.name);
      mixpanel.getPeople().set("$phone", user?.data?.phone?.full);

      router.replace({
        pathname: "/friends",
        params: { referrer: "onboarding" },
      });
    },
  });

  useEffect(() => {
    if (params && user?.uid) {
      const userData = {
        ...params,
      };

      userData["phone"] = {
        country_code: userData?.country_code,
        number: userData?.number,
        full: userData?.full,
      };

      userData["friends"] = [];
      userData["sentRequests"] = [];
      userData["pendingRequests"] = [];

      delete userData?.full;
      delete userData?.action;
      delete userData?.number;
      delete userData?.country_code;

      createUser({
        uid: user?.uid,
        data: userData,
      });
    }
  }, [createUser, params, user?.uid]);

  return (
    <SafeView>
      <View style={tw`flex flex-1 px-4 items-center justify-center`}>
        <ActivityIndicator size="large" />

        <Text
          style={tw.style(`flex text-accent text-3xl mt-8 leading-loose`, {
            fontFamily: "Lalezar_400Regular",
          })}
        >
          Setting you up 🫡
        </Text>
      </View>
    </SafeView>
  );
}
