import { useCallback, useMemo, useState } from "react";
import { Text, View } from "react-native";

import { AntDesign } from "@expo/vector-icons";

import tw from "@utils/tailwind";
import useUser from "@hooks/useUser";
import Image from "@components/Image";
import { getInitials } from "@utils/helpers";
import useMixpanel from "@hooks/useMixpanel";
import useAppContext from "@hooks/useAppContext";
import OutlineButton from "@components/OutlineButton";
import useAddFriend from "@hooks/mutations/useAddFriend";
import useInviteUser from "@hooks/mutations/useInviteUser";

export default function ContactCard({ data, onInvite, type = "contact" }) {
  const { userData } = useUser();
  const mixpanel = useMixpanel();
  const { alert } = useAppContext();
  const { addFriend } = useAddFriend();
  const [invited, setInvited] = useState(false);

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
      setInvited(true);
      onInvite(number);
    },
    [onInvite],
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
          style={tw`bg-gray-3 items-center justify-center h-[50px] w-[50px] rounded-full`}
        >
          <Text
            style={tw.style(`text-xl text-white`, {
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
          {data?.handle
            ? `@${data?.handle}`
            : data?.phone?.number?.includes("+")
            ? data?.phone?.number
            : `${data?.phone?.country_code} ${data?.phone?.number}`}
        </Text>
      </View>

      <View style={tw`items-center gap-y-1`}>
        {type === "user" ? (
          status === "friends" ? (
            <AntDesign name="checkcircle" size={24} color="#52A98F" />
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
              onPress={() => {
                mixpanel.track("added_friend");

                addFriend({
                  adderUid: userData?.id,
                  addeeUid: data?.id || data?.objectID,
                });
              }}
              style="h-[35px] w-[90px] rounded-full"
              textStyle="text-xs"
            >
              Add friend
            </OutlineButton>
          )
        ) : (
          <OutlineButton
            loading={inviting}
            onPress={() => {
              if (!invited) {
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
              }
            }}
            style="h-[35px] w-[75px] rounded-full"
            textStyle={`text-xs ${invited ? "text-gray-4" : "text-white"}`}
            variant={invited ? "dark" : "main"}
          >
            {invited ? "Invited" : "Invite"}
          </OutlineButton>
        )}

        {data?.invited && status !== "sent" ? (
          <Text
            style={tw.style(`text-xs text-gray-2`, {
              fontFamily: "Cabin_400Regular",
            })}
          >
            invited you
          </Text>
        ) : (
          false
        )}
      </View>
    </View>
  );
}
