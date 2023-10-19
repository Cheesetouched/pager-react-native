import { memo, useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { router, useLocalSearchParams, useRootNavigation } from "expo-router";

import tw from "@utils/tailwind";
import useUser from "@hooks/useUser";
import Input from "@components/Input";
import Button from "@components/Button";
import SafeView from "@components/SafeView";
import BackIcon from "@assets/svgs/BackIcon";
import useContacts from "@hooks/useContacts";
import useMixpanel from "@hooks/useMixpanel";
import InviteCard from "@components/InviteCard";
import ExampleUser1 from "@assets/example_1.png";
import ExampleUser2 from "@assets/example_2.png";
import ContactCard from "@components/ContactCard";
import RequestCard from "@components/RequestCard";
import ExampleUser from "@components/ExampleUser";
import InviteSheet from "@components/InviteSheet";
import PermissionBox from "@components/PermissionBox";

export default function Friends() {
  const { userData } = useUser();
  const mixpanel = useMixpanel();
  const inviteSheetRef = useRef();
  const params = useLocalSearchParams();
  const navigation = useRootNavigation();

  const onInvite = useCallback(
    (number) => {
      if (params?.referrer === "onboarding") {
        mixpanel.track("invited_from_onboarding");
      } else {
        mixpanel.track("invited");
      }

      inviteSheetRef?.current?.invite(number);
    },
    [mixpanel, params?.referrer],
  );

  const onGranted = useCallback(() => {
    mixpanel.track("allowed_contacts");
  }, [mixpanel]);

  const {
    contacts,
    friendsOnApp,
    invites,
    permission,
    ready,
    requestContacts,
    searchContacts,
  } = useContacts({ userPhone: userData?.phone?.full, onGranted });

  if (!ready) {
    return (
      <SafeView>
        <View style={tw`flex flex-1 justify-center`}>
          <ActivityIndicator size="large" />
        </View>
      </SafeView>
    );
  }

  return (
    <SafeView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex flex-1 px-4 pt-2`}
      >
        {permission?.granted ? (
          <>
            {params?.referrer !== "onboarding" ? (
              <TouchableOpacity
                onPress={router.back}
                style={tw`flex flex-row items-center gap-x-2 mb-4`}
              >
                <BackIcon />

                <Text
                  style={tw.style(`text-base text-white font-semibold`, {
                    fontFamily: "Cabin_600SemiBold",
                  })}
                >
                  back
                </Text>
              </TouchableOpacity>
            ) : null}

            <Input
              LeftComponent={
                <AntDesign
                  name="search1"
                  size={18}
                  color="#00000080"
                  style={tw`ml-3`}
                />
              }
              containerStyle="h-[45px] mb-2"
              maxLength={25}
              onChangeText={searchContacts}
              placeholder="Search for people"
              style="text-left"
              trim
            />

            <FlashList
              ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
              ListHeaderComponent={
                <ContactListHeader
                  friendsOnApp={friendsOnApp}
                  invites={invites}
                  onInvite={onInvite}
                />
              }
              ListEmptyComponent={<NoContacts />}
              contentContainerStyle={tw`pt-2 pb-5`}
              data={contacts}
              estimatedItemSize={68}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <ContactCard data={item} onInvite={onInvite} />
              )}
              showsVerticalScrollIndicator={false}
            />

            {params?.referrer === "onboarding" ? (
              <Button
                onPress={() => {
                  mixpanel.track("finished_onboarding");

                  navigation.reset({
                    index: 0,
                    routes: [{ name: "home" }],
                  });
                }}
                variant="dark"
                style="my-2"
              >
                Take me to the app
              </Button>
            ) : null}
          </>
        ) : (
          <NoPermissionView
            canAskAgain={permission?.canAskAgain}
            navigation={navigation}
            onAsk={requestContacts}
            params={params}
          />
        )}
      </KeyboardAvoidingView>

      <InviteSheet ref={inviteSheetRef} />
    </SafeView>
  );
}

const ContactListHeader = memo(({ friendsOnApp, invites, onInvite }) => {
  const { userData } = useUser();

  return (
    <View style={tw`flex`}>
      <InviteCard style="bg-white/20 mb-4" subtitleStyle="text-gray-2" />

      {invites?.checking || friendsOnApp?.checking ? (
        <View style={tw`flex mb-7 gap-y-3`}>
          <ActivityIndicator />

          <Text
            style={tw.style(`text-gray-2 text-base text-center`, {
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
            Invited you
          </Text>

          <View style={tw`min-h-[2px]`}>
            <FlashList
              ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
              data={invites?.inviters}
              estimatedItemSize={68}
              extraData={userData}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                if (userData?.pendingRequests?.includes(item?.id)) {
                  return <RequestCard data={item} />;
                } else {
                  return (
                    <ContactCard data={item} onInvite={onInvite} type="user" />
                  );
                }
              }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      ) : null}

      {friendsOnApp?.results?.length > 0 ? (
        <View style={tw`pb-5`}>
          <Text
            style={tw.style(`text-white text-base mb-5`, {
              fontFamily: "Cabin_700Bold",
            })}
          >
            On Pager
          </Text>

          <View style={tw`min-h-[2px]`}>
            <FlashList
              ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
              data={friendsOnApp?.results}
              estimatedItemSize={68}
              extraData={userData}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                if (userData?.pendingRequests?.includes(item?.objectID)) {
                  return <RequestCard data={item} />;
                } else {
                  return (
                    <ContactCard data={item} onInvite={onInvite} type="user" />
                  );
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
        In your contacts
      </Text>
    </View>
  );
});

function NoContacts() {
  return (
    <View style={tw`flex flex-1`}>
      <Text
        style={tw.style(`text-gray-2 text-base text-center`, {
          fontFamily: "Cabin_600SemiBold",
        })}
      >
        no contacts found 😕
      </Text>
    </View>
  );
}

function NoPermissionView({ canAskAgain, navigation, onAsk, params }) {
  const [deniedView, setDeniedView] = useState(false);

  return (
    <View style={tw`flex flex-1 px-3`}>
      {canAskAgain && !deniedView ? (
        <>
          <Text
            style={tw.style(
              `flex text-text-1 text-3xl font-medium self-center mt-2 leading-snug`,
              {
                fontFamily: "Lalezar_400Regular",
              },
            )}
          >
            Bring friends on
          </Text>

          <Text
            style={tw.style(
              `flex text-gray-4 text-center text-sm font-medium`,
              {
                fontFamily: "Cabin_400Regular",
              },
            )}
          >
            p.s. - pager is an app to use with friends. literally.
          </Text>
        </>
      ) : null}

      {!canAskAgain || deniedView ? (
        <View style={tw`flex flex-1 justify-center px-3`}>
          <Text
            style={tw.style(
              `flex text-text-1 text-3xl font-medium self-center`,
              {
                fontFamily: "Lalezar_400Regular",
              },
            )}
          >
            Oops!
          </Text>

          <Text
            style={tw.style(
              `flex text-gray-4 text-center text-sm font-medium mt-5`,
              {
                fontFamily: "Cabin_400Regular",
              },
            )}
          >
            You can go further without syncing contacts but it’ll be pretty
            dead.
          </Text>

          {!canAskAgain ? (
            <Text
              style={tw.style(
                `flex text-gray-4 text-center text-sm font-medium mt-5`,
                {
                  fontFamily: "Cabin_400Regular",
                },
              )}
            >
              You can sync contacts manually from settings.
            </Text>
          ) : null}

          <Button
            onPress={() => {
              if (canAskAgain) {
                onAsk();
              } else {
                Linking.openSettings();
              }
            }}
            style="mt-10 mx-20"
          >
            {canAskAgain ? "Allow" : "Open Settings"}
          </Button>

          <Button
            onPress={() => {
              if (params?.referrer === "onboarding") {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "home" }],
                });
              } else {
                router.push("/home");
              }
            }}
            style="mt-5 mx-20"
            variant="dark"
          >
            Skip
          </Button>

          <Text
            style={tw.style(
              `text-lg text-white text-center mt-16 leading-snug`,
              {
                fontFamily: "Cabin_700Bold",
              },
            )}
          >
            Free to Chat 👋🏻
          </Text>

          <View style={tw`relative mx-3`}>
            <ExampleUser src={ExampleUser1} style={tw`absolute mt-5`}>
              1hr 👋🏻
            </ExampleUser>

            <ExampleUser src={ExampleUser2} style={tw`absolute right-0 mt-14`}>
              1hr 👋🏻
            </ExampleUser>
          </View>
        </View>
      ) : (
        <View style={tw`flex flex-1 justify-center px-3 pb-10`}>
          <View style={tw`mx-5`}>
            <PermissionBox
              explanation="Bring on friends you want to use Pager with."
              onAllow={() => {
                if (canAskAgain) {
                  onAsk();
                } else {
                  Linking.openSettings();
                }
              }}
              onDeny={() => setDeniedView(true)}
              title="Sync Contacts"
            />
          </View>

          <Text style={tw`text-5xl self-end mr-14 mt-5 leading-tight`}>👆</Text>

          <Text
            style={tw.style(`text-lg text-white text-center mt-16`, {
              fontFamily: "Cabin_700Bold",
            })}
          >
            Free to Chat 👋🏻
          </Text>

          <View style={tw`relative mx-3`}>
            <ExampleUser src={ExampleUser1} style={tw`absolute mt-5`}>
              1hr 👋🏻
            </ExampleUser>

            <ExampleUser src={ExampleUser2} style={tw`absolute right-0 mt-14`}>
              1hr 👋🏻
            </ExampleUser>
          </View>
        </View>
      )}
    </View>
  );
}
