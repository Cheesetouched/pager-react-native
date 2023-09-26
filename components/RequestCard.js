import { Text, View } from "react-native";

import { Entypo } from "@expo/vector-icons";

import tw from "@utils/tailwind";
import Image from "@components/Image";
import Button from "@components/Button";
import OutlineButton from "@components/OutlineButton";
import useAcceptRequest from "@hooks/mutations/useAcceptRequest";

export default function RequestCard({ data }) {
  const { addFriend } = useAcceptRequest();

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
          style={tw.style(`text-sm text-text-gray`, {
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
          style="h-[35px] w-[35px]"
        />

        <Button
          icon={
            <Entypo
              name="check"
              size={20}
              color="black"
              style={tw`self-center`}
            />
          }
          onPress={() => addFriend(data?.id)}
          style="h-[35px] w-[35px]"
        />
      </View>
    </View>
  );
}
