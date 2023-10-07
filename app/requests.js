import { ActivityIndicator, Text, View } from "react-native";

import { BlurView } from "expo-blur";
import { FlashList } from "@shopify/flash-list";

import tw from "@utils/tailwind";
import RequestCard from "@components/RequestCard";
import useGetRequests from "@hooks/queries/useGetRequests";

export default function Requests() {
  const { getting, requests } = useGetRequests();

  return (
    <BlurView intensity={100} style={tw`flex flex-1`} tint="dark">
      <Text
        style={tw.style(`text-lg text-white text-center mt-5`, {
          fontFamily: "Cabin_700Bold",
        })}
      >
        Friend Requests
      </Text>

      {getting || !requests ? (
        <View style={tw`flex-1 justify-center mb-10`}>
          <ActivityIndicator />
        </View>
      ) : requests?.length > 0 ? (
        <View style={tw`flex-1 mt-2`}>
          <FlashList
            ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
            contentContainerStyle={tw`pt-6 px-6`}
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
            no requests found 😕
          </Text>
        </View>
      )}
    </BlurView>
  );
}
