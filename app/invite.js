import { memo, useCallback } from "react";
import { ActivityIndicator, Linking, Text, View } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

import tw from "@utils/tailwind";
import Input from "@components/Input";
import Button from "@components/Button";
import SafeView from "@components/SafeView";
import useContacts from "@hooks/useContacts";
import useAppContext from "@hooks/useAppContext";
import ContactCard from "@components/ContactCard";

export default function Invite() {
  const { alert } = useAppContext();

  const onDenied = useCallback(() => {
    alert.current.show({
      title: "oops 😕",
      message: "without contact access, you cannot add or invite friends",
    });
  }, [alert]);

  const {
    contacts,
    friendsOnApp,
    invites,
    loadingInvites,
    permission,
    requestContacts,
    searchContacts,
  } = useContacts({ onDenied });

  return (
    <SafeView>
      <View style={tw`flex flex-1 px-4 pt-4`}>
        {permission?.granted ? (
          <>
            <Input
              LeftComponent={
                <AntDesign
                  name="search1"
                  size={18}
                  color="#00000080"
                  style={tw`ml-3`}
                />
              }
              containerStyle="h-[45px] mb-7"
              maxLength={25}
              onChangeText={searchContacts}
              placeholder="search contacts"
              style="text-left"
              trim
            />

            <FlashList
              ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
              ListHeaderComponent={
                <ContactListHeader
                  friendsOnApp={friendsOnApp}
                  invites={invites}
                  loadingInvites={loadingInvites}
                />
              }
              ListEmptyComponent={<NoContacts />}
              data={contacts}
              estimatedItemSize={68}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => <ContactCard data={item} />}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          <NoPermissionView
            canAskAgain={permission?.canAskAgain}
            onAsk={requestContacts}
          />
        )}
      </View>
    </SafeView>
  );
}

const ContactListHeader = memo(({ friendsOnApp, invites, loadingInvites }) => {
  return (
    <View style={tw`flex`}>
      {loadingInvites ? (
        <View style={tw`flex mb-7 gap-y-3`}>
          <ActivityIndicator />

          <Text
            style={tw.style(`text-white text-base text-center`, {
              fontFamily: "NunitoSans_700Bold",
            })}
          >
            finding your friends
          </Text>
        </View>
      ) : invites?.length > 0 ? (
        <View style={tw`pb-[15px]`}>
          <Text
            style={tw.style(`text-white text-base mb-[15px]`, {
              fontFamily: "NunitoSans_800ExtraBold",
            })}
          >
            invited you
          </Text>

          <View style={tw`min-h-[2px]`}>
            <FlashList
              ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
              data={invites}
              estimatedItemSize={68}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => <ContactCard data={item} type="user" />}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      ) : null}

      {friendsOnApp?.results?.length > 0 ? (
        <View style={tw`pb-[15px]`}>
          <Text
            style={tw.style(`text-white text-base mb-[15px]`, {
              fontFamily: "NunitoSans_800ExtraBold",
            })}
          >
            on the app
          </Text>

          <View style={tw`min-h-[2px]`}>
            <FlashList
              ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
              data={friendsOnApp?.results}
              estimatedItemSize={68}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => <ContactCard data={item} type="user" />}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      ) : null}

      <Text
        style={tw.style(`text-white text-base mb-[15px]`, {
          fontFamily: "NunitoSans_800ExtraBold",
        })}
      >
        your contacts
      </Text>
    </View>
  );
});

function NoContacts() {
  return (
    <View style={tw`flex flex-1`}>
      <Text
        style={tw.style(`text-text-gray text-xl text-center`, {
          fontFamily: "NunitoSans_700Bold",
        })}
      >
        no contacts found 😕
      </Text>
    </View>
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
