import { useCallback, useState } from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";

import { BlurView } from "expo-blur";
import { router, useNavigation } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import tw from "@utils/tailwind";
import User from "@components/User";
import useUser from "@hooks/useUser";
import Prompt from "@components/Prompt";
import constants from "@utils/constants";
import SafeView from "@components/SafeView";
import useFirebase from "@hooks/useFirebase";
import useLocalStorage from "@hooks/useLocalStorage";
import OutlineButton from "@components/OutlineButton";
import useDeleteUser from "@hooks/mutations/useDeleteUser";

export default function Profile() {
  const { userData } = useUser();
  const local = useLocalStorage();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [logoutPrompt, setLogoutPrompt] = useState(null);
  const [deletePrompt, setDeletePrompt] = useState(null);

  const deleteAndClean = useCallback(() => {
    router.back();
    local.clear();
    queryClient.clear();
    navigation.reset({
      index: 0,
      routes: [{ name: "(onboarding)/handle" }],
    });
  }, [local, navigation, queryClient]);

  const { deleteUser, deleting } = useDeleteUser({
    onSuccess: () => deleteAndClean(),
  });

  const { logout, loggingOut } = useFirebase({
    onLogout: () => deleteAndClean(),
  });

  return (
    <>
      <BlurView intensity={75} style={tw`flex flex-1`} tint="dark">
        <SafeView style="bg-transparent px-6 pb-4">
          <Text
            style={tw.style(`text-lg text-white text-center mt-5`, {
              fontFamily: "Cabin_700Bold",
            })}
          >
            Your Profile
          </Text>

          <View style={tw`flex-1 justify-center pb-10`}>
            <User
              data={userData}
              dimension={120}
              free
              indicator={false}
              nameStyle="text-lg"
              showMetadata={false}
            />

            <View style={tw`items-center gap-y-5 mt-10`}>
              <OutlineButton
                loading={loggingOut}
                onPress={() => {
                  setLogoutPrompt({
                    title: "Logout",
                    message: "Are you sure you want to logout?",
                  });
                }}
                style="h-[40px] w-[200px]"
                textStyle="text-sm"
                variant="dark"
              >
                LOG OUT
              </OutlineButton>

              <OutlineButton
                onPress={() => {
                  setDeletePrompt({
                    title: "Delete Account",
                    message:
                      "This will permanently delete your account and all associated data from our servers. We cannot recover your account once it's gone. Are you sure you want to continue?",
                  });
                }}
                style="h-[40px] w-[200px]"
                textStyle="text-sm"
                variant="dark"
              >
                DELETE ACCOUNT
              </OutlineButton>
            </View>

            <TouchableOpacity
              onPress={() => Linking.openURL(constants.PRIVACY_POLICY)}
              style={tw`mt-7 p-3 items-center`}
            >
              <Text
                style={tw.style(`text-white`, {
                  fontFamily: "Cabin_600SemiBold",
                })}
              >
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
        </SafeView>
      </BlurView>

      <Prompt
        body={logoutPrompt}
        loading={loggingOut}
        onClose={() => setLogoutPrompt(null)}
        onNo={() => setLogoutPrompt(null)}
        onYes={logout}
        visible={logoutPrompt != null}
      />

      <Prompt
        body={deletePrompt}
        loading={deleting}
        onClose={() => setDeletePrompt(null)}
        onNo={() => setDeletePrompt(null)}
        onYes={deleteUser}
        visible={deletePrompt != null}
      />
    </>
  );
}
