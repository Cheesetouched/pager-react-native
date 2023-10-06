import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import useFirebase from "@hooks/useFirebase";
import useCoreAction from "@hooks/useCoreAction";

export default function useGetPages() {
  const { user } = useFirebase();
  const { getPages } = useCoreAction();

  const { data, isInitialLoading, isFetching } = useQuery(
    ["pages", user?.uid],
    () => getPages(user?.uid),
    { enabled: typeof user?.uid === "string" },
  );

  return useMemo(
    () => ({
      getting: isInitialLoading || isFetching,
      pages: data,
    }),
    [data, isFetching, isInitialLoading],
  );
}
