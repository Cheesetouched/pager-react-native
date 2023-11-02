import { useMemo } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import useFirestore from "@hooks/useFirestore";

export default function useInviteUser(props = {}) {
  const { onSuccess } = props;
  const queryClient = useQueryClient();
  const { inviteUser } = useFirestore();

  const { isLoading, mutate } = useMutation(
    ({ number, invited_by }) => inviteUser(number, invited_by),
    {
      onSuccess: (result, vars) => {
        if (onSuccess) onSuccess(result, vars);
        queryClient.invalidateQueries("inviteCount");
      },
    },
  );

  return useMemo(
    () => ({
      inviting: isLoading,
      inviteUser: mutate,
    }),
    [isLoading, mutate],
  );
}
