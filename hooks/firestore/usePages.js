import { useCallback, useMemo } from "react";

import {
  addDoc,
  collection,
  getDocs,
  limit,
  or,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import useFirebase from "@hooks/useFirebase";

export default function usePages() {
  const { firestore } = useFirebase();
  const pages = collection(firestore, "pages");

  const add = useCallback(
    async (data) => {
      return await addDoc(pages, data);
    },
    [pages],
  );

  const getAll = useCallback(
    async (uid) => {
      const q = query(
        pages,
        or(where("from", "==", uid), where("to", "==", uid)),
        orderBy("sentAt", "desc"),
        limit(10),
      );

      const results = await getDocs(q);
      return results.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    },
    [pages],
  );

  return useMemo(
    () => ({
      add,
      getAll,
    }),
    [add, getAll],
  );
}
