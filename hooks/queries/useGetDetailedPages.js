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
      const received = { external: [], internal: [] };
      const pages = await getDetailedPages(userData?.id);

      pages?.received?.map((page) => {
        if (page?.type === "external") {
          received?.external?.push({
            ...page,
            to: userData,
          });
        } else {
          received?.internal?.push({
            ...page,
            to: userData,
          });
        }
      });

      pages["received"] = received;

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
