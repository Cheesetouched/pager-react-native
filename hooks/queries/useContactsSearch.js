import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import useAlgolia from "@hooks/useAlgolia";

export default function useContactsSearch(numbers) {
  const { contactsSearch } = useAlgolia();

  const { data, isInitialLoading, isFetching } = useQuery(
    ["contactsSearch"],
    async () => contactsSearch(numbers),
    {
      enabled:
        numbers !== undefined &&
        typeof numbers === "object" &&
        numbers?.length > 0,
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
