import { useMemo } from "react";

import { useMutation } from "@tanstack/react-query";

import useFirebase from "@hooks/useFirebase";
import useFriendGraph from "@hooks/useFriendGraph";
import useOptimisticUpdate from "@hooks/useOptimisticUpdate";

export default function useRejectRequest(props = {}) {
  const { user } = useFirebase();
  const update = useOptimisticUpdate();
  const { onMutate, onSuccess } = props;
  const { rejectRequest } = useFriendGraph();

  const { isLoading, mutate } = useMutation(
    (senderUid) => rejectRequest(user?.uid, senderUid),
    {
      onMutate: (senderUid) => {
        update(["user", user?.uid], (old) => ({
          ...old,
          pendingRequests: old?.pendingRequests?.filter(
            (uid) => uid !== senderUid,
          ),
        }));

        if (onMutate) {
          onMutate();
        }
      },
      onSuccess,
    },
  );

  return useMemo(
    () => ({
      rejecting: isLoading,
      rejectRequest: mutate,
    }),
    [isLoading, mutate],
  );
}
