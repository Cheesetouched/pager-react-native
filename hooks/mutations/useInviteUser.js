import { useMemo } from "react";

import { useMutation } from "@tanstack/react-query";

import useFirestore from "@hooks/useFirestore";

export default function useInviteUser(props = {}) {
  const { onSuccess } = props;
  const { inviteUser } = useFirestore();

  const { isLoading, mutate } = useMutation(
    ({ number, invited_by }) => inviteUser(number, invited_by),
    { onSuccess },
  );

  return useMemo(
    () => ({
      inviting: isLoading,
      inviteUser: mutate,
    }),
    [isLoading, mutate],
  );
}
