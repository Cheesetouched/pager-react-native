import { useCallback, useMemo } from "react";

import { Timestamp } from "firebase/firestore";

import usePages from "@hooks/firestore/usePages";

export default function useCoreAction() {
  const Pages = usePages();

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

  const page = useCallback(
    async (from, to) => {
      return await Pages.add({
        from,
        to,
        sentAt: Timestamp.now(),
        validTill: Timestamp.fromDate(new Date(Date.now() + 1000 * 60 * 60)),
      });
    },
    [Pages],
  );

  const respondToPage = useCallback(
    async (pageId, response) => {
      if (response?.free) {
        // Send Notification
      }

      return await Pages.update(pageId, response);
    },
    [Pages],
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
