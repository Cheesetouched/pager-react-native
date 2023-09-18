import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";

import { router } from "expo-router";
import { useDebounce } from "@uidotdev/usehooks";

import tw from "@utils/tailwind";
import Input from "@components/Input";
import Button from "@components/Button";
import CheckIcon from "@assets/svgs/CheckIcon";
import CloseIcon from "@assets/svgs/CloseIcon";
import useAppContext from "@hooks/useAppContext";
import useCheckHandle from "@queries/useCheckHandle";

const minimumHandleLength = 4;

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
        title: "oops!",
        message: "handle needs to be minimum 4 characters",
      });
    }

    if (handle === "" || !ready || exists) {
      return setError(true);
    }

    router.push({
      pathname: "/onboarding/phone",
      params: {
        action: "reserve",
      },
    });
  }

  useEffect(() => {
    if (ready && exists) {
      setError(true);
    } else {
      setError(false);
    }
  }, [exists, ready]);

  return (
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

        <Text style={tw.style(`flex text-white text-lg font-medium mt-3`)}>
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
          Next
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
