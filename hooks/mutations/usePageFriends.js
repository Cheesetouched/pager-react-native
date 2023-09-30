import { useMemo } from "react";

import { useMutation } from "@tanstack/react-query";

import useFirebase from "@hooks/useFirebase";
import useCoreAction from "@hooks/useCoreAction";
import useOptimisticUpdate from "@hooks/useOptimisticUpdate";

export default function usePageFriends(props = {}) {
  const { onSuccess } = props;
  const { user } = useFirebase();
  const update = useOptimisticUpdate();
  const { pageFriends } = useCoreAction();

  const { isLoading, mutate } = useMutation(() => pageFriends(user?.uid), {
    onMutate: () => {
      update(["user", user?.uid], (old) => ({
        ...old,
        freeTill: Date.now() + 1000 * 60 * 60,
      }));
    },
    onSuccess,
  });

  return useMemo(
    () => ({
      paging: isLoading,
      pageFriends: mutate,
    }),
    [isLoading, mutate],
  );
}
