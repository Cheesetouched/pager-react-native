import { memo, useCallback } from "react";
import { ActivityIndicator, Linking, Text, View } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

import tw from "@utils/tailwind";
import useUser from "@hooks/useUser";
import Input from "@components/Input";
import Button from "@components/Button";
import SafeView from "@components/SafeView";
import useContacts from "@hooks/useContacts";
import useAppContext from "@hooks/useAppContext";
import ContactCard from "@components/ContactCard";
import RequestCard from "@components/RequestCard";

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
              containerStyle="h-[45px] mb-3"
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
              contentContainerStyle={tw`pt-4 pb-16`}
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

const ContactListHeader = memo(({ friendsOnApp, invites }) => {
  const { userData } = useUser();

  return (
    <View style={tw`flex`}>
      {invites?.checking ? (
        <View style={tw`flex mb-7 gap-y-3`}>
          <ActivityIndicator />

          <Text
            style={tw.style(`text-white text-base text-center`, {
              fontFamily: "Cabin_600SemiBold",
            })}
          >
            finding your friends
          </Text>
        </View>
      ) : invites?.inviters?.length > 0 ? (
        <View style={tw`pb-[15px]`}>
          <Text
            style={tw.style(`text-white text-base mb-[15px]`, {
              fontFamily: "Cabin_700Bold",
            })}
          >
            invited you
          </Text>

          <View style={tw`min-h-[2px]`}>
            <FlashList
              ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
              data={invites?.inviters}
              estimatedItemSize={68}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => <ContactCard data={item} type="user" />}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      ) : null}

      {friendsOnApp?.length > 0 ? (
        <View style={tw`pb-5`}>
          <Text
            style={tw.style(`text-white text-base mb-5`, {
              fontFamily: "Cabin_700Bold",
            })}
          >
            on the app
          </Text>

          <View style={tw`min-h-[2px]`}>
            <FlashList
              ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
              data={friendsOnApp}
              estimatedItemSize={68}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                if (userData?.pendingRequests?.includes(item?.objectID)) {
                  return <RequestCard data={item} />;
                } else {
                  return <ContactCard data={item} type="user" />;
                }
              }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      ) : null}

      <Text
        style={tw.style(`text-white text-base mb-5`, {
          fontFamily: "Cabin_700Bold",
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
        style={tw.style(`text-gray-2 text-xl text-center`, {
          fontFamily: "Cabin_600SemiBold",
        })}
      >
        no contacts found 😕
      </Text>
    </View>
  );
}

function NoPermissionView({ canAskAgain, onAsk }) {
  return (
    <View style={tw`flex flex-1 px-4 pb-12`}>
      <Text
        style={tw.style(`flex text-text-1 text-2xl font-medium self-center`, {
          fontFamily: "Cabin_600SemiBold",
        })}
      >
        let's get your buddies on 🥳
      </Text>

      <View style={tw`flex flex-1 justify-center`}>
        <Text
          style={tw.style(`flex text-white text-center text-2xl font-medium`, {
            fontFamily: "Cabin_600SemiBold",
          })}
        >
          we need contact access
        </Text>

        <Text
          style={tw.style(
            `flex text-white text-center text-lg font-medium mt-5`,
            {
              fontFamily: "Cabin_400Regular",
            },
          )}
        >
          so that you can pick the friends that you'd like to hear from when
          they are free or vice-versa.
        </Text>

        <Text
          style={tw.style(`text-center text-lg underline text-red-400 mt-2`, {
            fontFamily: "Cabin_600SemiBold",
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
