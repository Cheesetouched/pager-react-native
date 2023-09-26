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
  const first = useRef();
  const second = useRef();
  const third = useRef();
  const fourth = useRef();
  const fifth = useRef();
  const sixth = useRef();
  const [error, setError] = useState({
    first: false,
    second: false,
    third: false,
    fourth: false,
    fifth: false,
    sixth: false,
  });

  function submitNumber() {
    if (phoneRef.current.value === "") {
      setPhoneError(true);
    } else {
      getUser(country?.dial_code + phoneRef.current.value);
    }
  }

  function submitOtp() {
    const firstDigit = first.current.value;
    const secondDigit = second.current.value;
    const thirdDigit = third.current.value;
    const fourthDigit = fourth.current.value;
    const fifthDigit = fifth.current.value;
    const sixthDigit = sixth.current.value;

    const otp =
      firstDigit +
      secondDigit +
      thirdDigit +
      fourthDigit +
      fifthDigit +
      sixthDigit;

    if (sixthDigit.length === 0) {
      sixth.current.focus();
      setError((old) => ({ ...old, sixth: true }));
    } else {
      setError((old) => ({ ...old, sixth: false }));
    }

    if (fifthDigit.length === 0) {
      fifth.current.focus();
      setError((old) => ({ ...old, fifth: true }));
    } else {
      setError((old) => ({ ...old, fifth: false }));
    }

    if (fourthDigit.length === 0) {
      fourth.current.focus();
      setError((old) => ({ ...old, fourth: true }));
    } else {
      setError((old) => ({ ...old, fourth: false }));
    }

    if (thirdDigit.length === 0) {
      third.current.focus();
      setError((old) => ({ ...old, third: true }));
    } else {
      setError((old) => ({ ...old, third: false }));
    }

    if (secondDigit.length === 0) {
      second.current.focus();
      setError((old) => ({ ...old, second: true }));
    } else {
      setError((old) => ({ ...old, second: false }));
    }

    if (firstDigit.length === 0) {
      first.current.focus();
      setError((old) => ({ ...old, first: true }));
    } else {
      setError((old) => ({ ...old, first: false }));
    }

    if (otp.length === 6) {
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
          pathname: "/details",
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
        style={tw`flex flex-1 px-4 pt-4`}
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
                style={tw.style(`flex text-text-1 text-5xl`, {
                  fontFamily: "Lalezar_400Regular",
                })}
              >
                verify number
              </Text>

              <Text
                style={tw.style(`flex text-white text-3xl font-medium mt-5`)}
              >
                👉👈 🥺
              </Text>
            </View>

            <View style={tw`flex flex-col pb-4 gap-y-4`}>
              <Input
                LeftComponent={
                  <SelectedCountry
                    country={country}
                    onPress={() => countryListRef.current.show()}
                  />
                }
                autoFocus
                error={phoneError}
                loading={gettingUser || signingIn}
                maxLength={10}
                onChangeText={(text) => {
                  setNumber(text);
                  setPhoneError(false);
                }}
                placeholder="Enter phone number"
                ref={phoneRef}
                style="text-left"
                type="numeric"
              />

              <Button
                disabled={gettingUser || signingIn}
                onPress={submitNumber}
              >
                next
              </Button>
            </View>
          </>
        ) : (
          <View style={tw`flex flex-1 py-4`}>
            <View style={tw`flex flex-1 justify-center`}>
              <View style={tw`flex justify-center items-center`}>
                <Text
                  style={tw.style(`flex text-text-1 text-5xl`, {
                    fontFamily: "Lalezar_400Regular",
                  })}
                >
                  got a code?
                </Text>

                <Text
                  style={tw.style(`flex text-white text-lg font-medium mt-3`)}
                >
                  enter it below
                </Text>
              </View>

              <View style={tw`flex flex-row mt-10 justify-between`}>
                <Input
                  autoFocus
                  containerStyle="w-[45px]"
                  error={error.first || otpError}
                  maxLength={1}
                  onChangeText={(text) => {
                    if (text.length === 1) {
                      second.current.focus();
                    }
                  }}
                  onMaxLength={(text) => {
                    second.current.focus();
                    second.current.setValue(text);
                  }}
                  ref={first}
                  type="numeric"
                />

                <Input
                  containerStyle="w-[45px]"
                  error={error.second || otpError}
                  maxLength={1}
                  onBackspace={() => first.current.focus()}
                  onChangeText={(text) => {
                    if (text.length === 1) {
                      third.current.focus();
                    }
                  }}
                  onMaxLength={(text) => {
                    third.current.focus();
                    third.current.setValue(text);
                  }}
                  ref={second}
                  type="numeric"
                />

                <Input
                  containerStyle="w-[45px]"
                  error={error.third || otpError}
                  maxLength={1}
                  onBackspace={() => second.current.focus()}
                  onChangeText={(text) => {
                    if (text.length === 1) {
                      fourth.current.focus();
                    }
                  }}
                  onMaxLength={(text) => {
                    fourth.current.focus();
                    fourth.current.setValue(text);
                  }}
                  ref={third}
                  type="numeric"
                />

                <Input
                  containerStyle="w-[45px]"
                  error={error.fourth || otpError}
                  maxLength={1}
                  onBackspace={() => third.current.focus()}
                  onChangeText={(text) => {
                    if (text.length === 1) {
                      fifth.current.focus();
                    }
                  }}
                  onMaxLength={(text) => {
                    fifth.current.focus();
                    fifth.current.setValue(text);
                  }}
                  ref={fourth}
                  type="numeric"
                />

                <Input
                  containerStyle="w-[45px]"
                  error={error.fifth || otpError}
                  maxLength={1}
                  onBackspace={() => fourth.current.focus()}
                  onChangeText={(text) => {
                    if (text.length === 1) {
                      sixth.current.focus();
                    }
                  }}
                  onMaxLength={(text) => {
                    sixth.current.focus();
                    sixth.current.setValue(text);
                  }}
                  ref={fifth}
                  type="numeric"
                />

                <Input
                  containerStyle="w-[45px]"
                  error={error.sixth || otpError}
                  maxLength={1}
                  onBackspace={() => fifth.current.focus()}
                  ref={sixth}
                  type="numeric"
                />
              </View>

              {otpError ? (
                <Text
                  style={tw.style(`text-center text-text-gray text-sm mt-6`, {
                    fontFamily: "Cabin_400Regular",
                  })}
                >
                  {getErrorMessage(otpError?.code)}
                </Text>
              ) : null}
            </View>

            <Button loading={verifying} onPress={submitOtp}>
              next
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
      style={tw`p-3 flex-row h-full items-center bg-gray-100 gap-x-2`}
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
