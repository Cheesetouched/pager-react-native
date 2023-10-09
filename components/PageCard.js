import { Text, View } from "react-native";

import { router } from "expo-router";
import { formatDistance } from "date-fns";

import tw from "@utils/tailwind";
import User from "@components/User";
import Button from "@components/Button";
import OutlineButton from "@components/OutlineButton";

export default function PageCard({ data, type }) {
  return (
    <View style={tw`flex-row`}>
      <User
        data={type === "received" ? data?.from : data?.to}
        dimension="55"
        free
        showName={false}
        stroke={type === "received" && !data?.response}
        title="👋🏻"
        titleContainerStyle="h-[15px] bottom-[-5px] px-1"
        titleStyle="text-[8px] leading-relaxed"
      />

      <View style={tw`flex-1 ml-4 justify-center`}>
        <Text
          style={tw.style(`text-white text-base`, {
            fontFamily: "Cabin_400Regular",
          })}
        >
          {type === "received" ? data?.from?.name : data?.to?.name}
        </Text>

        <Text
          style={tw.style(`text-gray-4 text-xs`, {
            fontFamily: "Cabin_400Regular",
          })}
        >
          {formatDistance(data?.sentAt, new Date(), { addSuffix: true })}
        </Text>
      </View>

      {type === "received" ? (
        !data?.response ? (
          <Button
            onPress={() =>
              router.push({
                pathname: "/page",
                params: {
                  from: JSON.stringify(data?.from),
                  pageId: data?.id,
                },
              })
            }
            style="h-[30px] w-[75px] self-center"
            textStyle="text-xs"
          >
            Reply
          </Button>
        ) : (
          <OutlineButton
            style="h-[30px] w-[75px] self-center"
            textStyle="text-xs"
            variant="dark"
          >
            {data?.response?.free || data?.response?.freeFrom
              ? "Replied"
              : "Ignored"}
          </OutlineButton>
        )
      ) : null}

      {type === "sent" ? (
        <OutlineButton
          style="h-[30px] w-[75px] self-center"
          textStyle="text-xs"
          variant="dark"
        >
          Sent
        </OutlineButton>
      ) : null}
    </View>
  );
}
