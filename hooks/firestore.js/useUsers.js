import { useCallback } from "react";

import { doc, setDoc } from "firebase/firestore";

import useFirebase from "@hooks/useFirebase";

export default function useUsers() {
  const { firestore } = useFirebase();

  const updateUser = useCallback(
    async (uid, data) => {
      const userDoc = doc(firestore, "users", uid);
      return await setDoc(userDoc, data, { merge: true });
    },
    [firestore],
  );

  return { updateUser };
}
