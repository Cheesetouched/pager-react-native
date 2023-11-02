import { useCallback, useMemo } from "react";

import { collection, getDocs, query, where } from "firebase/firestore";

import useFirebase from "@hooks/useFirebase";

export default function useInvites() {
  const { firestore } = useFirebase();
  const invites = collection(firestore, "invites");

  const getInviteCount = useCallback(
    async (uid) => {
      const q = query(invites, where("invited_by", "array-contains", uid));
      const invited = await getDocs(q);
      return { invites: invited.size };
    },
    [invites],
  );

  return useMemo(
    () => ({
      getInviteCount,
    }),
    [getInviteCount],
  );
}
