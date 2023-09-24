import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useDebounce } from "@uidotdev/usehooks";
import { SplashScreen, router } from "expo-router";

import tw from "@utils/tailwind";
import Input from "@components/Input";
import Button from "@components/Button";
import SafeView from "@components/SafeView";
import CheckIcon from "@assets/svgs/CheckIcon";
import CloseIcon from "@assets/svgs/CloseIcon";
import useAppContext from "@hooks/useAppContext";
import useCheckHandle from "@hooks/queries/useCheckHandle";

const minimumHandleLength = 1;

export default function Handle() {
  const { alert } = useAppContext();
  const [handle, setHandle] = useState("");
  const [error, setError] = useState(false);
  const debounced = useDebounce(handle, 500);

  const { checking, exists, ready } = useCheckHandle(
    debounced,
    minimumHandleLength,
  );

  function submit() {
    if (handle !== "" && handle.length < minimumHandleLength) {
      alert.current.show({
        title: "oops 😕",
        message: "handle needs to be minimum 4 characters",
      });
    }

    if (handle === "" || !ready || exists) {
      return setError(true);
    }

    router.push({
      pathname: "/phone",
      params: {
        action: "reserve",
        handle,
      },
    });
  }

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (ready && exists) {
      setError(true);
    } else {
      setError(false);
    }
  }, [exists, ready]);

  return (
    <SafeView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex flex-1 px-4 pt-4`}
      >
        <View style={tw`flex flex-1 justify-center items-center`}>
          <Text
            style={tw.style(`flex text-text-1 text-7xl`, {
              fontFamily: "BarlowCondensed_700Bold",
            })}
          >
            free rn?
          </Text>

          <Text
            style={tw.style(`flex text-white text-lg font-medium mt-3`, {
              fontFamily: "NunitoSans_400Regular",
            })}
          >
            find out when your friends are free
          </Text>
        </View>

        <View style={tw`flex flex-col pb-4 gap-y-4`}>
          <Input
            autoFocus
            error={error}
            loading={checking}
            lowercase
            maxLength={25}
            onChangeText={(text) => {
              setError(false);
              setHandle(text);
            }}
            placeholder="Enter username"
            rightIcon={ready ? exists ? <CloseIcon /> : <CheckIcon /> : null}
            trim
            whitespace={false}
          />

          <Button disabled={checking} onPress={submit}>
            next
          </Button>

          <TouchableOpacity
            style={tw`flex flex-row justify-center gap-x-1 `}
            onPress={() =>
              router.push({
                pathname: "/phone",
                params: {
                  action: "login",
                },
              })
            }
          >
            <Text
              style={tw.style(`text-base text-text-gray font-normal`, {
                fontFamily: "NunitoSans_400Regular",
              })}
            >
              been here already?
            </Text>

            <Text
              style={tw.style(`text-base text-text-gray underline`, {
                fontFamily: "NunitoSans_700Bold",
              })}
            >
              login here
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeView>
  );
}
