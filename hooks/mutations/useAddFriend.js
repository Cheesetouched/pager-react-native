import { useMemo } from "react";

import { useMutation } from "@tanstack/react-query";

import useFriendGraph from "@hooks/useFriendGraph";

export default function useAddFriend(props = {}) {
  const { onSuccess } = props;
  const { addFriend } = useFriendGraph();

  const { isLoading, mutate } = useMutation(
    ({ adderUid, addeeUid }) => addFriend(adderUid, addeeUid),
    { onSuccess },
  );

  return useMemo(
    () => ({
      adding: isLoading,
      addFriend: mutate,
    }),
    [isLoading, mutate],
  );
}
