import { forwardRef, useImperativeHandle, useState } from "react";
import {
  Linking,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as SMS from "expo-sms";

import tw from "@utils/tailwind";
import constants from "@utils/constants";
import IMessageBigIcon from "@assets/svgs/IMessageBigIcon";
import WhatsAppBigIcon from "@assets/svgs/WhatsAppBigIcon";

const inviteText = `Just got access to this app that lets you tell friends when you’re free to chat and when not - added you on the app, try it out!\n\n${constants.INVITE_LINK}`;

const InviteSheet = forwardRef((_, ref) => {
  const [number, setNumber] = useState(null);

  useImperativeHandle(ref, () => ({
    invite: setNumber,
  }));

  return (
    <Modal
      animationType="fade"
      hardwareAccelerated
      onRequestClose={() => setNumber(null)}
      transparent
      visible={number !== null}
    >
      <>
        <Pressable
          onPress={() => setNumber(null)}
          style={tw`bg-black/50 flex flex-1`}
        />

        <View style={tw`bg-bg h-64 p-8 items-center`}>
          <Text
            style={tw.style(`text-center text-2xl text-white px-5`, {
              fontFamily: "Cabin_700Bold",
            })}
          >
            Invite using
          </Text>

          <View style={tw`flex-row mt-10 gap-x-20`}>
            <TouchableOpacity
              style={tw`items-center gap-y-3`}
              onPress={async () => {
                await SMS.sendSMSAsync(number, inviteText);
                setNumber(null);
              }}
            >
              <IMessageBigIcon />

              <Text
                style={tw.style(`text-white`, {
                  fontFamily: "Cabin_400Regular",
                })}
              >
                Message
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`items-center gap-y-3`}
              onPress={() => {
                Linking.openURL(
                  `whatsapp://send?text=${inviteText}&phone=${number}`,
                );
                setNumber(null);
              }}
            >
              <WhatsAppBigIcon />

              <Text
                style={tw.style(`text-white`, {
                  fontFamily: "Cabin_400Regular",
                })}
              >
                WhatsApp
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    </Modal>
  );
});

export default InviteSheet;
