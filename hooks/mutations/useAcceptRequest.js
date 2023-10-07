import { useMemo } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import useFirebase from "@hooks/useFirebase";
import useFriendGraph from "@hooks/useFriendGraph";
import useOptimisticUpdate from "@hooks/useOptimisticUpdate";

export default function useAcceptRequest(props = {}) {
  const { user } = useFirebase();
  const update = useOptimisticUpdate();
  const queryClient = useQueryClient();
  const { onMutate, onSuccess } = props;
  const { acceptRequest } = useFriendGraph();

  const { isLoading, mutate } = useMutation(
    (senderUid) => acceptRequest(user?.uid, senderUid),
    {
      onMutate: (senderUid) => {
        update(["user", user?.uid], (old) => ({
          ...old,
          friends: [...old?.friends, senderUid],
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

        if (onSuccess) {
          onSuccess();
        }
      },
    },
  );

  return useMemo(
    () => ({
      accepting: isLoading,
      acceptRequest: mutate,
    }),
    [isLoading, mutate],
  );
}
