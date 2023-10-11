import { useMemo } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import useFriendGraph from "@hooks/useFriendGraph";
import useOptimisticUpdate from "@hooks/useOptimisticUpdate";

export default function useAddFriend(props = {}) {
  const { onSuccess } = props;
  const queryClient = useQueryClient();
  const update = useOptimisticUpdate();
  const { addFriend } = useFriendGraph();

  const { isLoading, mutate } = useMutation(
    ({ adderUid, addeeUid }) => addFriend(adderUid, addeeUid),
    {
      onMutate: ({ adderUid, addeeUid }) => {
        update(["user", adderUid], (old) => ({
          ...old,
          sentRequests: [...old?.sentRequests, addeeUid],
        }));
      },
      onSuccess: (_, { adderUid }) => {
        queryClient.invalidateQueries(["user", adderUid]);

        if (onSuccess) {
          onSuccess();
        }
      },
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
