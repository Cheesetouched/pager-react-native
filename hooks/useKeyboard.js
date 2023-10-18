import { useEffect, useMemo, useState } from "react";
import { Keyboard } from "react-native";

export default function useKeyboard() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      "keyboardWillShow",
      () => setKeyboardVisible(true),
    );
    const keyboardWillHideListener = Keyboard.addListener(
      "keyboardWillHide",
      () => setKeyboardVisible(false),
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  return useMemo(
    () => ({
      keyboardVisible,
    }),
    [keyboardVisible],
  );
}
