import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";

import { SplashScreen, router, useLocalSearchParams } from "expo-router";

import tw from "@utils/tailwind";
import Input from "@components/Input";
import Button from "@components/Button";
import SafeView from "@components/SafeView";
import useLocalStorage from "@hooks/useLocalStorage";

export default function Name() {
  const nameRef = useRef();
  const params = useLocalSearchParams();
  const { saveJson } = useLocalStorage();
  const [error, setError] = useState(false);

  function submit() {
    if (nameRef?.current?.value === "") {
      setError(true);
    } else {
      setError(false);

      const routeData = {
        pathname: `/notification`,
        params: {
          ...params,
          name: nameRef?.current?.value,
        },
      };

      saveJson("checkpoint", routeData).then(() => {
        router.push(routeData);
      });
    }
  }

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex flex-1 px-8 pt-4`}
      >
        <View style={tw`flex flex-1 justify-center items-center`}>
          <Text
            style={tw.style(`flex text-text-1 text-4xl leading-tight mt-2`, {
              fontFamily: "Lalezar_400Regular",
            })}
          >
            What's your name?
          </Text>
        </View>

        <View style={tw`flex flex-col pb-4 gap-y-6`}>
          <Input
            autoFocus
            error={error}
            maxLength={25}
            placeholder="Your name please?"
            ref={nameRef}
            trim
          />

          <Button onPress={submit}>Next</Button>
        </View>
      </KeyboardAvoidingView>
    </SafeView>
  );
}
