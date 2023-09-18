import { useCallback } from "react";

import { collection, getDocs, query, where } from "firebase/firestore";

import useFirebase from "@hooks/useFirebase";

export default function useFirestore() {
  const { firestore } = useFirebase();

  const checkHandle = useCallback(
    async (handle) => {
      try {
        const usersRef = collection(firestore, "users");
        const q = query(usersRef, where("handle", "==", handle));
        const users = await getDocs(q);
        return { exists: users.size > 0 };
      } catch (error) {
        throw error;
      }
    },
    [firestore],
  );

  return { checkHandle };
}
