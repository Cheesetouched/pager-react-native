import { useMemo } from "react";

import { useMutation } from "@tanstack/react-query";

import useFirebase from "@hooks/useFirebase";
import useUsers from "@hooks/firestore/useUsers";

export default function useUpdateUser(props = {}) {
  const { onSuccess } = props;
  const { update } = useUsers();
  const { user } = useFirebase();

  const { isLoading, mutate } = useMutation((data) => update(user?.uid, data), {
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  return useMemo(
    () => ({
      updating: isLoading,
      update: mutate,
    }),
    [isLoading, mutate],
  );
}
