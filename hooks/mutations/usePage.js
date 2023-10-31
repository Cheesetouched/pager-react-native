import { useMemo } from "react";

import { addHours } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import useFirebase from "@hooks/useFirebase";
import useCoreAction from "@hooks/useCoreAction";
import useOptimisticUpdate from "@hooks/useOptimisticUpdate";

export default function usePage(props = {}) {
  const { onSuccess } = props;
  const { user } = useFirebase();
  const { page } = useCoreAction();
  const update = useOptimisticUpdate();
  const queryClient = useQueryClient();

  const { isLoading, mutate } = useMutation(
    ({ to, note }) => page({ from: user?.uid, to, note }),
    {
      onMutate: ({ to, note }) => {
        update(["pages", user?.uid], (current) => ({
          received: current?.received,
          sent: [
            {
              id: Date.now(),
              from: user?.uid,
              to,
              note,
              sentAt: Date.now(),
              validTill: addHours(Date.now(), 1).getTime(),
            },
            ...current?.sent,
          ],
        }));
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["pages", user?.uid]);
        queryClient.invalidateQueries(["detailedPages", user?.uid]);

        if (onSuccess) {
          onSuccess();
        }
      },
    },
  );

  return useMemo(
    () => ({
      paging: isLoading,
      page: mutate,
    }),
    [isLoading, mutate],
  );
}
