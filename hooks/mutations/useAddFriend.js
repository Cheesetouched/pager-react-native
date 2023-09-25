import { useMemo } from "react";

import { useMutation } from "@tanstack/react-query";

import useFriendGraph from "@hooks/useFriendGraph";
import useOptimisticUpdate from "@hooks/useOptimisticUpdate";

export default function useAddFriend(props = {}) {
  const { onSuccess } = props;
  const update = useOptimisticUpdate();
  const { addFriend } = useFriendGraph();

  const { isLoading, mutate } = useMutation(
    ({ adderUid, addeeUid }) => addFriend(adderUid, addeeUid),
    {
      onMutate: ({ adderUid, addeeUid }) =>
        update(["user", adderUid], (old) => ({
          ...old,
          sentRequests: [...old?.sentRequests, addeeUid],
        })),
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
