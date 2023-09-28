import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import useFriendGraph from "@hooks/useFriendGraph";

export default function useGetFriends(friends) {
  const { getFriends } = useFriendGraph();

  const { data, isInitialLoading, isFetching } = useQuery(
    ["friends"],
    async () => getFriends(friends),
    {
      enabled: friends && typeof friends === "object" && friends?.length > 0,
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
