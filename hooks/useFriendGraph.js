import { useCallback, useMemo } from "react";

import {} from "firebase/firestore";

import useFirebase from "@hooks/useFirebase";
import UserHelper from "@utils/firestore/users";

export default function useFriendGraph() {
  const Users = UserHelper();
  const { firestore } = useFirebase();

  const addFriend = useCallback(async (adderUid, addeeUid) => {
    try {
      Users;
    } catch (error) {
      throw error;
    }
  }, []);

  return useMemo(
    () => ({
      addFriend,
    }),
    [],
  );
}
