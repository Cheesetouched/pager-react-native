import { useCallback, useMemo } from "react";

import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
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
      const yesterday = Timestamp.fromDate(
        new Date(Date.now() - 1000 * 60 * 60 * 24),
      );

      const q = query(
        query(pages, or(where("from", "==", uid), where("to", "==", uid))),
        where("sentAt", ">=", yesterday),
        orderBy("sentAt", "desc"),
      );

      const results = await getDocs(q);
      return results.docs.map((doc) => {
        const page = {
          id: doc.id,
          ...doc.data(),
        };

        page["sentAt"] = page?.sentAt?.toMillis();
        page["validTill"] = page?.validTill?.toMillis();

        return page;
      });
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
