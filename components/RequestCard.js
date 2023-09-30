import { Text, View } from "react-native";

import { Entypo } from "@expo/vector-icons";

import tw from "@utils/tailwind";
import Image from "@components/Image";
import Button from "@components/Button";
import OutlineButton from "@components/OutlineButton";
import useAcceptRequest from "@hooks/mutations/useAcceptRequest";
import useRejectRequest from "@hooks/mutations/useRejectRequest";

export default function RequestCard({ data }) {
  const { acceptRequest } = useAcceptRequest();
  const { rejectRequest } = useRejectRequest();

  return (
    <View style={tw`flex flex-row items-center`}>
      <View style={tw`h-[50px] w-[50px]`}>
        <Image src={data?.dp} style="rounded-full" />
      </View>

      <View style={tw`flex flex-1 ml-3`}>
        <Text
          style={tw.style(`text-base text-white`, {
            fontFamily: "Cabin_600SemiBold",
          })}
        >
          {data?.name}
        </Text>

        <Text
          style={tw.style(`text-sm text-gray-2`, {
            fontFamily: "Cabin_400Regular",
          })}
        >
          @{data?.handle}
        </Text>
      </View>

      <View style={tw`flex flex-row gap-x-5`}>
        <OutlineButton
          icon={
            <Entypo
              name="cross"
              size={20}
              color="white"
              style={tw`self-center`}
            />
          }
          onPress={() => rejectRequest(data?.id || data?.objectID)}
          style="h-[35px] w-[35px] rounded-full"
        />

        <Button
          icon={
            <Entypo
              name="check"
              size={20}
              color="white"
              style={tw`self-center`}
            />
          }
          onPress={() => acceptRequest(data?.id || data?.objectID)}
          style="h-[35px] w-[35px]"
        />
      </View>
    </View>
  );
}
