import { useCallback, useMemo } from "react";
import { Text, View } from "react-native";

import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

import tw from "@utils/tailwind";
import useUser from "@hooks/useUser";
import Image from "@components/Image";
import useAppContext from "@hooks/useAppContext";
import OutlineButton from "@components/OutlineButton";
import useAddFriend from "@hooks/mutations/useAddFriend";
import useInviteUser from "@hooks/mutations/useInviteUser";

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
  const { addFriend } = useAddFriend();

  const status = useMemo(() => {
    if (userData?.friends?.includes(data?.id || data?.objectID)) {
      return "friends";
    } else if (userData?.sentRequests?.includes(data?.id || data?.objectID)) {
      return "sent";
    } else {
      return false;
    }
  }, [data, userData]);

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
    <View style={tw`flex flex-row items-center`}>
      {data?.dp ? (
        <View style={tw`h-[50px] w-[50px]`}>
          <Image src={data?.dp} style="rounded-full" />
        </View>
      ) : (
        <View
          style={tw`bg-accent items-center justify-center h-[50px] w-[50px] rounded-full`}
        >
          <Text
            style={tw.style(`text-xl`, {
              fontFamily: "Cabin_700Bold",
            })}
          >
            {getInitials(data?.name)}
          </Text>
        </View>
      )}

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
          {type === "request"
            ? `@${data?.handle}`
            : data?.phone?.number?.includes("+")
            ? data?.phone?.number
            : `${data?.phone?.country_code} ${data?.phone?.number}`}
        </Text>
      </View>

      {type === "user" ? (
        status === "friends" ? (
          <AntDesign name="checkcircle" size={24} color="#D2FE55" />
        ) : status === "sent" ? (
          <Text
            style={tw.style(`text-accent`, {
              fontFamily: "Cabin_600SemiBold",
            })}
          >
            request sent
          </Text>
        ) : (
          <OutlineButton
            onPress={() =>
              addFriend({
                adderUid: userData?.id,
                addeeUid: data?.id || data?.objectID,
              })
            }
            style="h-[35px] w-[90px]"
            textStyle="text-xs"
          >
            add friend
          </OutlineButton>
        )
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
