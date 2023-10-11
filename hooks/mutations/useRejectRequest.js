import { useMemo } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import useFirebase from "@hooks/useFirebase";
import useFriendGraph from "@hooks/useFriendGraph";
import useOptimisticUpdate from "@hooks/useOptimisticUpdate";

export default function useRejectRequest(props = {}) {
  const { user } = useFirebase();
  const queryClient = useQueryClient();
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

        update(["requests", user?.uid], (old) =>
          old.filter((request) => request?.id !== senderUid),
        );

        if (onMutate) {
          onMutate();
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["friends"]);
        queryClient.invalidateQueries(["checkInvites"]);
        queryClient.invalidateQueries(["contactsSearch"]);
        queryClient.invalidateQueries(["user", user?.uid]);
        queryClient.invalidateQueries(["requests", user?.uid]);

        if (onSuccess) {
          onSuccess();
        }
      },
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
