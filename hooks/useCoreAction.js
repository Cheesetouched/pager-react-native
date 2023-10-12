import { useCallback, useMemo } from "react";

import { addHours } from "date-fns";
import { Timestamp } from "firebase/firestore";

import useUsers from "@hooks/firestore/useUsers";
import usePages from "@hooks/firestore/usePages";
import usePushNotification from "@hooks/usePushNotification";

export default function useCoreAction() {
  const Users = useUsers();
  const Pages = usePages();
  const PushNotification = usePushNotification();

  const getDetailedPages = useCallback(
    async (uid) => {
      const sent = [];
      const received = [];
      const pages = await Pages.getAll(uid);

      await Promise.all(
        pages.map(async (page) => {
          if (page?.from === uid) {
            sent.push({
              ...page,
              to: await Users.get(page?.to),
            });
          } else if (page?.to === uid) {
            received.push({
              ...page,
              from: await Users.get(page?.from),
            });
          }
        }),
      );

      return { sent, received };
    },
    [Pages, Users],
  );

  const getPages = useCallback(
    async (uid) => {
      const sent = [];
      const received = [];
      const pages = await Pages.getAll(uid);

      pages.map((page) => {
        if (page?.from === uid) {
          sent.push(page);
        } else if (page?.to === uid) {
          received.push(page);
        }
      });

      return { sent, received };
    },
    [Pages],
  );

  const markAway = useCallback(
    async (uid) => {
      try {
        await Users.update(uid, { freeTill: null });

        return { success: true };
      } catch (error) {
        throw error;
      }
    },
    [Users],
  );

  const markFree = useCallback(
    async (uid) => {
      try {
        await Users.update(uid, {
          markedFreeTill: Timestamp.fromDate(
            new Date(Date.now() + 1000 * 60 * 60),
          ),
        });

        return { success: true };
      } catch (error) {
        throw error;
      }
    },
    [Users],
  );

  const page = useCallback(
    async (from, to) => {
      //TO-DO: Enable this before releasing
      //PushNotification.pageUser(from, to);

      return await Pages.add({
        from,
        to,
        sentAt: Timestamp.now(),
        validTill: Timestamp.fromDate(addHours(new Date(), 1)),
      });
    },
    [Pages, PushNotification],
  );

  const respondToPage = useCallback(
    async ({ accepterUid, pageId, response, senderUid }) => {
      if (response?.response?.free) {
        PushNotification.pageAccepted(accepterUid, senderUid);
      }

      if (response?.response?.freeFrom) {
        const laterAt = response?.response?.freeFrom.toLocaleTimeString(
          "en-US",
          {
            hour: "2-digit",
            minute: "2-digit",
          },
        );

        PushNotification.pageLater({ accepterUid, senderUid, laterAt });

        response["response"]["freeFrom"] = Timestamp.fromDate(
          response?.response?.freeFrom,
        );
      }

      if (response?.response?.freeTill) {
        response["response"]["freeTill"] = Timestamp.fromDate(
          response?.response?.freeTill,
        );
      }

      return await Pages.update(pageId, response);
    },
    [Pages, PushNotification],
  );

  return useMemo(
    () => ({
      getDetailedPages,
      getPages,
      markAway,
      markFree,
      page,
      respondToPage,
    }),
    [getDetailedPages, getPages, markAway, markFree, page, respondToPage],
  );
}
