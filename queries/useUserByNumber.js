import { useMemo } from "react";

import { useMutation } from "@tanstack/react-query";

import useFirestore from "@hooks/useFirestore";

export default function useUserByNumber(props = {}) {
  const { onSuccess } = props;
  const { getUserByNumber } = useFirestore();

  const { data, isLoading, mutate } = useMutation(
    (number) => getUserByNumber(number),
    { onSuccess },
  );

  return useMemo(
    () => ({
      ...data,
      gettingUser: isLoading,
      getUser: mutate,
    }),
    [data, isLoading, mutate],
  );
}
