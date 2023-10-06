import { useCallback } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { BlurView } from "expo-blur";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import tw from "@utils/tailwind";
import User from "@components/User";
import Button from "@components/Button";
import usePageResponse from "@hooks/mutations/usePageResponse";

export default function Page() {
  const { from, pageId } = useLocalSearchParams();
  const parsed = JSON.parse(from);

  const onSuccess = useCallback(() => router?.back(), []);

  const { respond, responding } = usePageResponse({
    onSuccess,
  });

  return (
    <BlurView intensity={100} style={tw`flex flex-1`} tint="dark">
      <SafeAreaProvider>
        <SafeAreaView style={tw`flex flex-1 px-8  justify-center`}>
          <View style={tw`items-center`}>
            <User
              data={parsed}
              dimension="150"
              free
              titleContainerStyle="h-[30px]"
              titleStyle="text-base leading-relaxed px-1"
              nameStyle="text-white text-xl"
              showName={false}
            />
          </View>

          <Text
            style={tw.style(`text-white text-2xl mt-10 self-center`, {
              fontFamily: "Cabin_400Regular",
            })}
          >{`${parsed?.name?.split(" ")[0]} paged you`}</Text>

          <View style={tw`gap-y-5 mt-10`}>
            {responding ? (
              <ActivityIndicator />
            ) : (
              <>
                <Button
                  onPress={() =>
                    respond({
                      pageId,
                      response: {
                        response: {
                          free: true,
                        },
                      },
                    })
                  }
                >
                  I AM FREE
                </Button>

                <Button
                  onPress={() =>
                    respond({
                      pageId,
                      response: {
                        response: {
                          free: false,
                        },
                      },
                    })
                  }
                  variant="dark"
                >
                  IGNORE
                </Button>
              </>
            )}
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </BlurView>
  );
}
