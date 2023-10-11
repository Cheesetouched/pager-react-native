import { useCallback } from "react";

import { doc, getDoc, setDoc } from "firebase/firestore";

import useFirebase from "@hooks/useFirebase";

export default function useUsers() {
  const { firestore } = useFirebase();

  const get = useCallback(
    async (uid) => {
      const userDoc = doc(firestore, "users", uid);
      const user = await getDoc(userDoc);
      return { id: user.id, ...user.data() };
    },
    [firestore],
  );

  const getFriends = useCallback(
    async (friends) => {
      return await Promise.all(
        friends.map(async (uid) => {
          const user = await get(uid);
          return {
            ...user,
            freeTill: user?.freeTill?.toMillis(),
          };
        }),
      );
    },
    [get],
  );

  const update = useCallback(
    async (uid, data) => {
      const userDoc = doc(firestore, "users", uid);
      return await setDoc(userDoc, data, { merge: true });
    },
    [firestore],
  );

  return { get, getFriends, update };
}
