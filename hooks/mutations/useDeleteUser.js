import { useMemo } from "react";

import { useMutation } from "@tanstack/react-query";

import useStorage from "@hooks/useStorage";
import useFirebase from "@hooks/useFirebase";
import useUsers from "@hooks/firestore/useUsers";

export default function useDeleteUser(props = {}) {
  const { onSuccess } = props;
  const { user } = useFirebase();
  const { deleteUser } = useUsers();
  const { deleteDp } = useStorage();

  const { isLoading, mutate } = useMutation(
    async () => {
      return await Promise.all([deleteDp(), deleteUser(user?.uid)]);
    },
    {
      onSuccess: () => {
        if (onSuccess) {
          onSuccess();
        }
      },
    },
  );

  return useMemo(
    () => ({
      deleting: isLoading,
      deleteUser: mutate,
    }),
    [isLoading, mutate],
  );
}
