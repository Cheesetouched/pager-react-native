import { useMemo } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import useFirebase from "@hooks/useFirebase";
import useCoreAction from "@hooks/useCoreAction";

export default function usePage(props = {}) {
  const { onSuccess } = props;
  const { user } = useFirebase();
  const { page } = useCoreAction();
  const queryClient = useQueryClient();

  const { isLoading, mutate } = useMutation((to) => page(user?.uid, to), {
    onSuccess: () => {
      queryClient.invalidateQueries(["pages", user?.uid]);
      queryClient.invalidateQueries(["detailedPages", user?.uid]);

      if (onSuccess) {
        onSuccess();
      }
    },
  });

  return useMemo(
    () => ({
      paging: isLoading,
      page: mutate,
    }),
    [isLoading, mutate],
  );
}
