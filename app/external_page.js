import { useState } from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";

import { BlurView } from "expo-blur";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import tw from "@utils/tailwind";
import Button from "@components/Button";
import { getInitials } from "@utils/helpers";
import PhoneIcon from "@assets/svgs/PhoneIcon";
import usePages from "@hooks/firestore/usePages";
import WhatsAppIcon from "@assets/svgs/WhatsAppIcon";
import OutlineButton from "@components/OutlineButton";

export default function ExternalPageResponse() {
  const Pages = usePages();
  const { data } = useLocalSearchParams();
  const [response, setResponse] = useState(null);
  const page = JSON.parse(data);

  return (
    <BlurView intensity={75} style={tw`flex flex-1`} tint="dark">
      <SafeAreaProvider>
        <SafeAreaView style={tw`flex flex-1 px-8`}>
          {response === null ? (
            <View style={tw`flex-1 justify-center px-7`}>
              <View>
                <View
                  style={tw`self-center border-[1.5px] border-gray-4 items-center justify-center h-[100px] w-[100px] rounded-full`}
                >
                  <Text
                    style={tw.style(`text-[40px] text-white`, {
                      fontFamily: "Cabin_700Bold",
                    })}
                  >
                    {getInitials(page?.name)}
                  </Text>
                </View>

                <Text
                  style={tw.style(
                    `text-sm text-gray-4 mt-3 self-center leading-none`,
                    {
                      fontFamily: "Cabin_400Regular_Italic",
                    },
                  )}
                >
                  Not on pager yet
                </Text>
              </View>

              <View style={tw`my-8 gap-y-3`}>
                <Text
                  style={tw.style(
                    `text-white text-xl mt-2 self-center leading-none`,
                    {
                      fontFamily: "Cabin_400Regular",
                    },
                  )}
                >{`${page?.name?.split(" ")[0]} paged you`}</Text>

                {page?.message ? (
                  <View style={tw`bg-black/40 rounded-2xl`}>
                    <Text
                      style={tw.style(
                        `text-white text-base mt-1 self-center leading-none p-6`,
                        {
                          fontFamily: "Cabin_400Regular",
                        },
                      )}
                    >
                      "{page?.message}"
                    </Text>
                  </View>
                ) : null}
              </View>

              <View style={tw`gap-y-5`}>
                <Text
                  style={tw.style(
                    `text-gray-2 text-sm mt-1 self-center leading-none`,
                    {
                      fontFamily: "Cabin_400Regular",
                    },
                  )}
                >
                  Are you free to chat right now?
                </Text>

                <Button
                  onPress={() => {
                    setResponse("free");

                    Pages.update(page?.id, {
                      response: { free: true },
                    });
                  }}
                  textStyle="text-sm"
                >
                  I AM FREE
                </Button>

                <OutlineButton
                  onPress={() => {
                    setResponse("ignore");

                    Pages.update(page?.id, {
                      response: { free: false },
                    });
                  }}
                  textStyle="text-sm"
                  variant="dark"
                >
                  IGNORE
                </OutlineButton>
              </View>
            </View>
          ) : null}

          {response === "free" ? (
            <View style={tw`flex-1 items-center justify-center`}>
              <View
                style={tw`self-center border-[1.5px] border-gray-4 items-center justify-center h-[100px] w-[100px] rounded-full`}
              >
                <Text
                  style={tw.style(`text-[40px] text-white`, {
                    fontFamily: "Cabin_700Bold",
                  })}
                >
                  {getInitials(page?.name)}
                </Text>
              </View>

              <Text
                style={tw.style(
                  `text-white text-xl mt-5 self-center leading-none`,
                  {
                    fontFamily: "Cabin_600SemiBold",
                  },
                )}
              >
                {page?.name}
              </Text>

              <Text
                style={tw.style(
                  `text-sm text-gray-4 mt-2 self-center leading-none`,
                  {
                    fontFamily: "Cabin_400Regular_Italic",
                  },
                )}
              >
                Not on pager yet
              </Text>

              <View style={tw`flex flex-row mt-14 gap-x-8`}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${data?.phone?.full}`)}
                >
                  <PhoneIcon />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      `whatsapp://send?phone=${data?.phone?.full}`,
                    )
                  }
                >
                  <WhatsAppIcon />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={router.back} style={tw`mt-50`}>
                <Text
                  style={tw.style(`text-text-2 text-sm`, {
                    fontFamily: "Cabin_700Bold",
                  })}
                >
                  CLOSE
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {response === "ignore" ? (
            <View style={tw`flex-1 items-center justify-center`}>
              <View
                style={tw`self-center border-[1.5px] border-gray-4 items-center justify-center h-[100px] w-[100px] rounded-full`}
              >
                <Text
                  style={tw.style(`text-[40px] text-white`, {
                    fontFamily: "Cabin_700Bold",
                  })}
                >
                  {getInitials(page?.name)}
                </Text>
              </View>

              <Text
                style={tw.style(`text-gray-2 text-xl mt-10 self-center`, {
                  fontFamily: "Cabin_400Regular",
                })}
              >
                Ignored the page. Bye bye!
              </Text>

              <TouchableOpacity onPress={router.back} style={tw`mt-50`}>
                <Text
                  style={tw.style(`text-text-2 text-sm`, {
                    fontFamily: "Cabin_700Bold",
                  })}
                >
                  CLOSE
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </SafeAreaView>
      </SafeAreaProvider>
    </BlurView>
  );
}
