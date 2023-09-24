import { useCallback, useMemo } from "react";

import { arrayUnion } from "firebase/firestore";

import useUsers from "@hooks/firestore/useUsers";

export default function useFriendGraph() {
  const Users = useUsers();

  const addFriend = useCallback(
    async (adderUid, addeeUid) => {
      try {
        await Promise.all([
          Users.updateUser(adderUid, {
            sentRequests: arrayUnion(addeeUid),
          }),
          Users.updateUser(addeeUid, {
            pendingRequests: arrayUnion(adderUid),
          }),
        ]);
      } catch (error) {
        throw error;
      }
    },
    [Users],
  );

  return useMemo(
    () => ({
      addFriend,
    }),
    [addFriend],
  );
}
