import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import useFirebase from "@hooks/useFirebase";
import useFriendGraph from "@hooks/useFriendGraph";

export default function useGetRequests() {
  const { user } = useFirebase();
  const { getRequests } = useFriendGraph();

  const { data, isInitialLoading, isFetching } = useQuery(
    ["requests", user?.uid],
    () => getRequests(user?.uid),
    { enabled: typeof user?.uid === "string" },
  );

  return useMemo(
    () => ({
      getting: isInitialLoading || isFetching,
      requests: data,
      refetching: isFetching,
    }),
    [data, isFetching, isInitialLoading],
  );
}
