import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { router, useLocalSearchParams, useRootNavigation } from "expo-router";

import tw from "@utils/tailwind";
import Input from "@components/Input";
import Button from "@components/Button";
import SafeView from "@components/SafeView";
import firebaseConfig from "@utils/firebase";
import BackIcon from "@assets/svgs/BackIcon";
import useAppContext from "@hooks/useAppContext";
import useLocalStorage from "@hooks/useLocalStorage";
import CountryPicker from "@components/CountryPicker";
import useVerifyOtp from "@hooks/mutations/useVerifyOtp";
import usePhoneAuth from "@hooks/mutations/usePhoneAuth";
import useUserByNumber from "@hooks/mutations/useUserByNumber";

function getErrorMessage(code) {
  if (code === "auth/invalid-verification-code") {
    return "Incorrect code, try again?";
  } else {
    return "Something went wrong. Give it another go?";
  }
}

export default function Phone() {
  // For mode = "number"
  const phoneRef = useRef();
  const recaptchaRef = useRef();
  const countryListRef = useRef();
  const { alert } = useAppContext();
  const params = useLocalSearchParams();
  const [number, setNumber] = useState();
  const { saveJson } = useLocalStorage();
  const navigation = useRootNavigation();
  const [mode, setMode] = useState("number");
  const [phoneError, setPhoneError] = useState(false);
  const [country, setCountry] = useState({ dial_code: "+91", flag: "🇮🇳" });

  // For mode = "otp"
  const otpRef = useRef();
  const [error, setError] = useState(false);

  function submitNumber() {
    if (phoneRef.current.value === "") {
      setPhoneError(true);
    } else {
      getUser(country?.dial_code + phoneRef.current.value);
    }
  }

  function submitOtp() {
    const otp = otpRef.current.value;

    if (otp.length < 6) {
      setError(true);
    } else if (otp.length === 6) {
      verifyOtp({
        otp,
        phoneResult,
      });
    }
  }

  const { getUser, gettingUser } = useUserByNumber({
    onSuccess: ({ exists }) => {
      if (params?.action === "reserve") {
        if (exists) {
          alert.current.show({
            title: "oops 😕",
            message: `Someone with the number ${country?.dial_code} ${number} already exists.`,
          });
        } else {
          signInWithPhone({
            number: country?.dial_code + number,
            recaptchaVerifier: recaptchaRef.current,
          });
        }
      } else {
        if (exists) {
          signInWithPhone({
            number: country?.dial_code + number,
            recaptchaVerifier: recaptchaRef.current,
          });
        } else {
          alert.current.show({
            title: "oops 😕",
            message: `We couldn't find a user with the number ${country?.dial_code} ${number}. Try again?`,
            onCtaPress: () => setMode("number"),
          });
        }
      }
    },
  });

  const { phoneResult, signingIn, signInWithPhone } = usePhoneAuth({
    onSuccess: () => setMode("otp"),
  });

  const { otpError, verifying, verifyOtp } = useVerifyOtp({
    onSuccess: () => {
      if (params?.action === "reserve") {
        const routeData = {
          pathname: "/dp",
          params: {
            ...params,
            country_code: country?.dial_code,
            number,
            full: `${country?.dial_code}${number}`,
          },
        };

        saveJson("checkpoint", routeData).then(() => {
          router.replace(routeData);
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "home" }],
        });
      }
    },
  });

  return (
    <SafeView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex flex-1 px-8 pt-4`}
      >
        <FirebaseRecaptchaVerifierModal
          attemptInvisibleVerification
          ref={recaptchaRef}
          firebaseConfig={firebaseConfig}
          style={tw`flex flex-1`}
        />

        <TouchableOpacity
          style={tw`flex flex-row items-center gap-x-2`}
          onPress={() => {
            if (mode === "number") {
              router.back();
            } else {
              setMode("number");
            }
          }}
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

        {mode === "number" ? (
          <>
            <View style={tw`flex flex-1 justify-center items-center`}>
              <Text
                style={tw.style(`flex text-text-1 text-4xl leading-tight`, {
                  fontFamily: "Lalezar_400Regular",
                })}
              >
                Verify your number
              </Text>

              <Text style={tw.style(`flex text-white text-3xl font-medium`)}>
                👉👈 🥺
              </Text>
            </View>

            <View style={tw`flex flex-col pb-4 gap-y-6`}>
              <Input
                LeftComponent={
                  <SelectedCountry
                    country={country}
                    onPress={() => countryListRef.current.show()}
                  />
                }
                autoFocus
                error={phoneError}
                maxLength={10}
                onChangeText={(text) => {
                  setNumber(text);
                  setPhoneError(false);
                }}
                placeholder="Your number please"
                ref={phoneRef}
                style="text-left"
                type="numeric"
              />

              <Button
                disabled={gettingUser || signingIn}
                loading={gettingUser || signingIn}
                onPress={submitNumber}
              >
                Next
              </Button>
            </View>
          </>
        ) : (
          <View style={tw`flex flex-1 py-4`}>
            <View style={tw`flex flex-1 justify-center`}>
              <View style={tw`flex justify-center items-center`}>
                <Text
                  style={tw.style(`flex text-text-1 text-4xl leading-tight`, {
                    fontFamily: "Lalezar_400Regular",
                  })}
                >
                  Got a code?
                </Text>

                <Text
                  style={tw.style(`flex text-white text-base font-medium`, {
                    fontFamily: "Cabin_400Regular",
                  })}
                >
                  Enter it below
                </Text>
              </View>

              <View style={tw`flex flex-row mt-10 justify-center`}>
                <Input
                  autoFocus
                  containerStyle="w-[200px] h-[50px]"
                  error={error || otpError}
                  fontFamily="Cabin_700Bold"
                  maxLength={6}
                  onChangeText={() => setError(false)}
                  placeholder="000000"
                  ref={otpRef}
                  style="text-xl text-center tracking-[2]"
                  type="numeric"
                />
              </View>

              {otpError ? (
                <Text
                  style={tw.style(`text-center text-gray-2 text-sm mt-6`, {
                    fontFamily: "Cabin_400Regular",
                  })}
                >
                  {getErrorMessage(otpError?.code)}
                </Text>
              ) : null}
            </View>

            <Button loading={verifying} onPress={submitOtp}>
              Next
            </Button>
          </View>
        )}

        <CountryPicker onSelect={setCountry} ref={countryListRef} />
      </KeyboardAvoidingView>
    </SafeView>
  );
}

function SelectedCountry({ country, onPress }) {
  return (
    <TouchableOpacity
      style={tw`p-3 flex-row h-full items-center bg-offwhite gap-x-2`}
      onPress={onPress}
    >
      <Text
        style={tw.style(`text-sm text-center `, {
          fontFamily: "Cabin_600SemiBold",
        })}
      >
        {country?.flag}
      </Text>

      <Text
        style={tw.style(`text-sm text-center `, {
          fontFamily: "Cabin_600SemiBold",
        })}
      >
        {country?.dial_code}
      </Text>
    </TouchableOpacity>
  );
}
