import { useMemo } from "react";

import { useMutation } from "@tanstack/react-query";

import useFirebase from "@hooks/useFirebase";
import useFriendGraph from "@hooks/useFriendGraph";
import useOptimisticUpdate from "@hooks/useOptimisticUpdate";

export default function useAcceptRequest(props = {}) {
  const { onSuccess } = props;
  const { user } = useFirebase();
  const update = useOptimisticUpdate();
  const { acceptRequest } = useFriendGraph();

  const { isLoading, mutate } = useMutation(
    (senderUid) => {
      return "yo";
    },
    {
      onMutate: (senderUid) => {
        update(["requests", user?.uid], (old) =>
          old?.filter((request) => request?.id !== senderUid),
        );

        update(["user", user?.uid], (old) => ({
          ...old,
          pendingRequests: old?.pendingRequests?.filter(
            (uid) => uid !== senderUid,
          ),
        }));
      },
      onSuccess,
    },
  );

  return useMemo(
    () => ({
      adding: isLoading,
      addFriend: mutate,
    }),
    [isLoading, mutate],
  );
}
