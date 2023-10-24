import { Text, View } from "react-native";

import { router } from "expo-router";
import { formatDistance } from "date-fns";

import tw from "@utils/tailwind";
import Button from "@components/Button";
import { getInitials } from "@utils/helpers";
import OutlineButton from "@components/OutlineButton";

export default function ExternalPage({ data }) {
  return (
    <View style={tw`flex-row`}>
      <View
        style={tw`border-[1.5px] border-gray-4 items-center justify-center h-[50px] w-[50px] rounded-full`}
      >
        <Text
          style={tw.style(`text-xl text-white`, {
            fontFamily: "Cabin_700Bold",
          })}
        >
          {getInitials(data?.name)}
        </Text>
      </View>

      <View style={tw`flex-1 ml-3 gap-y-[1px] justify-center`}>
        <Text
          style={tw.style(`text-white text-base`, {
            fontFamily: "Cabin_400Regular",
          })}
        >
          {data?.name}
        </Text>

        {data?.message ? (
          <Text
            numberOfLines={1}
            style={tw.style(`text-gray-4 text-xs pr-5`, {
              fontFamily: "Cabin_400Regular",
            })}
          >
            {`"${data?.message}"`}
          </Text>
        ) : null}

        <Text
          style={tw.style(`text-gray-4 text-xs`, {
            fontFamily: "Cabin_400Regular",
          })}
        >
          {formatDistance(data?.sentAt, new Date(), { addSuffix: true })}
        </Text>
      </View>

      {!data?.response ? (
        <Button
          onPress={() =>
            router.push({
              pathname: "/external_page",
              params: { data: JSON.stringify(data) },
            })
          }
          style="h-[30px] w-[75px] self-center"
          textStyle="text-xs"
        >
          Reply
        </Button>
      ) : (
        <OutlineButton
          onPress={() =>
            router.push({
              pathname: "/external_page",
              params: { data: JSON.stringify(data) },
            })
          }
          style="h-[30px] w-[75px] self-center"
          textStyle="text-xs"
          variant="dark"
        >
          {data?.response?.free ? "Replied" : "Ignored"}
        </OutlineButton>
      )}
    </View>
  );
}
