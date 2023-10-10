import { useCallback, useState } from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";

import { BlurView } from "expo-blur";
import { router, useLocalSearchParams } from "expo-router";

import tw from "@utils/tailwind";
import User from "@components/User";
import Button from "@components/Button";
import useMixpanel from "@hooks/useMixpanel";
import PhoneIcon from "@assets/svgs/PhoneIcon";
import usePage from "@hooks/mutations/usePage";
import IMessageIcon from "@assets/svgs/IMessageIcon";
import WhatsAppIcon from "@assets/svgs/WhatsAppIcon";
import FacetimeIcon from "@assets/svgs/FacetimeIcon";
import OutlineButton from "@components/OutlineButton";

export default function Contact() {
  const mixpanel = useMixpanel();
  const { data } = useLocalSearchParams();
  const [paged, setPaged] = useState(false);
  const parsed = JSON.parse(data);

  const onSuccess = useCallback(() => {
    setPaged(true);
  }, []);

  const { page, paging } = usePage({
    onSuccess,
  });

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
        freeTextStyle="text-gray-4 text-base mt-2"
        titleContainerStyle="h-[30px]"
        titleStyle="text-base leading-relaxed px-1"
        nameStyle="text-white text-xl"
        paged={paged || parsed?.paged}
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

      {!parsed?.free ? (
        <View style={tw`w-60 mt-20`}>
          {paged || parsed?.paged || parsed?.freeFrom ? (
            <OutlineButton textStyle="text-base text-gray-2" variant="dark">
              PAGE SENT!
            </OutlineButton>
          ) : (
            <Button
              loading={paging}
              onPress={() => {
                page(parsed?.id);
                mixpanel.track("paged");
              }}
              textStyle="text-sm leading-tight"
              variant="dark"
            >
              {`PAGE ${parsed?.name?.split(" ")[0].toUpperCase()}`} 📟
            </Button>
          )}
        </View>
      ) : null}

      <TouchableOpacity onPress={router.back} style={tw`mt-30`}>
        <Text
          style={tw.style(`text-text-2 text-sm`, {
            fontFamily: "Cabin_700Bold",
          })}
        >
          CLOSE
        </Text>
      </TouchableOpacity>
    </BlurView>
  );
}
