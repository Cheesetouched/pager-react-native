import { Share, Text, TouchableOpacity, View } from "react-native";

import tw from "@utils/tailwind";
import useUser from "@hooks/useUser";
import Image from "@components/Image";
import constants from "@utils/constants";
import ShareIcon from "@assets/svgs/ShareIcon";

const message = `I found an app that tells you who is free to chat and when.\n\nCheck it ${constants.INVITE_LINK}`;

export default function InviteCard({ style, titleStyle, subtitleStyle }) {
  const { userData } = useUser();

  return (
    <TouchableOpacity
      onPress={() => {
        Share.share({ message });
      }}
      style={tw.style(
        `bg-black/30 h-[65px] flex-row rounded-[14px] items-center px-4`,
        style,
      )}
    >
      <View style={tw`h-[35px] w-[35px]`}>
        <Image src={userData?.dp} style="rounded-full" />
      </View>

      <View style={tw`ml-3 flex-1 gap-y-1 justify-center `}>
        <Text
          style={tw.style(`text-white text-base leading-none`, titleStyle, {
            fontFamily: "Cabin_600SemiBold",
          })}
        >
          Invite friends on Pager
        </Text>

        <Text
          style={tw.style(`text-gray-4 text-sm leading-none`, subtitleStyle, {
            fontFamily: "Cabin_400Regular",
          })}
        >
          {`${constants.PAGER_DOMAIN}/${userData?.handle}`}
        </Text>
      </View>

      <ShareIcon />
    </TouchableOpacity>
  );
}
