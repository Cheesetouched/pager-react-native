import { useCallback, useMemo } from "react";

import { Timestamp } from "firebase/firestore";

import useUsers from "@hooks/firestore/useUsers";

export default function useCoreAction() {
  const Users = useUsers();

  const markBusy = useCallback(
    async (uid) => {
      try {
        Users.update(uid, { freeTill: null });

        return { success: true };
      } catch (error) {
        throw error;
      }
    },
    [Users],
  );

  const markFree = useCallback(
    async (uid) => {
      try {
        Users.update(uid, {
          freeTill: Timestamp.fromDate(new Date(Date.now() + 1000 * 60 * 60)),
        });

        return { success: true };
      } catch (error) {
        throw error;
      }
    },
    [Users],
  );

  return useMemo(
    () => ({
      markBusy,
      markFree,
    }),
    [markBusy, markFree],
  );
}
