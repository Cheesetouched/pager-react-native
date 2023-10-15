import { ActivityIndicator, Text, View } from "react-native";

import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import tw from "@utils/tailwind";
import Button from "@components/Button";
import SafeView from "@components/SafeView";
import RequestCard from "@components/RequestCard";
import useGetRequests from "@hooks/queries/useGetRequests";

export default function Requests() {
  const { refetching, requests } = useGetRequests();

  return (
    <BlurView intensity={75} style={tw`flex flex-1`} tint="dark">
      <SafeView style="bg-transparent px-6 pb-4">
        <Text
          style={tw.style(`text-lg text-white text-center mt-5`, {
            fontFamily: "Cabin_700Bold",
          })}
        >
          Friend Requests
        </Text>

        {refetching ? (
          <View style={tw`flex flex-row justify-center mt-2 gap-x-2`}>
            <Text
              style={tw.style(`text-sm text-gray-4 text-center `, {
                fontFamily: "Cabin_700Bold",
              })}
            >
              Finding new requests
            </Text>

            <ActivityIndicator />
          </View>
        ) : null}

        {!requests ? (
          <View style={tw`flex-1 justify-center mb-10`}>
            <ActivityIndicator />
          </View>
        ) : requests?.length > 0 ? (
          <View style={tw`flex-1 mt-2`}>
            <FlashList
              ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
              contentContainerStyle={tw`pt-6`}
              data={requests}
              estimatedItemSize={50}
              renderItem={({ item }) => <RequestCard data={item} />}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : (
          <View style={tw`flex-1 justify-center mb-10`}>
            <Text
              style={tw.style(`text-gray-2 text-base text-center`, {
                fontFamily: "Cabin_600SemiBold",
              })}
            >
              no friend requests (yet) 😕
            </Text>
          </View>
        )}

        {requests?.length === 0 ? (
          <Button
            onPress={() => {
              router.back();
              router.push("/friends");
            }}
            variant="dark"
          >
            Invite friends
          </Button>
        ) : null}
      </SafeView>
    </BlurView>
  );
}
