import { useState } from "react";
import { Dimensions, Text, View } from "react-native";

import { Image } from "expo-image";
import { router } from "expo-router";
import Carousel from "react-native-reanimated-carousel";

import tw from "@utils/tailwind";
import Button from "@components/Button";
import SafeView from "@components/SafeView";
import NotifExample from "@components/NotifExample";
import useLocalStorage from "@hooks/useLocalStorage";
import PageIndicator from "@components/PageIndicator";

const data = [
  {
    image: require("@assets/welcome_1.png"),
    text1: "Find time to chat up with friends",
    text2: "Ask them if they’re free",
  },
  {
    image: require("@assets/welcome_2.png"),
    text1: "Let others know when you’re free",
    notifExample: true,
  },
];

const width = Dimensions.get("window").width;

export default function WelcomeContext() {
  const localStorage = useLocalStorage();
  const [position, setPosition] = useState(1);

  return (
    <SafeView>
      <Carousel
        data={data}
        loop={false}
        onSnapToItem={(index) => setPosition(index + 1)}
        renderItem={({ item }) => (
          <View style={tw`flex-1 items-center justify-center`}>
            <View style={tw`absolute items-center top-5`}>
              <Text
                style={tw.style(`text-white text-[22px]`, {
                  fontFamily: "Cabin_600SemiBold",
                })}
              >
                {item?.text1}
              </Text>

              <Text
                style={tw.style(`text-gray-4 text-lg mt-1`, {
                  fontFamily: "Cabin_600SemiBold",
                })}
              >
                {item?.text2}
              </Text>
            </View>

            {item?.notifExample ? (
              <NotifExample
                title="Momo paged you"
                subtitle="Let them know if you’re free to chat!"
                style={tw.style(`absolute mx-12 top-[90px]`, {
                  transform: [{ rotate: "-1.5deg" }],
                })}
              />
            ) : null}

            <Image source={item?.image} style={tw`h-[406px] w-[259px] mt-28`} />
          </View>
        )}
        style={tw`h-[95%]`}
        width={width}
      />

      {position < 2 ? (
        <View style={tw`flex flex-row h-[5%]`}>
          <PageIndicator current={position} total={data.length} />
        </View>
      ) : (
        <View style={tw`absolute bottom-12 items-center w-full`}>
          <Button
            onPress={() => {
              router.push("/home");
              localStorage.save("welcome_context", "seen");
            }}
            style="w-40"
          >
            Get started
          </Button>
        </View>
      )}
    </SafeView>
  );
}
