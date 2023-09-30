import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import useUsers from "@hooks/firestore/useUsers";

export default function useGetFriends(friends) {
  const Users = useUsers();

  const { data, isInitialLoading, isFetching } = useQuery(
    ["friends"],
    async () => Users.getFriends(friends),
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
