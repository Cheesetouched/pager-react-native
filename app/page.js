import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { BlurView } from "expo-blur";
import { router, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addHours, addMinutes, roundToNearestMinutes } from "date-fns";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import tw from "@utils/tailwind";
import User from "@components/User";
import useUser from "@hooks/useUser";
import Button from "@components/Button";
import BackIcon from "@assets/svgs/BackIcon";
import useMixpanel from "@hooks/useMixpanel";
import OutlineButton from "@components/OutlineButton";
import usePageResponse from "@hooks/mutations/usePageResponse";

export default function Page() {
  const current = new Date();
  const maximumDate = addHours(current, 12);

  const defaultDate = roundToNearestMinutes(addHours(current, 1), {
    nearestTo: 15,
    roundingMethod: "floor",
  });

  const minimumDate = roundToNearestMinutes(current, {
    nearestTo: 15,
    roundingMethod: "ceil",
  });

  const { userData } = useUser();
  const mixpanel = useMixpanel();
  const { respond } = usePageResponse();
  const [freeIn, setFreeIn] = useState(1);
  const [response, setResponse] = useState(null);
  const { from, page } = useLocalSearchParams();
  const [freeAt, setFreeAt] = useState(defaultDate);
  const [laterMode, setLaterMode] = useState("picker");
  const fromData = JSON.parse(from);
  const pageData = JSON.parse(page);

  function handleChange(_, date) {
    setFreeAt(date);
  }

  return (
    <BlurView intensity={100} style={tw`flex flex-1`} tint="dark">
      <SafeAreaProvider>
        <SafeAreaView style={tw`flex flex-1 px-8`}>
          {response === null ? (
            <View style={tw`flex-1 justify-center px-7`}>
              <View style={tw`items-center relative`}>
                <User
                  data={fromData}
                  dimension="100"
                  free
                  titleContainerStyle="h-[28px]"
                  titleStyle="text-sm leading-relaxed"
                  nameStyle="text-white"
                  showName={false}
                  title="👋🏻"
                />
              </View>

              <Text
                style={tw.style(`text-white text-xl mt-7 self-center`, {
                  fontFamily: "Cabin_400Regular",
                })}
              >{`${fromData?.name?.split(" ")[0]} paged you`}</Text>

              {pageData?.note ? (
                <View style={tw`bg-black/40 rounded-2xl my-5`}>
                  <Text
                    style={tw.style(
                      `text-white text-center text-sm self-center px-6 py-4`,
                      {
                        fontFamily: "Cabin_400Regular",
                      },
                    )}
                  >
                    {pageData?.note}
                  </Text>
                </View>
              ) : null}

              <Text
                style={tw.style(
                  `text-gray-2 text-sm self-center ${
                    pageData?.note ? "mt-0" : "mt-1"
                  }`,
                  { fontFamily: "Cabin_400Regular" },
                )}
              >
                Are you free to chat right now?
              </Text>

              <View style={tw`gap-y-5 ${pageData?.note ? "mt-5" : "mt-10"}`}>
                <Button
                  onPress={() => {
                    setResponse("free");
                    mixpanel.track("tapped_free");

                    respond({
                      accepterUid: userData?.id,
                      pageId: pageData?.id,
                      response: {
                        response: {
                          free: true,
                          freeTill: addHours(new Date(), 1),
                        },
                      },
                      senderUid: fromData?.id,
                    });
                  }}
                  textStyle="text-sm"
                >
                  I AM FREE
                </Button>

                <View style={tw`flex-row gap-x-5`}>
                  <Button
                    onPress={() => {
                      mixpanel.track("tapped_free_later");
                      setResponse("promptLater");
                    }}
                    style="flex-1"
                    textStyle="text-sm text-gray-2 leading-tight"
                    variant="dark"
                  >
                    FREE LATER
                  </Button>

                  <OutlineButton
                    onPress={() => {
                      setResponse("ignore");
                      mixpanel.track("tapped_ignore");

                      respond({
                        accepterUid: userData?.id,
                        pageId: pageData?.id,
                        response: {
                          response: {
                            free: false,
                          },
                        },
                        senderUid: fromData?.id,
                      });
                    }}
                    style="flex-1"
                    textStyle="text-sm text-gray-2"
                    variant="dark"
                  >
                    IGNORE
                  </OutlineButton>
                </View>
              </View>
            </View>
          ) : null}

          {response === "free" ? (
            <View style={tw`flex-1 items-center justify-center`}>
              <Text
                style={tw.style(
                  `text-white text-xl mt-10 self-center text-center`,
                  {
                    fontFamily: "Cabin_400Regular",
                  },
                )}
              >
                {`Alright! We told ${
                  fromData?.name?.split(" ")[0]
                } you're free 🎉`}
              </Text>

              <View style={tw`flex-row mt-10`}>
                <User
                  data={fromData}
                  dimension="100"
                  free
                  nameStyle="text-white"
                  titleContainerStyle="h-[28px]"
                  titleStyle="text-sm leading-relaxed"
                  title="👋🏻"
                />

                <View
                  style={tw`bg-accent w-20 self-center mb-10 border-[1px] border-dashed`}
                />

                <User
                  data={userData}
                  dimension="100"
                  free
                  nameOverride="You"
                  nameStyle="text-white"
                  titleContainerStyle="h-[28px]"
                  titleStyle="text-sm leading-relaxed"
                  title="👋🏻"
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
          ) : null}

          {response === "ignore" ? (
            <View style={tw`flex-1 items-center justify-center`}>
              <User
                data={fromData}
                dimension="100"
                disabled
                free
                nameStyle="text-white"
                showName={false}
                titleContainerStyle="h-[28px]"
                titleStyle="text-sm leading-relaxed"
                title="👋🏻"
              />

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

          {response === "promptLater" ? (
            <View style={tw`flex-1`}>
              <TouchableOpacity
                onPress={() => {
                  if (laterMode === "custom") {
                    setLaterMode("picker");
                  } else {
                    setResponse(null);
                  }
                }}
                style={tw` flex flex-row items-center gap-x-2 top-4 z-10`}
              >
                <BackIcon />

                <Text
                  style={tw.style(`text-base text-white font-semibold`, {
                    fontFamily: "Cabin_600SemiBold",
                  })}
                >
                  back
                </Text>
              </TouchableOpacity>

              <View style={tw`flex-1 justify-center`}>
                <User
                  data={fromData}
                  dimension="100"
                  free
                  nameStyle="text-white"
                  showName={false}
                  titleContainerStyle="h-[28px]"
                  titleStyle="text-sm leading-relaxed"
                  title="👋🏻"
                />

                <Text
                  style={tw.style(`text-white text-xl mt-7 self-center`, {
                    fontFamily: "Cabin_400Regular",
                  })}
                >
                  Pick a time
                </Text>

                <Text
                  style={tw.style(
                    `text-gray-2 text-sm text-center mt-2 self-center`,
                    {
                      fontFamily: "Cabin_400Regular",
                    },
                  )}
                >
                  We’ll send them a notification with the time you pick.
                </Text>

                {laterMode === "picker" ? (
                  <View style={tw`gap-y-3 my-10`}>
                    <View style={tw`flex-row gap-x-3`}>
                      <BlackButton
                        onPress={() => setFreeIn(1)}
                        selected={freeIn === 1}
                      >
                        Free in 15 mins
                      </BlackButton>

                      <BlackButton
                        onPress={() => setFreeIn(2)}
                        selected={freeIn === 2}
                      >
                        Free in 1 hr
                      </BlackButton>
                    </View>

                    <View style={tw`flex-row gap-x-3`}>
                      <BlackButton
                        onPress={() => setFreeIn(3)}
                        selected={freeIn === 3}
                      >
                        Tomorrow
                      </BlackButton>

                      <GrayButton onPress={() => setLaterMode("custom")}>
                        Set custom
                      </GrayButton>
                    </View>
                  </View>
                ) : null}

                {laterMode === "custom" ? (
                  <DateTimePicker
                    display="spinner"
                    mode="time"
                    minuteInterval={15}
                    maximumDate={maximumDate}
                    minimumDate={minimumDate}
                    onChange={handleChange}
                    style={tw`my-5`}
                    value={freeAt}
                  />
                ) : null}

                {laterMode === "picker" ? (
                  <Button
                    onPress={() => {
                      let freeFromTime = null;
                      let freeTillTime = null;

                      setResponse("later");
                      mixpanel.track("picked_a_time");

                      if (freeIn === 1) {
                        freeFromTime = addMinutes(current, 15);
                        freeTillTime = addHours(freeFromTime, 1);
                        setFreeAt(freeFromTime);
                      } else if (freeIn === 2) {
                        freeFromTime = addHours(current, 1);
                        freeTillTime = addHours(freeFromTime, 1);
                        setFreeAt(freeFromTime);
                      } else if (freeIn === 3) {
                        freeFromTime = addHours(current, 24);
                        freeTillTime = addHours(freeFromTime, 1);
                        setFreeAt(freeFromTime);
                      }

                      respond({
                        accepterUid: userData?.id,
                        pageId: pageData?.id,
                        picked: freeIn,
                        response: {
                          response: {
                            free: false,
                            freeFrom: freeFromTime,
                            freeTill: freeTillTime,
                          },
                        },
                        senderUid: fromData?.id,
                      });
                    }}
                    style="w-full"
                    textStyle="text-sm"
                    variant="dark"
                  >
                    LET THEM KNOW
                  </Button>
                ) : null}

                {laterMode === "custom" ? (
                  <Button
                    onPress={() => {
                      setResponse("later");
                      mixpanel.track("chose_a_time");

                      respond({
                        accepterUid: userData?.id,
                        pageId: pageData?.id,
                        response: {
                          response: {
                            free: false,
                            freeFrom: freeAt,
                            freeTill: addHours(freeAt, 1),
                          },
                        },
                        senderUid: fromData?.id,
                      });
                    }}
                    style="w-full"
                    textStyle="text-sm"
                    variant="dark"
                  >
                    LET THEM KNOW
                  </Button>
                ) : null}
              </View>
            </View>
          ) : null}

          {response === "later" ? (
            <View style={tw`flex-1 items-center justify-center`}>
              <Text
                style={tw.style(
                  `text-white text-xl mt-10 self-center text-center`,
                  {
                    fontFamily: "Cabin_400Regular",
                  },
                )}
              >
                {`Okay! We’ll let ${
                  fromData?.name?.split(" ")[0]
                } know when you’re likely to be free.`}
              </Text>

              <View style={tw`flex-row mt-10`}>
                <User
                  data={fromData}
                  dimension="100"
                  free
                  nameStyle="text-white"
                  titleContainerStyle="h-[28px]"
                  titleStyle="text-sm leading-relaxed"
                  title="👋🏻"
                />

                <View style={tw`w-20 self-center mb-10`} />

                <View style={tw`items-center`}>
                  <User
                    data={userData}
                    dimension="100"
                    disabled
                    free
                    nameOverride="You"
                    title="🕒"
                    titleContainerStyle="h-[28px]"
                    titleStyle="text-xs leading-relaxed"
                  />

                  {laterMode === "picker" ? (
                    <Text
                      style={tw.style(`text-gray-4 text-xs mt-1`, {
                        fontFamily: "Cabin_400Regular",
                      })}
                    >
                      {freeIn === 1
                        ? "Free in 15 mins"
                        : freeIn === 2
                        ? "Free in 1 hr"
                        : freeIn === 3
                        ? "Free tomorrow"
                        : null}
                    </Text>
                  ) : (
                    <Text
                      style={tw.style(`text-gray-4 text-xs mt-1`, {
                        fontFamily: "Cabin_400Regular",
                      })}
                    >
                      Free at{" "}
                      {freeAt?.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  )}
                </View>
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
          ) : null}
        </SafeAreaView>
      </SafeAreaProvider>
    </BlurView>
  );
}

function BlackButton({ children, onPress, selected = false }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw.style(
        `h-[45px] bg-black/40 justify-center items-center rounded-2xl flex-1 border-white`,
        selected ? "border" : "border-0",
      )}
    >
      <Text
        style={tw.style(`text-white`, {
          fontFamily: "Cabin_400Regular",
        })}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

function GrayButton({ children, onPress, selected = false }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw.style(
        `h-[45px] bg-gray-3 justify-center items-center rounded-2xl flex-1 border-white`,
        selected ? "border" : "border-0",
      )}
    >
      <Text
        style={tw.style(`text-gray-4`, {
          fontFamily: "Cabin_400Regular",
        })}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}
