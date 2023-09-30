import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import useFirebase from "@hooks/useFirebase";
import useFirestore from "@hooks/useFirestore";

export default function useCheckInvites(number) {
  const { user } = useFirebase();
  const { checkInvites } = useFirestore();

  const { data, isInitialLoading, isFetching } = useQuery(
    ["checkInvites", number],
    async () => {
      // Removing inviters who are already friends
      const eligibleInviters = [];
      const result = await checkInvites(number);

      if (result?.inviters?.length > 0) {
        result.inviters.map((inviter) => {
          if (!inviter?.friends?.includes(user?.uid)) {
            eligibleInviters.push(inviter);
          }
        });
      }

      return { ...result, inviters: eligibleInviters };
    },
    {
      enabled:
        number !== undefined &&
        number !== "" &&
        typeof number === "string" &&
        user?.uid !== undefined &&
        typeof user?.uid === "string",
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
