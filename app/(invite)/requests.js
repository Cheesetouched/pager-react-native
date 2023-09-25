import { ActivityIndicator, Text, View } from "react-native";

import { FlashList } from "@shopify/flash-list";

import tw from "@utils/tailwind";
import SafeView from "@components/SafeView";
import RequestCard from "@components/RequestCard";
import useGetRequests from "@hooks/queries/useGetRequests";
import { useQueryClient } from "@tanstack/react-query";
import useFirebase from "@hooks/useFirebase";

export default function Requests() {
  const { user } = useFirebase();
  const { getting, requests } = useGetRequests();
  const client = useQueryClient();

  console.log(client.getQueryData(["user", user?.uid]));
  //console.log(client.getQueryData(["requests", user?.uid]));

  return (
    <SafeView>
      <View style={tw`flex flex-1 px-4 pt-4 pb-12`}>
        <Text
          style={tw.style(
            `flex text-text-1 text-2xl font-medium self-center mb-2`,
            {
              fontFamily: "NunitoSans_700Bold",
            },
          )}
        >
          friend requests
        </Text>

        {requests?.length > 0 ? (
          <FlashList
            ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
            contentContainerStyle={tw`pt-4`}
            data={requests}
            estimatedItemSize={68}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => <RequestCard data={item} />}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={tw`flex flex-1 items-center justify-center`}>
            {getting ? (
              <ActivityIndicator size="large" />
            ) : (
              <Text
                style={tw.style(`text-text-gray text-xl text-center`, {
                  fontFamily: "NunitoSans_700Bold",
                })}
              >
                no requests (yet) 😕
              </Text>
            )}
          </View>
        )}
      </View>
    </SafeView>
  );
}
