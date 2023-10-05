import { useCallback, useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";

import { SplashScreen, router, useLocalSearchParams } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import tw from "@utils/tailwind";
import Button from "@components/Button";
import SafeView from "@components/SafeView";
import CurvyArrow from "@assets/svgs/CurvyArrow";
import ImageSelect from "@components/ImageSelect";
import useLocalStorage from "@hooks/useLocalStorage";
import useUploadDp from "@hooks/mutations/useUploadDp";

export default function Dp() {
  const scrollRef = useRef();
  const params = useLocalSearchParams();
  const { saveJson } = useLocalStorage();
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState();

  const onImageSelected = useCallback((data) => {
    setError(false);
    setSelected(data);
  }, []);

  function submit() {
    if (!selected) {
      return setError(true);
    }

    setError(false);
    uploadDp(selected?.uri);
  }

  const { uploading, uploadDp } = useUploadDp({
    onSuccess: (dp) => {
      const routeData = {
        pathname: `/name`,
        params: {
          ...params,
          dp,
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
        contentContainerStyle={tw`flex flex-1 px-8 pt-4`}
        innerRef={(ref) => {
          scrollRef.current = ref;
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={tw`flex flex-1 items-center`}>
          <Text
            style={tw.style(
              `flex text-text-1 text-4xl font-medium leading-relaxed mt-2`,
              {
                fontFamily: "Lalezar_400Regular",
              },
            )}
          >
            {selected ? "Nice one!" : "Add a photo"}
          </Text>

          <Text
            style={tw.style(
              `flex text-gray-4 text-base font-medium leading-none`,
              {
                fontFamily: "Cabin_400Regular",
              },
            )}
          >
            This is how your friends will see you here
          </Text>

          <CurvyArrow style={tw`mt-3 mb-5`} />

          <ImageSelect
            allowsEditing
            disabled={uploading}
            error={error}
            onSelect={onImageSelected}
            style="h-[250px] w-[250px] rounded-full border-4"
          />
        </View>

        <Button loading={uploading} onPress={submit} style="mb-4">
          Next
        </Button>
      </KeyboardAwareScrollView>
    </SafeView>
  );
}
