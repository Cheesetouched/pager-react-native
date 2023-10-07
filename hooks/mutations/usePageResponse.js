import { useMemo } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import useFirebase from "@hooks/useFirebase";
import useCoreAction from "@hooks/useCoreAction";

export default function usePageResponse(props = {}) {
  const { onSuccess } = props;
  const { user } = useFirebase();
  const queryClient = useQueryClient();
  const { respondToPage } = useCoreAction();

  const { isLoading, mutate } = useMutation((data) => respondToPage(data), {
    onSuccess: () => {
      //TO-DO: Update this optimisitically
      queryClient.invalidateQueries(["detailedPages", user?.uid]);

      if (onSuccess) {
        onSuccess();
      }
    },
  });

  return useMemo(
    () => ({
      responding: isLoading,
      respond: mutate,
    }),
    [isLoading, mutate],
  );
}
