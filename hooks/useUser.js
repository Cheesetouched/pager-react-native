import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import useFirebase from "@hooks/useFirebase";
import useUsers from "@hooks/firestore/useUsers";

export default function useUser() {
  const Users = useUsers();
  const { user } = useFirebase();

  const { data, isInitialLoading, isFetching } = useQuery(
    ["user", user?.uid],
    () => Users.get(user?.uid),
    {
      enabled: user !== null && user !== undefined,
      staleTime: 10 * (1000 * 60),
    },
  );

  return useMemo(
    () => ({
      userData: data,
      userLoading: isInitialLoading || isFetching,
      refetchingUser: isFetching,
    }),
    [data, isFetching, isInitialLoading],
  );
}
