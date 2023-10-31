import { useState } from "react";
import { Linking, Text, TextInput, TouchableOpacity, View } from "react-native";

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

const noteMaxLength = 60;

export default function Contact() {
  const { page } = usePage();
  const mixpanel = useMixpanel();
  const [note, setNote] = useState("");
  const { data } = useLocalSearchParams();
  const [mode, setMode] = useState("start");
  const [paged, setPaged] = useState(false);
  const parsed = JSON.parse(data);

  return (
    <BlurView
      intensity={75}
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
        paged || parsed?.paged || parsed?.freeFrom ? (
          <View style={tw`w-72 mt-20`}>
            <OutlineButton textStyle="text-base text-gray-2" variant="dark">
              PAGE SENT!
            </OutlineButton>
          </View>
        ) : mode === "start" ? (
          <View style={tw`w-72 mt-20`}>
            <Button
              onPress={() => {
                setMode("note");
                setNote(
                  `${
                    parsed?.name?.split(" ")[0]
                  } - lets chat today when you have time.`,
                );
              }}
              textStyle="text-sm leading-tight"
            >
              {`PAGE ${parsed?.name?.split(" ")[0].toUpperCase()}`} 📟
            </Button>
          </View>
        ) : mode === "note" ? (
          <View style={tw`w-72 mt-10`}>
            <TextInput
              maxLength={noteMaxLength}
              multiline
              onChangeText={setNote}
              selectionColor="white"
              style={tw.style(
                `bg-gray-3 h-[65px] rounded-xl px-6 py-4 text-white`,
                { fontFamily: "Cabin_400Regular" },
              )}
              value={note}
            />

            <Text
              style={tw.style(`text-white/50 text-xs text-right mt-2`, {
                fontFamily: "Cabin_400Regular",
              })}
            >
              {note.length}/{noteMaxLength} (Optional)
            </Text>

            <Button
              onPress={() => {
                setPaged(true);
                page({ to: parsed?.id, note });
                mixpanel.track("paged");
              }}
              style="mt-7"
              textStyle="text-sm leading-tight"
            >
              {`SEND PAGE `} 📟
            </Button>
          </View>
        ) : null
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
