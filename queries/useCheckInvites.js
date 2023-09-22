import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import useFirestore from "@hooks/useFirestore";

export default function useCheckInvites(number) {
  const { checkInvites } = useFirestore();

  const { data, isInitialLoading, isFetching } = useQuery(
    ["checkInvites", number],
    () => checkInvites(number),
    {
      enabled:
        number !== undefined && number !== "" && typeof number === "string",
      staleTime: 10 * (1000 * 60),
    },
  );

  return useMemo(
    () => ({
      ...data,
      checking: isInitialLoading || isFetching,
    }),
    [data, isFetching, isInitialLoading],
  );
}
