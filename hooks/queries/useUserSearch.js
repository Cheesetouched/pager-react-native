import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import useAlgolia from "@hooks/useAlgolia";
import useFirebase from "@hooks/useFirebase";

export default function useUserSearch(query, minimumLength = 2) {
  const { user } = useFirebase();
  const { searchUsers } = useAlgolia();

  const { data, isInitialLoading, isFetching } = useQuery(
    ["search", query],
    async () => {
      const eligibleSearch = [];
      const search = await searchUsers(query);

      if (search?.results?.length > 0) {
        // Removing people who are already friends
        // Also removing logged in user
        search?.results?.map((result) => {
          if (
            !result?.friends?.includes(user?.uid) &&
            result?.id !== user?.uid
          ) {
            eligibleSearch.push(result);
          }
        });
      }

      return { ...search, results: eligibleSearch };
    },
    {
      enabled: typeof query === "string" && query.length > minimumLength,
    },
  );

  return useMemo(
    () => ({
      ...data,
      searching: isInitialLoading || isFetching,
    }),
    [data, isFetching, isInitialLoading],
  );
}
