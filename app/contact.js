import { Linking, Text, TouchableOpacity, View } from "react-native";

import { BlurView } from "expo-blur";
import { router, useLocalSearchParams } from "expo-router";

import tw from "@utils/tailwind";
import User from "@components/User";
import PhoneIcon from "@assets/svgs/PhoneIcon";
import IMessageIcon from "@assets/svgs/IMessageIcon";
import WhatsAppIcon from "@assets/svgs/WhatsAppIcon";
import FacetimeIcon from "@assets/svgs/FacetimeIcon";

export default function Contact() {
  const { data } = useLocalSearchParams();
  const parsed = JSON.parse(data);

  return (
    <BlurView
      intensity={100}
      style={tw`flex flex-1 items-center justify-center`}
      tint="dark"
    >
      <User
        data={parsed}
        dimension="150"
        free={parsed?.free}
        titleContainerStyle="h-[30px]"
        titleStyle="text-base leading-relaxed px-1"
        nameStyle="text-white text-xl"
      />

      <View style={tw`flex flex-row mt-14 gap-x-8`}>
        <TouchableOpacity
          disabled={!parsed?.free}
          onPress={() => Linking.openURL(`facetime:${parsed?.phone?.full}`)}
          style={tw`${parsed?.free ? "opacity-100" : "opacity-50"}`}
        >
          <FacetimeIcon />
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!parsed?.free}
          onPress={() => Linking.openURL(`tel:${parsed?.phone?.full}`)}
          style={tw`${parsed?.free ? "opacity-100" : "opacity-50"}`}
        >
          <PhoneIcon />
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!parsed?.free}
          onPress={() => Linking.openURL(`sms:${parsed?.phone?.full}`)}
          style={tw`${parsed?.free ? "opacity-100" : "opacity-50"}`}
        >
          <IMessageIcon />
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!parsed?.free}
          onPress={() =>
            Linking.openURL(`whatsapp://send?phone=${parsed?.phone?.full}`)
          }
          style={tw`${parsed?.free ? "opacity-100" : "opacity-50"}`}
        >
          <WhatsAppIcon />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={router.back} style={tw`mt-44`}>
        <Text
          style={tw.style(`text-text-2 text-lg`, {
            fontFamily: "Cabin_700Bold",
          })}
        >
          Close
        </Text>
      </TouchableOpacity>
    </BlurView>
  );
}