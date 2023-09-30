import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import useFirebase from "@hooks/useFirebase";
import useFirestore from "@hooks/useFirestore";

export default function useUser(props = {}) {
  const { user } = useFirebase();
  const { getUser } = useFirestore();
  const { withFriends = false } = props;

  const { data, isInitialLoading, isFetching } = useQuery(
    ["user", user?.uid],
    () => getUser(user?.uid, withFriends),
    {
      enabled: user !== null && user !== undefined,
      staleTime: 10 * (1000 * 60),
    },
  );

  return useMemo(
    () => ({
      userData: data,
      userLoading: isInitialLoading || isFetching,
    }),
    [data, isFetching, isInitialLoading],
  );
}
