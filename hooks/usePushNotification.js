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
    async (friends, { data, title, body }) => {
      const allFriends = await Users.getFriends(friends);

      return await Promise.all(
        allFriends.map(async ({ pushToken }) => {
          if (valid(pushToken)) {
            await send(pushToken, { data, title, body });
          }
        }),
      );
    },
    [Users, send],
  );

  const notifyUser = useCallback(
    async (uid, { data, title, body }) => {
      const { pushToken } = await Users.get(uid);

      if (valid(pushToken)) {
        send(pushToken, { data, title, body });
      }
    },
    [Users, send],
  );

  const pageAccepted = useCallback(
    async (accepterUid, senderUid) => {
      const [accepter, sender] = await Promise.all([
        Users.get(accepterUid),
        Users.get(senderUid),
      ]);

      if (valid(sender?.pushToken)) {
        send(sender?.pushToken, {
          data: { action: "open_contact", uid: accepterUid },
          body: `${accepter?.name?.split(" ")[0]} is free to chat! 👋🏻`,
        });
      }
    },
    [Users, send],
  );

  const pageLater = useCallback(
    async ({ accepterUid, senderUid, laterAt }) => {
      const [accepter, sender] = await Promise.all([
        Users.get(accepterUid),
        Users.get(senderUid),
      ]);

      if (valid(sender?.pushToken)) {
        send(sender?.pushToken, {
          body: `${
            accepter?.name?.split(" ")[0]
          } is free to chat at ${laterAt}`,
        });
      }
    },
    [Users, send],
  );

  const pageUser = useCallback(
    async (pagerUid, pageeUid) => {
      const [pager, pagee] = await Promise.all([
        Users.get(pagerUid),
        Users.get(pageeUid),
      ]);

      if (valid(pagee?.pushToken)) {
        send(pagee?.pushToken, {
          data: { event: "tapped_page_notification" },
          title: `${pager?.name?.split(" ")[0]} paged you`,
          body: "Let them know if you’re free to chat!",
        });
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
          data: { action: "invalidate_user" },
          title: accepter?.name,
          body: "accepted your friend request!",
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
          data: { action: "open_requests" },
          title: adder?.name,
          body: "sent you a friend request!",
        });
      }
    },
    [Users, send],
  );

  const send = useCallback(async (to, { data, title, body }) => {
    return await sendRequest({
      to,
      title,
      body,
      data,
      sound: "default",
    });
  }, []);

  return useMemo(
    () => ({
      notifyFriends,
      notifyUser,
      pageAccepted,
      pageLater,
      pageUser,
      requestAccepted,
      requestSent,
      send,
    }),
    [
      notifyFriends,
      notifyUser,
      pageAccepted,
      pageLater,
      pageUser,
      requestAccepted,
      requestSent,
      send,
    ],
  );
}
