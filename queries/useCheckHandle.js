import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import useFirestore from "@hooks/useFirestore";

export default function useCheckHandle(handle) {
  const { checkHandle } = useFirestore();

  const { data, isInitialLoading, isFetching } = useQuery(
    ["checkHandle", handle],
    async () => {
      const { exists } = await checkHandle(handle);
      return exists;
    },
    {
      enabled: handle !== "" && typeof handle === "string",
    },
  );

  return useMemo(
    () => ({
      checking: isInitialLoading || isFetching,
      exists: data,
      ready: data !== undefined,
    }),
    [data, isFetching, isInitialLoading],
  );
}
