import { useCallback, useMemo } from "react";

import { addHours } from "date-fns";
import { Timestamp } from "firebase/firestore";

import usePages from "@hooks/firestore/usePages";
import usePushNotification from "@hooks/usePushNotification";

export default function useCoreAction() {
  const Pages = usePages();
  const PushNotification = usePushNotification();

  const getPages = useCallback(
    async (uid) => {
      const sent = [];
      const received = [];
      const pages = await Pages.getAll(uid);

      pages.map((page) => {
        if (page?.response?.freeFrom) {
          page["response"]["freeFrom"] = page?.response?.freeFrom?.toMillis();
        }

        if (page?.response?.freeTill) {
          page["response"]["freeTill"] = page?.response?.freeTill?.toMillis();
        }

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

  const page = useCallback(
    async (from, to) => {
      PushNotification.pageUser(from, to);

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
      getPages,
      page,
      respondToPage,
    }),
    [getPages, page, respondToPage],
  );
}
