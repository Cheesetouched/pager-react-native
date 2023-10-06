import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { BlurView } from "expo-blur";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import tw from "@utils/tailwind";
import User from "@components/User";
import useUser from "@hooks/useUser";
import Button from "@components/Button";
import usePageResponse from "@hooks/mutations/usePageResponse";

export default function Page() {
  const { userData } = useUser();
  const { respond } = usePageResponse();
  const [response, setResponse] = useState(null);
  const { from, pageId } = useLocalSearchParams();
  const parsed = JSON.parse(from);

  return (
    <BlurView intensity={100} style={tw`flex flex-1`} tint="dark">
      <SafeAreaProvider>
        <SafeAreaView style={tw`flex flex-1 px-8  justify-center`}>
          {response === null ? (
            <View>
              <View style={tw`items-center`}>
                <User
                  data={parsed}
                  dimension="100"
                  free
                  titleContainerStyle="h-[28px]"
                  titleStyle="text-sm leading-relaxed"
                  nameStyle="text-white"
                  showName={false}
                />
              </View>

              <Text
                style={tw.style(`text-white text-xl mt-5 self-center`, {
                  fontFamily: "Cabin_400Regular",
                })}
              >{`${parsed?.name?.split(" ")[0]} paged you`}</Text>

              <Text
                style={tw.style(`text-gray-2 text-sm mt-1 self-center`, {
                  fontFamily: "Cabin_400Regular",
                })}
              >
                Are you free to chat right now?
              </Text>

              <View style={tw`gap-y-5 mt-10 px-7`}>
                <Button
                  onPress={() => {
                    setResponse(true);

                    respond({
                      pageId,
                      response: {
                        response: {
                          free: true,
                        },
                      },
                    });
                  }}
                  textStyle="text-sm"
                >
                  I AM FREE
                </Button>

                <Button
                  onPress={() => {
                    setResponse(false);

                    respond({
                      pageId,
                      response: {
                        response: {
                          free: false,
                        },
                      },
                    });
                  }}
                  textStyle="text-sm text-gray-2"
                  variant="dark"
                >
                  IGNORE
                </Button>
              </View>
            </View>
          ) : response ? (
            <View style={tw`items-center`}>
              <Text
                style={tw.style(
                  `text-white text-xl mt-10 self-center text-center`,
                  {
                    fontFamily: "Cabin_400Regular",
                  },
                )}
              >
                {`Alright! We told ${
                  parsed?.name?.split(" ")[0]
                } you're free 🎉`}
              </Text>

              <View style={tw`flex-row mt-10`}>
                <User
                  data={parsed}
                  dimension="100"
                  free
                  titleContainerStyle="h-[28px]"
                  titleStyle="text-sm leading-relaxed"
                  nameStyle="text-white"
                  stroke
                />

                <View
                  style={tw`bg-accent w-20 self-center mb-10 border-[1px] border-dashed`}
                />

                <User
                  data={userData}
                  dimension="100"
                  free
                  titleContainerStyle="h-[28px]"
                  titleStyle="text-sm leading-relaxed"
                  nameOverride="You"
                  nameStyle="text-white"
                  stroke
                />
              </View>

              <TouchableOpacity onPress={router.back} style={tw`mt-44`}>
                <Text
                  style={tw.style(`text-text-2 text-sm`, {
                    fontFamily: "Cabin_700Bold",
                  })}
                >
                  CLOSE
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={tw`items-center`}>
              <User
                data={parsed}
                dimension="100"
                disabled
                free
                titleContainerStyle="h-[28px]"
                titleStyle="text-sm leading-relaxed"
                nameStyle="text-white"
                showName={false}
              />

              <Text
                style={tw.style(`text-gray-2 text-xl mt-7 self-center`, {
                  fontFamily: "Cabin_400Regular",
                })}
              >
                Ignored the page. Bye bye!
              </Text>

              <TouchableOpacity onPress={router.back} style={tw`mt-60`}>
                <Text
                  style={tw.style(`text-text-2 text-sm`, {
                    fontFamily: "Cabin_700Bold",
                  })}
                >
                  CLOSE
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    </BlurView>
  );
}
