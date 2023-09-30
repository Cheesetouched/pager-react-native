import { useCallback, useMemo } from "react";

import useUsers from "@hooks/firestore/useUsers";

function valid(pushToken) {
  if (pushToken && pushToken !== "simulator") {
    return true;
  } else {
    return false;
  }
}

async function sendRequest(message) {
  return await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

export default function usePushNotification() {
  const Users = useUsers();

  const notifyFriends = useCallback(
    async (uid, { title, message }) => {
      const user = await Users.get(uid);
      const friends = await Users.getFriends(user?.friends);

      friends.map(({ pushToken }) => {
        if (valid(pushToken)) {
          send(pushToken, { title, message });
        }
      });
    },
    [Users, send],
  );

  const notifyUser = useCallback(
    async (uid, { title, message }) => {
      const { pushToken } = await Users.get(uid);

      if (valid(pushToken)) {
        send(pushToken, { title, message });
      }
    },
    [Users, send],
  );

  const requestAccepted = useCallback(
    async (accepterUid, senderUid) => {
      const [accepter, sender] = await Promise.all([
        Users.get(accepterUid),
        Users.get(senderUid),
      ]);

      if (valid(sender?.pushToken)) {
        send(sender?.pushToken, {
          title: accepter?.name,
          message: "accepted your friend request!",
        });
      }
    },
    [Users, send],
  );

  const requestSent = useCallback(
    async (adderUid, addeeUid) => {
      const [adder, addee] = await Promise.all([
        Users.get(adderUid),
        Users.get(addeeUid),
      ]);

      if (valid(addee?.pushToken)) {
        send(addee?.pushToken, {
          title: adder?.name,
          message: "sent you a friend request!",
        });
      }
    },
    [Users, send],
  );

  const send = useCallback(async (to, { title, message }) => {
    return await sendRequest({
      to,
      title,
      message,
      sound: "default",
    });
  }, []);

  return useMemo(
    () => ({
      notifyFriends,
      notifyUser,
      requestAccepted,
      requestSent,
      send,
    }),
    [notifyFriends, notifyUser, requestAccepted, requestSent, send],
  );
}
