import { useCallback } from "react";
import { Text, View } from "react-native";

import { router } from "expo-router";

import tw from "@utils/tailwind";
import useUser from "@hooks/useUser";
import Image from "@components/Image";
import useAppContext from "@hooks/useAppContext";
import useInviteUser from "@mutations/useInviteUser";
import OutlineButton from "@components/OutlineButton";

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name?.split(" ");

  if (parts.length === 0) {
    return "?";
  } else if (parts.length === 1) {
    return parts[0][0].toString().toUpperCase();
  } else {
    return (parts[0][0] + parts[1][0]).toString().toUpperCase();
  }
};

export default function ContactCard({ data, type = "contact" }) {
  const { userData } = useUser();
  const { alert } = useAppContext();

  const onSuccess = useCallback(
    (_, { number }) => {
      router.push({
        pathname: "/invite_options",
        params: {
          name: data?.name?.split(" ")[0].toLowerCase(),
          number,
        },
      });
    },
    [data?.name],
  );

  const { inviting, inviteUser } = useInviteUser({ onSuccess });

  return (
    <View
      style={tw`flex flex-row items-center`}
      onPress={() => console.log(data)}
    >
      {data?.dp ? (
        <View style={tw`h-[50px] w-[50px]`}>
          <Image src={data?.dp} style="rounded-full" />
        </View>
      ) : (
        <View
          style={tw`bg-neon items-center justify-center h-[50px] w-[50px] rounded-full`}
        >
          <Text
            style={tw.style(`text-xl`, {
              fontFamily: "NunitoSans_800ExtraBold",
            })}
          >
            {getInitials(data?.name)}
          </Text>
        </View>
      )}

      <View style={tw`flex flex-1 ml-3`}>
        <Text
          style={tw.style(`text-base text-white`, {
            fontFamily: "NunitoSans_700Bold",
          })}
        >
          {data?.name}
        </Text>

        <Text
          style={tw.style(`text-sm text-text-gray`, {
            fontFamily: "NunitoSans_400Regular",
          })}
        >
          {data?.phone?.number?.includes("+")
            ? data?.phone?.number
            : `${data?.phone?.country_code} ${data?.phone?.number}`}
        </Text>
      </View>

      {type === "user" ? (
        <OutlineButton style="h-[35px] w-[90px]" textStyle="text-xs">
          see profile
        </OutlineButton>
      ) : (
        <OutlineButton
          loading={inviting}
          onPress={() => {
            if (userData?.phone?.full === data?.phone?.full) {
              alert.current.show({
                title: "???",
                message: "you cannot invite yourself 😭",
              });
            } else {
              inviteUser({
                number: data?.phone?.full,
                invited_by: userData?.id,
              });
            }
          }}
          style="h-[35px] w-[75px]"
          textStyle="text-xs"
        >
          invite
        </OutlineButton>
      )}
    </View>
  );
}
