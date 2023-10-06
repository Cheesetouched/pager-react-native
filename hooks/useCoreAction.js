import { useCallback, useMemo } from "react";

import { Timestamp } from "firebase/firestore";

import useUsers from "@hooks/firestore/useUsers";
import usePushNotification from "@hooks/usePushNotification";

export default function useCoreAction() {
  const Users = useUsers();
  const PushNotification = usePushNotification();

  return useMemo(() => ({}), []);
}
