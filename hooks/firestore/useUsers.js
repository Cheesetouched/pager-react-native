import { useCallback } from "react";

import {
  arrayRemove,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import useFirebase from "@hooks/useFirebase";

export default function useUsers() {
  const { firestore } = useFirebase();

  const deleteUser = useCallback(
    async (uid) => {
      const user = await get(uid);
      const userDoc = doc(firestore, "users", uid);

      await Promise.all(
        user?.friends?.map((friendUid) => {
          update(friendUid, { friends: arrayRemove(uid) });
        }),
      );

      return await deleteDoc(userDoc);
    },
    [firestore, get, update],
  );

  const get = useCallback(
    async (uid) => {
      const userDoc = doc(firestore, "users", uid);
      const user = await getDoc(userDoc);

      return {
        id: user.id,
        ...user.data(),
        markedFreeTill: user?.data()?.markedFreeTill?.toMillis(),
      };
    },
    [firestore],
  );

  const getFriends = useCallback(
    async (friends) => {
      return await Promise.all(
        friends.map(async (uid) => {
          const user = await get(uid);
          return user;
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

  return { deleteUser, get, getFriends, update };
}
