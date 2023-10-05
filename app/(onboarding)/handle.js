import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ImageBackground } from "expo-image";
import { useDebounce } from "@uidotdev/usehooks";
import { SplashScreen, router } from "expo-router";

import tw from "@utils/tailwind";
import Logo from "@assets/logo.png";
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
        style={tw`flex flex-1 px-8 pt-4`}
      >
        <View style={tw`flex flex-1 justify-center items-center`}>
          <ImageBackground source={Logo} style={tw`h-[100px] w-[100px]`} />

          <Text
            style={tw.style(`flex text-text-1 text-5xl leading-tight mt-2`, {
              fontFamily: "Lalezar_400Regular",
            })}
          >
            pager
          </Text>
        </View>

        <View style={tw`flex flex-col gap-y-6`}>
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
            placeholder="Enter a handle"
            rightIcon={ready ? exists ? <CloseIcon /> : <CheckIcon /> : null}
            trim
            whitespace={false}
          />

          <Button
            disabled={checking || handle !== debounced}
            onPress={submit}
            variant="dark"
          >
            Reserve Handle
          </Button>
        </View>

        <TouchableOpacity
          style={tw`flex flex-row justify-center gap-x-1 my-4`}
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
            style={tw.style(`text-base text-text-2 font-normal`, {
              fontFamily: "Cabin_400Regular",
            })}
          >
            Already a user?
          </Text>

          <Text
            style={tw.style(`text-base text-gray underline`, {
              fontFamily: "Cabin_700Bold",
            })}
          >
            Login here
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeView>
  );
}
