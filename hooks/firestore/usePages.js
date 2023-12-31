import { useCallback, useMemo } from "react";

import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  or,
  orderBy,
  query,
  setDoc,
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

        if (page?.response?.freeFrom) {
          page["response"]["freeFrom"] = page?.response?.freeFrom?.toMillis();
        }

        if (page?.response?.freeTill) {
          page.response["freeTill"] = page?.response?.freeTill?.toMillis();
        }

        page["sentAt"] = page?.sentAt?.toMillis();
        page["validTill"] = page?.validTill?.toMillis();

        return page;
      });
    },
    [pages],
  );

  const update = useCallback(
    async (id, data) => {
      const pageDoc = doc(firestore, "pages", id);
      return await setDoc(pageDoc, data, { merge: true });
    },
    [firestore],
  );

  return useMemo(
    () => ({
      add,
      getAll,
      update,
    }),
    [add, getAll, update],
  );
}
