import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import useUser from "@hooks/useUser";
import useCoreAction from "@hooks/useCoreAction";

export default function useGetDetailedPages() {
  const { userData } = useUser();
  const { getDetailedPages } = useCoreAction();

  const { data, isInitialLoading, isFetching } = useQuery(
    ["detailedPages", userData?.id],
    async () => {
      const pages = await getDetailedPages(userData?.id);

      pages["received"] = pages?.received?.map((page) => ({
        ...page,
        to: userData,
      }));

      pages["sent"] = pages?.sent?.map((page) => ({
        ...page,
        from: userData,
      }));

      return pages;
    },
    { enabled: typeof userData?.id === "string" },
  );

  return useMemo(
    () => ({
      getting: isInitialLoading || isFetching,
      pages: data,
      refetchingPages: isFetching,
    }),
    [data, isFetching, isInitialLoading],
  );
}
