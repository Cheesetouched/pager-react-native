import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import tw from "@utils/tailwind";
import SafeView from "@components/SafeView";
import useFirebase from "@hooks/useFirebase";
import useCreateUser from "@mutations/useCreateUser";
import useLocalStorage from "@hooks/useLocalStorage";

export default function Process() {
  const { user } = useFirebase();
  const { remove } = useLocalStorage();
  const params = useLocalSearchParams();

  const { createUser } = useCreateUser({
    onSuccess: () => {
      remove("checkpoint");
      router.replace("home");
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
      <View style={tw`flex flex-1 px-4 pt-4 items-center justify-center`}>
        <ActivityIndicator size="large" />

        <Text
          style={tw.style(`flex text-neon text-2xl mt-8`, {
            fontFamily: "NunitoSans_700Bold",
          })}
        >
          setting you up... 🤗
        </Text>
      </View>
    </SafeView>
  );
}
