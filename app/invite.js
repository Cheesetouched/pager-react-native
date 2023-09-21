import { useCallback } from "react";
import { Linking, Text, View } from "react-native";

import tw from "@utils/tailwind";
import Button from "@components/Button";
import SafeView from "@components/SafeView";
import useContacts from "@hooks/useContacts";
import useAppContext from "@hooks/useAppContext";

export default function Invite() {
  const { alert } = useAppContext();

  const deniedAlert = useCallback(() => {
    alert.current.show({
      title: "oops 😕",
      message: "without contact access, you cannot add or invite friends",
    });
  }, [alert]);

  const { permission, requestContacts } = useContacts({
    onDenied: deniedAlert,
  });

  return (
    <SafeView>
      {permission?.granted ? (
        <View></View>
      ) : (
        <NoPermissionView
          canAskAgain={permission?.canAskAgain}
          onAsk={requestContacts}
        />
      )}
    </SafeView>
  );
}

function NoPermissionView({ onAsk, canAskAgain }) {
  return (
    <View style={tw`flex flex-1 px-4 pt-4`}>
      <Text
        style={tw.style(`flex text-text-1 text-2xl font-medium self-center`, {
          fontFamily: "NunitoSans_700Bold",
        })}
      >
        let's get your buddies on 🥳
      </Text>

      <View style={tw`flex flex-1 justify-center px-5`}>
        <Text
          style={tw.style(`flex text-white text-center text-2xl font-medium`, {
            fontFamily: "NunitoSans_700Bold",
          })}
        >
          we need contact access
        </Text>

        <Text
          style={tw.style(
            `flex text-white text-center text-lg font-medium mt-5`,
            {
              fontFamily: "NunitoSans_400Regular",
            },
          )}
        >
          so that you can pick the friends that you'd like to hear from when
          they are free or vice-versa.
        </Text>

        <Text
          style={tw.style(`text-center text-lg underline text-red-400 mt-2`, {
            fontFamily: "NunitoSans_700Bold",
          })}
        >
          without that, this app is not useful.
        </Text>
      </View>

      <Button
        onPress={() => {
          if (canAskAgain) {
            onAsk();
          } else {
            Linking.openSettings();
          }
        }}
        style="mb-4"
      >
        {canAskAgain ? "allow" : "allow from settings"}
      </Button>
    </View>
  );
}
