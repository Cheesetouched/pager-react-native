import { useMemo } from "react";

import { useMutation } from "@tanstack/react-query";

import useFirebase from "@hooks/useFirebase";
import useCoreAction from "@hooks/useCoreAction";
import useOptimisticUpdate from "@hooks/useOptimisticUpdate";

export default function useMarkBusy(props = {}) {
  const { onSuccess } = props;
  const { user } = useFirebase();
  const update = useOptimisticUpdate();
  const { markBusy } = useCoreAction();

  const { isLoading, mutate } = useMutation(() => markBusy(user?.uid), {
    onMutate: () => {
      update(["user", user?.uid], (old) => ({
        ...old,
        freeTill: null,
      }));
    },
    onSuccess,
  });

  return useMemo(
    () => ({
      markingBusy: isLoading,
      markBusy: mutate,
    }),
    [isLoading, mutate],
  );
}
