import { useMemo } from "react";

import { useMutation } from "@tanstack/react-query";

import useFirebase from "@hooks/useFirebase";
import useFriendGraph from "@hooks/useFriendGraph";
import useOptimisticUpdate from "@hooks/useOptimisticUpdate";

export default function useAcceptRequest(props = {}) {
  const { user } = useFirebase();
  const update = useOptimisticUpdate();
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

        if (onMutate) {
          onMutate();
        }
      },
      onSuccess,
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
