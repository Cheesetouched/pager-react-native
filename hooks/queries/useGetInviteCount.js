import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import useFirebase from "@hooks/useFirebase";
import useInvites from "@hooks/firestore/useInvites";

export default function useGetInviteCount() {
  const { user } = useFirebase();
  const { getInviteCount } = useInvites();

  const { data, isInitialLoading, isFetching } = useQuery(
    ["inviteCount", user?.uid],
    async () => getInviteCount(user?.uid),
    {
      enabled: typeof user?.uid === "string",
    },
  );

  return useMemo(
    () => ({
      ...data,
      getting: isInitialLoading || isFetching,
    }),
    [data, isFetching, isInitialLoading],
  );
}
