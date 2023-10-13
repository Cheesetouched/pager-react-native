import { useCallback, useMemo } from "react";

import { arrayRemove, arrayUnion } from "firebase/firestore";

import useUsers from "@hooks/firestore/useUsers";
import usePushNotification from "@hooks/usePushNotification";

export default function useFriendGraph() {
  const Users = useUsers();
  const PushNotification = usePushNotification();

  const acceptRequest = useCallback(
    async (accepterUid, senderUid) => {
      try {
        const result = await Promise.all([
          Users.update(accepterUid, {
            friends: arrayUnion(senderUid),
            pendingRequests: arrayRemove(senderUid),
          }),
          Users.update(senderUid, {
            friends: arrayUnion(accepterUid),
            sentRequests: arrayRemove(accepterUid),
          }),
        ]);

        //TO-DO: Enable this before shipping
        //PushNotification.requestAccepted(accepterUid, senderUid);
        return result;
      } catch (error) {
        throw error;
      }
    },
    [PushNotification, Users],
  );

  const addFriend = useCallback(
    async (adderUid, addeeUid) => {
      try {
        const result = await Promise.all([
          Users.update(adderUid, {
            sentRequests: arrayUnion(addeeUid),
          }),
          Users.update(addeeUid, {
            pendingRequests: arrayUnion(adderUid),
          }),
        ]);

        PushNotification.requestSent(adderUid, addeeUid);
        return result;
      } catch (error) {
        throw error;
      }
    },
    [PushNotification, Users],
  );

  const getFriends = useCallback(
    async (friends) => {
      return await Promise.all(
        friends.map(async (uid) => {
          const user = await Users.get(uid);
          return user;
        }),
      );
    },
    [Users],
  );

  const getRequests = useCallback(
    async (uid) => {
      try {
        const user = await Users.get(uid);

        const requests = await Promise.all(
          user?.pendingRequests?.map(async (uid) => {
            return await Users.get(uid);
          }),
        );

        return requests;
      } catch (error) {
        throw error;
      }
    },
    [Users],
  );

  const rejectRequest = useCallback(
    async (rejecterUid, senderUid) => {
      try {
        const result = await Promise.all([
          Users.update(rejecterUid, {
            pendingRequests: arrayRemove(senderUid),
          }),
          Users.update(senderUid, {
            sentRequests: arrayRemove(rejecterUid),
          }),
        ]);

        return result;
      } catch (error) {
        throw error;
      }
    },
    [Users],
  );

  return useMemo(
    () => ({
      acceptRequest,
      addFriend,
      getFriends,
      getRequests,
      rejectRequest,
    }),
    [acceptRequest, addFriend, getFriends, getRequests, rejectRequest],
  );
}
