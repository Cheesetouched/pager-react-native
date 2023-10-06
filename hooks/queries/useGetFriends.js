import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import useFriendGraph from "@hooks/useFriendGraph";

export default function useGetFriends(friends) {
  const { getFriends } = useFriendGraph();

  const { data, isInitialLoading, isFetching } = useQuery(
    ["friends"],
    () => {
      if (friends?.length > 0) {
        return getFriends(friends);
      } else {
        return [];
      }
    },
    {
      enabled: friends !== undefined && typeof friends === "object",
    },
  );

  return useMemo(
    () => ({
      checking: isInitialLoading || isFetching,
      friends: data,
    }),
    [data, isFetching, isInitialLoading],
  );
}
