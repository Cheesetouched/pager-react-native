import { useMemo } from "react";

import { useMutation } from "@tanstack/react-query";
import { signInWithPhoneNumber } from "firebase/auth";

import useFirebase from "@hooks/useFirebase";

export default function usePhoneAuth(props = {}) {
  const { auth } = useFirebase();
  const { onSuccess } = props;

  const { data, isLoading, mutate } = useMutation(
    ({ number, recaptchaVerifier }) =>
      signInWithPhoneNumber(auth, number, recaptchaVerifier),
    { onSuccess },
  );

  return useMemo(
    () => ({
      signingIn: isLoading,
      phoneResult: data,
      signInWithPhone: mutate,
    }),
    [data, isLoading, mutate],
  );
}
