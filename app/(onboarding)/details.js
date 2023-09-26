import { useCallback, useEffect, useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { SplashScreen, router, useLocalSearchParams } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import tw from "@utils/tailwind";
import Button from "@components/Button";
import SafeView from "@components/SafeView";
import CurvyArrow from "@assets/svgs/CurvyArrow";
import ImageSelect from "@components/ImageSelect";
import useLocalStorage from "@hooks/useLocalStorage";
import useUploadDp from "@hooks/mutations/useUploadDp";

export default function Details() {
  const scrollRef = useRef();
  const [name, setName] = useState("");
  const params = useLocalSearchParams();
  const [error, setError] = useState({});
  const { saveJson } = useLocalStorage();
  const [selected, setSelected] = useState();

  const onImageSelected = useCallback((data) => {
    setSelected(data);
    setError((old) => ({ ...old, image: false }));
  }, []);

  function submit() {
    if (!selected) {
      return setError((old) => ({ ...old, image: true }));
    }

    if (name === "") {
      return setError((old) => ({ ...old, name: true }));
    }

    setError({
      image: false,
      name: false,
    });

    uploadDp(selected?.uri);
  }

  const { uploading, uploadDp } = useUploadDp({
    onSuccess: (dp) => {
      const routeData = {
        pathname: `/notification`,
        params: {
          ...params,
          dp,
          name,
        },
      };

      saveJson("checkpoint", routeData).then(() => {
        router.push(routeData);
      });
    },
  });

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeView>
      <KeyboardAwareScrollView
        contentContainerStyle={tw`flex flex-1 px-4 pt-4`}
        innerRef={(ref) => {
          scrollRef.current = ref;
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={tw`flex flex-1 items-center`}>
          <Text
            style={tw.style(`flex text-text-1 text-2xl font-medium`, {
              fontFamily: "Cabin_600SemiBold",
            })}
          >
            {selected ? "damn! looking cute 😳" : "select a photo of yourself"}
          </Text>

          {!selected ? (
            <Text
              style={tw.style(`flex text-white text-base font-medium mt-2`, {
                fontFamily: "Cabin_400Regular",
              })}
            >
              (your friends will see it)
            </Text>
          ) : null}

          <CurvyArrow style={tw`my-5`} />

          <ImageSelect
            allowsEditing
            disabled={uploading}
            error={error?.image}
            onSelect={onImageSelected}
            style="h-[150px] w-[150px]"
          />

          {selected ? (
            <View style={tw`flex flex-row mt-10`}>
              <TextInput
                maxLength={25}
                onChangeText={setName}
                placeholder="your name?"
                placeholderTextColor={error?.name ? "#F87171" : "#A3A3A3"}
                selectionColor="white"
                style={tw.style(
                  `flex flex-1 text-3xl leading-snug text-center text-white`,
                  { fontFamily: "Cabin_600SemiBold" },
                )}
                value={name}
              />
            </View>
          ) : null}
        </View>

        <Button loading={uploading} onPress={submit} style="mb-4">
          next
        </Button>
      </KeyboardAwareScrollView>
    </SafeView>
  );
}
