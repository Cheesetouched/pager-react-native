import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function useOptimisticUpdate() {
  const queryClient = useQueryClient();

  return useCallback(
    async (queryKey, updater) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, updater);

      return previous;
    },
    [queryClient],
  );
}
