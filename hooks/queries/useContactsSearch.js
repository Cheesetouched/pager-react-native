import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import useAlgolia from "@hooks/useAlgolia";
import useFirebase from "@hooks/useFirebase";

export default function useContactsSearch(numbers) {
  const { user } = useFirebase();
  const { contactsSearch } = useAlgolia();

  const { data, isInitialLoading, isFetching } = useQuery(
    ["contactsSearch"],
    async () => {
      const eligibleContacts = [];
      const search = await contactsSearch(numbers);

      if (search?.results?.length > 0) {
        search?.results?.map((result) => {
          if (!result?.friends?.includes(user?.uid)) {
            eligibleContacts.push(result);
          }
        });
      }

      return { ...search, results: eligibleContacts };
    },
    {
      enabled:
        numbers !== undefined &&
        typeof numbers === "object" &&
        numbers?.length > 0 &&
        user?.uid !== undefined &&
        typeof user?.uid === "string",
    },
  );

  return useMemo(
    () => ({
      ...data,
      searching: isInitialLoading || isFetching,
    }),
    [data, isFetching, isInitialLoading],
  );
}
