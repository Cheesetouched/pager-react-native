import { useMemo } from "react";

import { useMutation } from "@tanstack/react-query";

import useFirestore from "@hooks/useFirestore";

export default function useCreateUser(props = {}) {
  const { onSuccess } = props;
  const { createUser } = useFirestore();

  const { isLoading, mutate } = useMutation(
    ({ uid, data }) => createUser(uid, data),
    { onSuccess },
  );

  return useMemo(
    () => ({
      creating: isLoading,
      createUser: mutate,
    }),
    [isLoading, mutate],
  );
}
