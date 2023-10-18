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
import { pad } from "@utils/helpers";
import Input from "@components/Input";
import Button from "@components/Button";
import SafeView from "@components/SafeView";
import firebaseConfig from "@utils/firebase";
import BackIcon from "@assets/svgs/BackIcon";
import useInterval from "@hooks/useInterval";
import useMixpanel from "@hooks/useMixpanel";
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
  const mixpanel = useMixpanel();
  const countryListRef = useRef();
  const { alert } = useAppContext();
  const params = useLocalSearchParams();
  const [number, setNumber] = useState();
  const { saveJson } = useLocalStorage();
  const navigation = useRootNavigation();
  const [mode, setMode] = useState("number");
  const [resendTimer, setResendTimer] = useState(30);
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

  function submitOtp(otp) {
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
          mixpanel.track("verified_number");
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "(onboarding)/notification",
              params: { mode: "login" },
            },
          ],
        });
      }
    },
  });

  useInterval(
    () => setResendTimer((current) => current - 1),
    mode === "otp" && resendTimer >= 1 ? 1000 : null,
  );

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

              <Input
                autoFocus
                containerStyle="w-[200px] h-[50px] mt-10 self-center"
                error={error || otpError}
                fontFamily="Cabin_700Bold"
                maxLength={6}
                onChangeText={(otp) => {
                  setError(false);

                  if (otp?.length === 6) {
                    submitOtp(otp);
                  }
                }}
                ref={otpRef}
                style="text-xl text-center tracking-[2]"
                type="numeric"
              />

              <TouchableOpacity
                onPress={() => {
                  if (resendTimer < 1) {
                    setResendTimer(30);

                    signInWithPhone({
                      number: country?.dial_code + number,
                      recaptchaVerifier: recaptchaRef.current,
                    });
                  }
                }}
                style={tw`flex-row justify-center gap-x-1 mt-5`}
              >
                <Text
                  style={tw.style(`text-gray-4`, {
                    fontFamily: "Cabin_700Bold",
                  })}
                >
                  Didn't get it?
                </Text>

                {resendTimer < 1 ? (
                  <Text
                    style={tw.style(`text-gray-4 underline`, {
                      fontFamily: "Cabin_700Bold",
                    })}
                  >
                    Resend
                  </Text>
                ) : (
                  <Text
                    style={tw.style(`text-gray-4`, {
                      fontFamily: "Cabin_700Bold",
                    })}
                  >
                    Resend in 00:{pad(resendTimer)}
                  </Text>
                )}
              </TouchableOpacity>

              {otpError ? (
                <Text
                  style={tw.style(`text-center text-gray-4 text-sm mt-5`, {
                    fontFamily: "Cabin_400Regular",
                  })}
                >
                  {getErrorMessage(otpError?.code)}
                </Text>
              ) : null}
            </View>

            <Button
              loading={verifying}
              onPress={() => submitOtp(otpRef?.current?.value)}
            >
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
