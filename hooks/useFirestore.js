import { useCallback } from "react";

import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import useFirebase from "@hooks/useFirebase";
import useUsers from "./firestore/useUsers";

export default function useFirestore() {
  const Users = useUsers();
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

  const checkInvites = useCallback(
    async (number) => {
      try {
        const inviteRef = doc(firestore, "invites", number);
        const invite = await getDoc(inviteRef);

        if (invite.exists()) {
          const invitedBy = invite.data().invited_by;

          const inviters = await Promise.all(
            invitedBy.map(async (inviter) => {
              const userRef = doc(firestore, "users", inviter);
              const user = await getDoc(userRef);
              return { id: user.id, ...user.data() };
            }),
          );

          return { success: true, inviters };
        } else {
          return { success: false };
        }
      } catch (error) {
        throw error;
      }
    },
    [firestore],
  );

  const createUser = useCallback(
    async (uid, data) => {
      try {
        const userRef = doc(firestore, "users", uid);
        await setDoc(userRef, data);
        return { success: true };
      } catch (error) {
        throw error;
      }
    },
    [firestore],
  );

  const getUser = useCallback(
    async (id, withFriends = false) => {
      try {
        const userRef = doc(firestore, "users", id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const user = {
            id: userDoc.id,
            ...userDoc.data(),
            freeTill: userDoc?.data()?.freeTill?.toMillis(),
          };

          if (withFriends) {
            user["friendList"] = await Users.getFriends(user?.friends);
          }

          return user;
        }

        return null;
      } catch (error) {
        throw error;
      }
    },
    [Users, firestore],
  );

  const getUserByNumber = useCallback(
    async (number) => {
      try {
        const usersRef = collection(firestore, "users");
        const q = query(usersRef, where("phone.full", "==", number));
        const users = await getDocs(q);

        return {
          exists: users.size > 0,
          success: true,
          user:
            users.size > 0
              ? { id: users.docs[0].id, ...users.docs[0].data() }
              : null,
        };
      } catch (error) {
        throw error;
      }
    },
    [firestore],
  );

  const inviteUser = useCallback(
    async (number, invited_by) => {
      try {
        const inviteRef = doc(firestore, "invites", number);

        await setDoc(
          inviteRef,
          { invited_by: arrayUnion(invited_by) },
          { merge: true },
        );

        return { success: true };
      } catch (error) {
        throw error;
      }
    },
    [firestore],
  );

  return {
    checkHandle,
    checkInvites,
    createUser,
    getUser,
    getUserByNumber,
    inviteUser,
  };
}
