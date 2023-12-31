import { useMemo } from "react";

import { useMutation } from "@tanstack/react-query";

import useFirebase from "@hooks/useFirebase";
import useCoreAction from "@hooks/useCoreAction";
import useOptimisticUpdate from "@hooks/useOptimisticUpdate";

export default function useMarkAway(props = {}) {
  const { onSuccess } = props;
  const { user } = useFirebase();
  const update = useOptimisticUpdate();
  const { markAway } = useCoreAction();

  const { isLoading, mutate } = useMutation(() => markAway(user?.uid), {
    onMutate: () => {
      update(["user", user?.uid], (old) => ({
        ...old,
        markedFreeTill: null,
      }));
    },
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  return useMemo(
    () => ({
      markingAway: isLoading,
      markAway: mutate,
    }),
    [isLoading, mutate],
  );
}
