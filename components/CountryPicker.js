import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";

import { CountryPicker } from "react-native-country-codes-picker";

import tw from "@utils/tailwind";

const CountryModal = forwardRef(({ onSelect }, ref) => {
  const [show, setShow] = useState(false);

  const showModal = useCallback(() => setShow(true), []);

  useImperativeHandle(ref, () => ({
    show: showModal,
  }));

  return (
    <CountryPicker
      onBackdropPress={() => setShow(false)}
      pickerButtonOnPress={(data) => {
        if (onSelect) {
          onSelect(data);
        }

        setShow(false);
      }}
      show={show}
      style={{
        countryName: tw.style({ fontFamily: "NunitoSans_400Regular" }),
        dialCode: tw.style({ fontFamily: "NunitoSans_700Bold" }),
        flag: tw`text-xl`,
        line: tw`my-3`,
        modal: tw`h-[80%] px-4 pt-4 pb-10`,
        textInput: tw.style(`h-12 px-4`, {
          fontFamily: "NunitoSans_400Regular",
        }),
      }}
    />
  );
});

export default memo(CountryModal);
