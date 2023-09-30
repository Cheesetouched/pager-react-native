import { useCallback, useMemo } from "react";

import { Timestamp } from "firebase/firestore";

import useUsers from "@hooks/firestore/useUsers";
import usePushNotification from "@hooks/usePushNotification";

export default function useCoreAction() {
  const Users = useUsers();
  const PushNotification = usePushNotification();

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

        PushNotification.notifyFriends(uid, {
          title: "Someone is free!",
          body: "Mark yourself as free to see who it is!",
        });
        return { success: true };
      } catch (error) {
        throw error;
      }
    },
    [PushNotification, Users],
  );

  return useMemo(
    () => ({
      markBusy,
      markFree,
    }),
    [markBusy, markFree],
  );
}
