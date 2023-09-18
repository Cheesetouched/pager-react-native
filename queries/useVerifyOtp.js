import { useMemo } from "react";

import { useMutation } from "@tanstack/react-query";

export default function useVerifyOtp(props = {}) {
  const { onSuccess } = props;

  const { data, error, isLoading, mutate } = useMutation(
    ({ otp, phoneResult }) => phoneResult.confirm(otp),
    { onSuccess },
  );

  return useMemo(
    () => ({
      otpError: error,
      user: data?.user,
      verifying: isLoading,
      verifyOtp: mutate,
    }),
    [data?.user, error, isLoading, mutate],
  );
}
