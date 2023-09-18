import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { ActivityIndicator, TextInput, View } from "react-native";

import tw from "@utils/tailwind";

const Input = forwardRef(
  (
    {
      LeftComponent,
      autoFocus = false,
      containerStyle,
      error = false,
      type = "default",
      maxLength = null,
      loading = false,
      lowercase = false,
      onBackspace,
      onBlur,
      onChangeText,
      onFocus,
      onMaxLength,
      placeholder,
      rightIcon = null,
      style,
      trim = false,
      whitespace = true,
    },
    ref,
  ) => {
    const localRef = useRef();
    const [value, setValue] = useState("");
    const [focused, setFocused] = useState(false);

    function blurListener() {
      if (onBlur) onBlur();
      setFocused(false);
    }

    function focusListener() {
      if (onFocus) onFocus();
      setFocused(true);
    }

    function processText(text) {
      let processed = text;

      if (lowercase) {
        processed = processed.toLowerCase();
      }

      if (!whitespace) {
        processed = processed.replace(/ +/g, "");
      }

      if (trim) {
        processed = processed.trim();
      }

      return processed;
    }

    useImperativeHandle(ref, () => ({
      focus: () => localRef.current.focus(),
      setValue,
      value,
    }));

    return (
      <View
        style={tw.style(
          `bg-white rounded-xl border-2 items-center flex-row h-[50px] overflow-hidden`,
          `${containerStyle ? containerStyle : ""}`,
          `${
            error
              ? "border-red-500"
              : focused
              ? "border-black"
              : "border-gray-200"
          }`,
        )}
      >
        {LeftComponent ? LeftComponent : null}

        <TextInput
          autoFocus={autoFocus}
          keyboardType={type}
          maxLength={maxLength}
          onBlur={blurListener}
          onChangeText={(text) => {
            const processed = processText(text);
            setValue(processed);

            if (onChangeText) {
              onChangeText(processed);
            }
          }}
          onFocus={focusListener}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === "Backspace" && onBackspace) {
              onBackspace();
            }

            if (
              maxLength !== null &&
              value.length === maxLength &&
              onMaxLength &&
              nativeEvent.key !== "Backspace"
            ) {
              onMaxLength(nativeEvent?.key);
            }
          }}
          placeholder={placeholder}
          placeholderTextColor="#B5B5B5"
          ref={localRef}
          selectionColor="black"
          style={tw.style(
            `text-center text-base flex-1 px-3`,
            `${style ? style : ""}`,
            { fontFamily: "NunitoSans_700Bold" },
          )}
          value={value}
        />

        <View style={tw`absolute right-3`}>
          {loading ? <ActivityIndicator /> : rightIcon ? rightIcon : null}
        </View>
      </View>
    );
  },
);

export default Input;
