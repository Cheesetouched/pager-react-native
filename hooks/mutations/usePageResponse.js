import { useMemo } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import useFirebase from "@hooks/useFirebase";
import useCoreAction from "@hooks/useCoreAction";
import useOptimisticUpdate from "@hooks/useOptimisticUpdate";

export default function usePageResponse(props = {}) {
  const { onSuccess } = props;
  const { user } = useFirebase();
  const queryClient = useQueryClient();
  const update = useOptimisticUpdate();
  const { respondToPage } = useCoreAction();

  const { isLoading, mutate } = useMutation((data) => respondToPage(data), {
    onMutate: ({ pageId, response: { response } }) => {
      update(["detailedPages", user?.uid], (current) => ({
        ...current,
        received: current?.received?.map((page) => {
          if (page?.id === pageId) {
            return {
              ...page,
              response,
            };
          } else {
            return page;
          }
        }),
      }));
    },
    onSuccess: () => {
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
